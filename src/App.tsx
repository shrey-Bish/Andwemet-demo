import { useState, useMemo, useCallback } from 'react';
import { mockUsers, type User } from './data/users';
import { evaluateMatch, type MatchReasoning } from './lib/matchmaker';
import {
  Users, LayoutDashboard, Search, ShieldAlert, BrainCircuit, X, MessageSquare,
  PlayCircle, PauseCircle, Activity, Trash2, Video, Heart, Menu,
  ArrowUpDown, CheckCircle, XCircle, AlertTriangle, Save
} from 'lucide-react';

type NavPage = 'overview' | 'members';
type SortField = 'id' | 'first_name' | 'age' | 'city_of_residence' | 'last_active' | 'profile_health_score';
type SortDir = 'asc' | 'desc';
type ProfileTab = 'overview' | 'video' | 'story' | 'preferences' | 'engagement';

function App() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeNav, setActiveNav] = useState<NavPage>('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [filterPipeline, setFilterPipeline] = useState<string>('all');
  const [filterVideo, setFilterVideo] = useState<string>('all');
  const [filterEngagement, setFilterEngagement] = useState<string>('all');
  const [filterPurchase, setFilterPurchase] = useState<string>('all');
  const [filterJoined, setFilterJoined] = useState<string>('all');
  const [filterIncomplete, setFilterIncomplete] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  // Drawer
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [profileTab, setProfileTab] = useState<ProfileTab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState<Partial<User>>({});
  const [notesDraft, setNotesDraft] = useState('');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Matchmaker
  const [targetMatchId, setTargetMatchId] = useState<number | ''>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchReasoning | null>(null);

  const activeUsers = useMemo(() => users.filter(u => !u.is_soft_deleted), [users]);
  const selectedUser = users.find(u => u.id === selectedProfileId) || null;

  // --- Filtering + Sorting + Pagination ---
  const filteredUsers = useMemo(() => {
    let result = activeUsers;

    // Search by name, ID, email, phone
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(u =>
        u.first_name.toLowerCase().includes(q) ||
        u.id.toString().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.whatsapp_number.includes(q)
      );
    }

    // Dropdown filters
    if (filterPipeline !== 'all') result = result.filter(u => u.pipeline_status === filterPipeline);
    if (filterVideo === 'has') result = result.filter(u => u.video_approved);
    if (filterVideo === 'no') result = result.filter(u => !u.video_approved);
    if (filterEngagement !== 'all') result = result.filter(u => u.engagement_level === filterEngagement);
    if (filterPurchase === 'Has purchased') result = result.filter(u => u.purchase_status === 'Has purchased');
    if (filterPurchase === 'Never purchased') result = result.filter(u => u.purchase_status === 'Never purchased');
    if (filterPurchase === 'Purchased this month') result = result.filter(u => u.purchase_status === 'Purchased this month');
    if (filterJoined === 'recent') {
      const weekAgo = Date.now() - 7 * 86400000;
      result = result.filter(u => u.activity_timeline.length > 0 && new Date(u.activity_timeline[0].timestamp).getTime() > weekAgo);
    }
    if (filterIncomplete) result = result.filter(u => u.profile_health_score < 60);

    // Sort
    result = [...result].sort((a, b) => {
      let va: string | number = a[sortField] as string | number;
      let vb: string | number = b[sortField] as string | number;
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [activeUsers, searchTerm, filterPipeline, filterVideo, filterEngagement, filterPurchase, filterJoined, filterIncomplete, sortField, sortDir]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // --- Stats ---
  const stats = useMemo(() => {
    const active = activeUsers;
    const males = active.filter(u => u.gender === 'Male').length;
    const females = active.filter(u => u.gender === 'Female').length;
    const withVideo = active.filter(u => u.video_approved).length;
    const withEngagement = active.filter(u => u.engagement_level !== 'Low').length;
    const cityMap: Record<string, number> = {};
    active.forEach(u => { cityMap[u.city_of_residence] = (cityMap[u.city_of_residence] || 0) + 1; });
    const topCities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { total: active.length, males, females, withVideo, withEngagement, topCities };
  }, [activeUsers]);

  // --- Handlers ---
  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const handleToggleHold = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, pipeline_status: u.pipeline_status === 'On Hold' ? 'Available' : 'On Hold' } : u));
  };

  const handleApproveVideo = (id: number, approved: boolean) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, video_approved: approved, pipeline_status: approved ? 'Available' : 'Pending Video' } : u));
  };

  const handleSoftDelete = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_soft_deleted: true, soft_deleted_at: new Date().toISOString() } : u));
    setShowDeleteConfirm(false);
    closeDrawer();
  };

  const handleSaveNotes = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, admin_notes: notesDraft } : u));
  };

  const handleStartEdit = () => {
    if (!selectedUser) return;
    setEditDraft({ ...selectedUser });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedUser) return;
    setShowSaveConfirm(true);
  };

  const confirmSaveEdit = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...editDraft, first_name: u.first_name } : u));
    setIsEditing(false);
    setShowSaveConfirm(false);
  };

  const handleRunMatch = async () => {
    if (!selectedUser || !targetMatchId) return;
    const targetUser = users.find(u => u.id === targetMatchId);
    if (!targetUser) return;
    setIsAnalyzing(true);
    setMatchResult(null);
    try {
      const result = await evaluateMatch(selectedUser, targetUser);
      setMatchResult(result);
    } catch (e) { console.error(e); }
    finally { setIsAnalyzing(false); }
  };

  const closeDrawer = useCallback(() => {
    setSelectedProfileId(null);
    setProfileTab('overview');
    setMatchResult(null);
    setTargetMatchId('');
    setIsEditing(false);
    setEditDraft({});
  }, []);

  const openProfile = (id: number) => {
    const u = users.find(u => u.id === id);
    setSelectedProfileId(id);
    setProfileTab('overview');
    setNotesDraft(u?.admin_notes || '');
    setIsEditing(false);
  };

  // --- Pipeline Badge Color ---
  const pipelineColor = (s: string) => {
    switch (s) {
      case 'Available': return { bg: '#dcfce7', color: '#166534' };
      case 'Pending Video': return { bg: '#fef9c3', color: '#854d0e' };
      case 'In Active Intro': return { bg: '#dbeafe', color: '#1e40af' };
      case 'Payment Pending': return { bg: '#fce7f3', color: '#9d174d' };
      case 'On Hold': return { bg: '#fee2e2', color: '#991b1b' };
      default: return { bg: '#f2f2f2', color: '#212121' };
    }
  };

  const engagementColor = (e: string) => {
    if (e === 'High') return '#166534';
    if (e === 'Medium') return '#854d0e';
    return '#991b1b';
  };

  const healthColor = (s: number) => {
    if (s >= 80) return '#166534';
    if (s >= 50) return '#854d0e';
    return '#991b1b';
  };

  // Helper for days ago
  const daysAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div className="dashboard-layout">
      {/* Mobile hamburger */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
        <Menu size={20} />
      </button>
      {/* Mobile sidebar backdrop */}
      <div className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)' }}>
          <h1 className="heading-4 flex items-center gap-2">
            <BrainCircuit color="var(--interaction-blue)" /> AndWeMet
          </h1>
          <div className="mono-label" style={{ marginTop: '4px' }}>Admin Ops Deck</div>
        </div>
        <nav className="flex-col gap-2" style={{ padding: '24px' }}>
          {[
            { key: 'overview' as NavPage, icon: <LayoutDashboard size={18} />, label: 'Stats Dashboard' },
            { key: 'members' as NavPage, icon: <Users size={18} />, label: 'Member Directory' },
          ].map(item => (
            <button key={item.key} className="btn-ghost flex items-center gap-2 w-full"
              style={{ justifyContent: 'flex-start', fontWeight: activeNav === item.key ? 600 : 400, color: activeNav === item.key ? 'var(--interaction-blue)' : 'var(--cohere-black)' }}
              onClick={() => { setActiveNav(item.key); setCurrentPage(1); setSidebarOpen(false); }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {activeNav === 'overview' ? (
          /* ===================== STATS DASHBOARD ===================== */
          <div className="flex-col gap-3">
            <h2 className="heading-3">Stats Dashboard</h2>

            {/* Row 1: Big counters */}
            <div className="stats-grid-4">
              {[
                { label: 'Total Active', value: stats.total },
                { label: 'Male / Female', value: `${stats.males} / ${stats.females}` },
                { label: '% With Video', value: `${Math.round(stats.withVideo / stats.total * 100)}%` },
                { label: '% Engaged', value: `${Math.round(stats.withEngagement / stats.total * 100)}%` },
              ].map((c, i) => (
                <div key={i} className="cohere-card" style={{ padding: '24px' }}>
                  <div className="mono-label">{c.label}</div>
                  <div className="heading-2" style={{ marginTop: '8px' }}>{c.value}</div>
                </div>
              ))}
            </div>

            {/* Row 2: Top cities + gender ratio */}
            <div className="stats-grid-2">
              <div className="cohere-card" style={{ padding: '24px' }}>
                <div className="mono-label" style={{ marginBottom: '16px' }}>Top Cities</div>
                {stats.topCities.map(([city, count]) => (
                  <div key={city} className="flex justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--lightest-gray)' }}>
                    <span>{city}</span>
                    <span style={{ fontWeight: 500 }}>{count}</span>
                  </div>
                ))}
              </div>
              <div className="cohere-card" style={{ padding: '24px' }}>
                <div className="mono-label" style={{ marginBottom: '16px' }}>Gender Ratio</div>
                <div style={{ display: 'flex', height: '32px', borderRadius: '8px', overflow: 'hidden', marginTop: '8px' }}>
                  <div style={{ width: `${(stats.males / stats.total) * 100}%`, background: 'var(--interaction-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>
                    {stats.males}M
                  </div>
                  <div style={{ flex: 1, background: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>
                    {stats.females}F
                  </div>
                </div>
                <div className="mono-label" style={{ marginTop: '16px' }}>Pipeline Breakdown</div>
                {['Available', 'Pending Video', 'In Active Intro', 'Payment Pending', 'On Hold'].map(status => {
                  const c = activeUsers.filter(u => u.pipeline_status === status).length;
                  const pc = pipelineColor(status);
                  return (
                    <div key={status} className="flex justify-between items-center" style={{ padding: '6px 0' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: pc.color, display: 'inline-block' }} />
                        {status}
                      </span>
                      <span style={{ fontWeight: 500 }}>{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ===================== MEMBER DIRECTORY ===================== */
          <div className="flex-col gap-3">
            {/* Top bar: Search + Rows per page */}
            <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <h2 className="heading-3">Member Directory</h2>
              <div className="flex items-center gap-2" style={{ position: 'relative', width: '320px' }}>
                <Search size={16} color="var(--muted-slate)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
                <input type="text" className="cohere-input" placeholder="Search ID, name, email, phone..."
                  style={{ paddingLeft: '36px' }} value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
              </div>
            </div>

            {/* Filters row */}
            <div className="filter-row">
              <select className="cohere-select" style={{ width: 'auto', minWidth: '160px' }} value={filterPipeline} onChange={e => { setFilterPipeline(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Statuses</option>
                <option value="Available">Approved</option>
                <option value="Pending Video">Pending</option>
                <option value="On Hold">Rejected / On Hold</option>
                <option value="In Active Intro">In Active Intro</option>
                <option value="Payment Pending">Payment Pending</option>
              </select>
              <select className="cohere-select" style={{ width: 'auto', minWidth: '140px' }} value={filterVideo} onChange={e => { setFilterVideo(e.target.value); setCurrentPage(1); }}>
                <option value="all">Any Video</option>
                <option value="has">Has Video</option>
                <option value="no">No Video</option>
              </select>
              <select className="cohere-select" style={{ width: 'auto', minWidth: '160px' }} value={filterEngagement} onChange={e => { setFilterEngagement(e.target.value); setCurrentPage(1); }}>
                <option value="all">Any Engagement</option>
                <option value="High">High Engagement</option>
                <option value="Medium">Medium Engagement</option>
                <option value="Low">Low Engagement</option>
              </select>
              <select className="cohere-select" style={{ width: 'auto', minWidth: '170px' }} value={filterPurchase} onChange={e => { setFilterPurchase(e.target.value); setCurrentPage(1); }}>
                <option value="all">Any Purchase</option>
                <option value="Has purchased">Has Purchased</option>
                <option value="Never purchased">Never Purchased</option>
                <option value="Purchased this month">Purchased This Month</option>
              </select>
              <select className="cohere-select" style={{ width: 'auto', minWidth: '150px' }} value={filterJoined} onChange={e => { setFilterJoined(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Joined</option>
                <option value="recent">Recently Joined (7d)</option>
              </select>
              <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.9rem', padding: '8px 12px', border: filterIncomplete ? '1px solid var(--interaction-blue)' : '1px solid var(--border-cool)', borderRadius: 'var(--radius-base)', background: filterIncomplete ? '#dbeafe' : 'var(--pure-white)' }}>
                <input type="checkbox" checked={filterIncomplete} onChange={e => { setFilterIncomplete(e.target.checked); setCurrentPage(1); }} style={{ accentColor: 'var(--interaction-blue)' }} />
                Incomplete
              </label>
            </div>

            {/* Table */}
            <div className="cohere-card table-wrapper">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--snow)', borderBottom: '1px solid var(--border-cool)' }}>
                  <tr>
                    {([
                      ['id', 'ID'],
                      ['first_name', 'Name'],
                      ['age', 'Age/Gender'],
                      ['city_of_residence', 'City'],
                      ['profile_health_score', 'Health'],
                      ['last_active', 'Last Active'],
                    ] as [SortField, string][]).map(([field, label]) => (
                      <th key={field} className="mono-label" style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => toggleSort(field)}>
                        <span className="flex items-center gap-2">
                          {label} <ArrowUpDown size={12} style={{ opacity: sortField === field ? 1 : 0.3 }} />
                        </span>
                      </th>
                    ))}
                    <th className="mono-label" style={{ padding: '12px 16px' }}>Pipeline</th>
                    <th className="mono-label" style={{ padding: '12px 16px' }}>Engagement</th>
                    <th className="mono-label" style={{ padding: '12px 16px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map(user => {
                    const pc = pipelineColor(user.pipeline_status);
                    return (
                      <tr key={user.id} style={{ borderBottom: '1px solid var(--lightest-gray)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>#{user.id}</td>
                        <td style={{ padding: '12px 16px' }}>{user.first_name}</td>
                        <td style={{ padding: '12px 16px' }}>{user.age} • {user.gender}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--muted-slate)' }}>{user.city_of_residence}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ color: healthColor(user.profile_health_score), fontWeight: 500 }}>{user.profile_health_score}%</span>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--muted-slate)', fontSize: '0.85rem' }}>
                          {daysAgo(user.last_active)}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500, background: pc.bg, color: pc.color }}>{user.pipeline_status}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ color: engagementColor(user.engagement_level), fontSize: '0.85rem', fontWeight: 500 }}>{user.engagement_level}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button className="btn-outline" style={{ fontSize: '0.85rem', padding: '6px 12px' }} onClick={() => openProfile(user.id)}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="flex justify-between items-center" style={{ padding: '8px 0' }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '0.85rem', color: 'var(--muted-slate)' }}>Rows per page:</span>
                <select className="cohere-select" style={{ width: 'auto', minWidth: '70px', padding: '6px 30px 6px 10px' }} value={rowsPerPage}
                  onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                  <option value={10}>10</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted-slate)', marginLeft: '8px' }}>{filteredUsers.length} results</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }} disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
                <span style={{ fontSize: '0.85rem' }}>Page {currentPage} of {totalPages || 1}</span>
                <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }} disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===================== PROFILE DRAWER ===================== */}
      <div className={`drawer-backdrop ${selectedProfileId ? 'open' : ''}`} onClick={closeDrawer} />
      <div className={`drawer-panel ${selectedProfileId ? 'open' : ''}`}>
        {selectedUser && (
          <>
            {/* Drawer Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-3">
                <h3 className="heading-4">#{selectedUser.id} — {selectedUser.first_name}</h3>
                {(() => { const pc = pipelineColor(selectedUser.pipeline_status); return <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, background: pc.bg, color: pc.color }}>{selectedUser.pipeline_status}</span>; })()}
              </div>
              <button className="btn-ghost" onClick={closeDrawer}><X size={20} /></button>
            </div>

            {/* Drawer Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', background: 'var(--snow)', overflowX: 'auto' }}>
              {([
                { key: 'overview' as ProfileTab, label: 'Overview' },
                { key: 'video' as ProfileTab, label: 'Video' },
                { key: 'story' as ProfileTab, label: 'Background & Story' },
                { key: 'preferences' as ProfileTab, label: 'Partner Preferences' },
                { key: 'engagement' as ProfileTab, label: 'Engagement' },
              ]).map(t => (
                <button key={t.key} className="btn-ghost" style={{ flex: 'none', borderRadius: 0, padding: '12px 20px', fontSize: '0.85rem', whiteSpace: 'nowrap', borderBottom: profileTab === t.key ? '2px solid var(--interaction-blue)' : '2px solid transparent', fontWeight: profileTab === t.key ? 500 : 400 }}
                  onClick={() => setProfileTab(t.key)}>{t.label}</button>
              ))}
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

              {/* === OVERVIEW TAB === */}
              {profileTab === 'overview' && (
                <div className="flex-col gap-3">
                  {/* Profile Health Bar */}
                  <div className="cohere-card" style={{ padding: '20px' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                      <div className="mono-label">Profile Health</div>
                      <span style={{ fontWeight: 600, color: healthColor(selectedUser.profile_health_score) }}>{selectedUser.profile_health_score}%</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', background: 'var(--lightest-gray)' }}>
                      <div style={{ height: '100%', width: `${selectedUser.profile_health_score}%`, borderRadius: '3px', background: healthColor(selectedUser.profile_health_score), transition: 'width 0.5s' }} />
                    </div>
                    <div className="flex gap-2" style={{ marginTop: '10px', flexWrap: 'wrap' }}>
                      {selectedUser.profile_health_flags.map((f, i) => (
                        <span key={i} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: f.includes('No') || f.includes('Incomplete') ? '#fee2e2' : '#dcfce7', color: f.includes('No') || f.includes('Incomplete') ? '#991b1b' : '#166534' }}>{f}</span>
                      ))}
                    </div>
                  </div>

                  {/* Demographics Card - Editable */}
                  <div className="cohere-card" style={{ padding: '20px' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                      <div className="heading-4" style={{ fontSize: '1.1rem' }}>Demographics</div>
                      {!isEditing ? (
                        <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '4px 12px' }} onClick={handleStartEdit}>Edit</button>
                      ) : (
                        <div className="flex gap-2">
                          <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '4px 12px' }} onClick={() => setIsEditing(false)}>Cancel</button>
                          <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '4px 12px' }} onClick={handleSaveEdit}><Save size={14} /> Save</button>
                        </div>
                      )}
                    </div>
                    <div className="profile-detail-grid">
                      {([
                        ['first_name', 'Name (read-only)'],
                        ['email', 'Email'],
                        ['age', 'Age'],
                        ['gender', 'Gender'],
                        ['city_of_residence', 'City'],
                        ['whatsapp_number', 'WhatsApp'],
                        ['educational_degree', 'Education'],
                        ['annual_income', 'Income'],
                        ['professional_intro', 'Profession'],
                        ['native_region', 'Region'],
                      ] as [keyof User, string][]).map(([field, label]) => (
                        <div key={field}>
                          <div className="mono-label" style={{ marginBottom: '4px' }}>{label}</div>
                          {isEditing && field !== 'first_name' ? (
                            <input className="cohere-input" style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                              value={String((editDraft as Record<string, unknown>)[field] ?? '')}
                              onChange={e => setEditDraft(d => ({ ...d, [field]: e.target.value }))} />
                          ) : (
                            <div style={{ fontSize: '0.95rem' }}>{String(selectedUser[field])}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin CRM Row */}
                  <div className="crm-grid">
                    {/* Actions */}
                    <div className="cohere-card" style={{ padding: '20px', background: 'var(--snow)' }}>
                      <div className="mono-label" style={{ marginBottom: '12px' }}>Admin Actions</div>
                      <div className="flex-col gap-2">
                        <button className="btn-outline flex items-center gap-2" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleToggleHold(selectedUser.id)}>
                          {selectedUser.pipeline_status === 'On Hold' ? <><PlayCircle size={14} /> Unhold</> : <><PauseCircle size={14} /> Hold</>}
                        </button>
                        <button className="btn-outline flex items-center gap-2" style={{ width: '100%', justifyContent: 'center', color: '#991b1b', borderColor: '#fca5a5' }} onClick={() => setShowDeleteConfirm(true)}>
                          <Trash2 size={14} /> Soft Delete
                        </button>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="cohere-card" style={{ padding: '20px', background: 'var(--snow)' }}>
                      <div className="mono-label" style={{ marginBottom: '8px' }}>Internal Notes</div>
                      <textarea className="cohere-input" rows={3} value={notesDraft} onChange={e => setNotesDraft(e.target.value)} style={{ resize: 'vertical', fontSize: '0.9rem' }} />
                      <button className="btn-dark" style={{ width: '100%', marginTop: '8px', fontSize: '0.85rem' }} onClick={() => handleSaveNotes(selectedUser.id)}>Save Note</button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="cohere-card" style={{ padding: '20px' }}>
                    <div className="mono-label flex items-center gap-2" style={{ marginBottom: '12px' }}><Activity size={14} /> Activity Timeline</div>
                    {selectedUser.activity_timeline.map((act, idx) => (
                      <div key={idx} className="flex items-center gap-2" style={{ padding: '6px 0', borderBottom: '1px solid var(--lightest-gray)', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--muted-slate)', minWidth: '90px' }}>{new Date(act.timestamp).toLocaleDateString()}</span>
                        <span>{act.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === VIDEO TAB === */}
              {profileTab === 'video' && (
                <div className="flex-col gap-3">
                  <div className="cohere-card" style={{ padding: '32px', textAlign: 'center' }}>
                    <Video size={48} color="var(--muted-slate)" style={{ margin: '0 auto 16px' }} />
                    <div className="heading-4" style={{ marginBottom: '8px' }}>
                      {selectedUser.video_approved ? 'Video Approved' : 'Video Pending Review'}
                    </div>
                    <p style={{ color: 'var(--muted-slate)', marginBottom: '24px' }}>
                      5-second verification video for profile #{selectedUser.id}
                    </p>
                    <div style={{ background: 'var(--snow)', border: '1px solid var(--border-cool)', borderRadius: 'var(--radius-md)', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-slate)', marginBottom: '24px' }}>
                      [ Video Player Placeholder ]
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button className="btn-primary flex items-center gap-2" onClick={() => handleApproveVideo(selectedUser.id, true)}>
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button className="btn-outline flex items-center gap-2" style={{ color: '#991b1b', borderColor: '#fca5a5' }} onClick={() => handleApproveVideo(selectedUser.id, false)}>
                        <XCircle size={16} /> Disapprove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* === BACKGROUND & STORY TAB === */}
              {profileTab === 'story' && (
                <div className="flex-col gap-3">
                  <div className="cohere-card" style={{ padding: '24px' }}>
                    <div className="mono-label" style={{ marginBottom: '8px' }}>Definition of Privilege</div>
                    <p className="body-standard" style={{ color: 'var(--near-black)' }}>"{selectedUser.privilege_definition}"</p>
                  </div>
                  <div className="cohere-card" style={{ padding: '24px' }}>
                    <div className="mono-label" style={{ marginBottom: '8px' }}>Growing Up Story</div>
                    <p className="body-standard" style={{ color: 'var(--near-black)' }}>"{selectedUser.growing_up_story}"</p>
                  </div>
                  <div className="cohere-card" style={{ padding: '24px' }}>
                    <div className="mono-label" style={{ marginBottom: '8px' }}>Additional Mentions</div>
                    <p className="body-standard" style={{ color: 'var(--near-black)' }}>"{selectedUser.additional_mentions}"</p>
                  </div>

                  {/* Amie Matchmaker inline */}
                  <div className="cohere-card" style={{ padding: '24px', background: 'var(--deep-dark)', color: 'var(--pure-white)' }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: '16px' }}>
                      <BrainCircuit size={20} /> <span className="heading-4" style={{ color: 'var(--pure-white)', fontSize: '1.1rem' }}>Amie Matchmaker</span>
                    </div>
                    <div className="flex gap-2">
                      <select className="cohere-select" value={targetMatchId} onChange={e => setTargetMatchId(e.target.value === '' ? '' : Number(e.target.value))} style={{ color: 'var(--cohere-black)' }}>
                        <option value="">Select Target...</option>
                        {activeUsers.filter(u => u.id !== selectedUser.id).slice(0, 20).map(u => (
                          <option key={u.id} value={u.id}>#{u.id} {u.first_name} ({u.gender})</option>
                        ))}
                      </select>
                      <button className="btn-primary" onClick={handleRunMatch} disabled={!targetMatchId || isAnalyzing} style={{ whiteSpace: 'nowrap' }}>
                        {isAnalyzing ? 'Analyzing...' : 'Run Match'}
                      </button>
                    </div>
                  </div>

                  {matchResult && !isAnalyzing && (
                    <div className="cohere-card" style={{ padding: '24px' }}>
                      <div className="flex justify-between items-center" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-light)', marginBottom: '16px' }}>
                        <div>
                          <div className="mono-label">Verdict</div>
                          <div className="heading-4">{matchResult.verdict}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div className="mono-label">Score</div>
                          <div className="heading-3">{matchResult.overall_score}</div>
                        </div>
                      </div>
                      <div className="flex-col gap-2">
                        <div><div className="mono-label" style={{ marginBottom: '4px' }}>Psychological</div><p className="body-standard">{matchResult.psychological_alignment}</p></div>
                        <div><div className="mono-label" style={{ marginBottom: '4px' }}>Demographic</div><p className="body-standard">{matchResult.lifestyle_demographic_alignment}</p></div>
                        <div style={{ padding: '12px', background: '#fee2e2', borderRadius: 'var(--radius-base)' }}>
                          <div className="mono-label flex items-center gap-2" style={{ color: '#991b1b', marginBottom: '4px' }}><ShieldAlert size={12} /> Pitfalls</div>
                          <p className="body-standard" style={{ color: '#7f1d1d' }}>{matchResult.potential_pitfalls}</p>
                        </div>
                        <div style={{ padding: '12px', background: 'var(--snow)', borderRadius: 'var(--radius-base)', border: '1px solid var(--interaction-blue)' }}>
                          <div className="mono-label flex items-center gap-2" style={{ color: 'var(--interaction-blue)' }}><MessageSquare size={12} /> Community Question</div>
                          <p style={{ fontStyle: 'italic', marginTop: '4px' }}>"{matchResult.suggested_community_question}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === PARTNER PREFERENCES TAB === */}
              {profileTab === 'preferences' && (
                <div className="flex-col gap-3">
                  <div className="cohere-card" style={{ padding: '24px' }}>
                    <div className="heading-4" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Relationship Criteria</div>
                    <div className="profile-detail-grid">
                      {([
                        ['relationship_status', 'Current Status'],
                        ['seeking_relationship_type', 'Seeking'],
                        ['has_children', 'Has Children'],
                        ['religious_inclination', 'Religion'],
                        ['open_to_other_faith', 'Open to Other Faith'],
                        ['open_to_divorced', 'Open to Divorced'],
                        ['fine_with_single_parent', 'Fine With Single Parent'],
                        ['open_to_relocate', 'Open to Relocate'],
                      ] as [keyof User, string][]).map(([field, label]) => (
                        <div key={field}>
                          <div className="mono-label" style={{ marginBottom: '4px' }}>{label}</div>
                          <div style={{ fontSize: '0.95rem' }}>{String(selectedUser[field])}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="cohere-card" style={{ padding: '24px' }}>
                    <div className="mono-label" style={{ marginBottom: '8px' }}>Must-Haves</div>
                    <p className="body-standard">"{selectedUser.musthaves}"</p>
                  </div>
                </div>
              )}

              {/* === ENGAGEMENT TAB === */}
              {profileTab === 'engagement' && (
                <div className="flex-col gap-3">
                  <div className="engagement-grid">
                    <div className="cohere-card" style={{ padding: '20px' }}>
                      <div className="mono-label">Engagement Level</div>
                      <div className="heading-3" style={{ color: engagementColor(selectedUser.engagement_level) }}>{selectedUser.engagement_level}</div>
                    </div>
                    <div className="cohere-card" style={{ padding: '20px' }}>
                      <div className="mono-label">Replies</div>
                      <div className="heading-3">{selectedUser.engagement_replies}</div>
                    </div>
                    <div className="cohere-card" style={{ padding: '20px' }}>
                      <div className="mono-label">Last Active</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500, marginTop: '8px' }}>{daysAgo(selectedUser.last_active)}</div>
                    </div>
                  </div>

                  <div className="cohere-card" style={{ padding: '20px' }}>
                    <div className="mono-label" style={{ marginBottom: '8px' }}>Purchase Status</div>
                    <div style={{ fontWeight: 500 }}>{selectedUser.purchase_status}</div>
                  </div>

                  {selectedUser.introductions.length > 0 && (
                    <div className="cohere-card" style={{ padding: '20px' }}>
                      <div className="mono-label flex items-center gap-2" style={{ marginBottom: '12px' }}><Heart size={14} /> Introductions Paid</div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-cool)' }}>
                            <th className="mono-label" style={{ padding: '8px 0' }}>Target</th>
                            <th className="mono-label" style={{ padding: '8px 0' }}>Date</th>
                            <th className="mono-label" style={{ padding: '8px 0' }}>Paid</th>
                            <th className="mono-label" style={{ padding: '8px 0' }}>Connected?</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.introductions.map((intro, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--lightest-gray)' }}>
                              <td style={{ padding: '8px 0' }}>#{intro.target_user_id}</td>
                              <td style={{ padding: '8px 0', color: 'var(--muted-slate)' }}>{new Date(intro.date).toLocaleDateString()}</td>
                              <td style={{ padding: '8px 0' }}>₹{intro.amount_paid}</td>
                              <td style={{ padding: '8px 0' }}>
                                {intro.connected ? <span style={{ color: '#166534' }}>✓ Yes</span> : <span style={{ color: '#991b1b' }}>✗ No</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* === MODALS === */}
      {showSaveConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="cohere-card" style={{ padding: '32px', maxWidth: '400px', textAlign: 'center' }}>
            <AlertTriangle size={32} color="#854d0e" style={{ margin: '0 auto 12px' }} />
            <h4 className="heading-4">Save Changes?</h4>
            <p style={{ color: 'var(--muted-slate)', margin: '8px 0 24px' }}>You are editing profile #{selectedUser?.id}. Name will not be changed.</p>
            <div className="flex gap-2 justify-center">
              <button className="btn-outline" onClick={() => setShowSaveConfirm(false)}>Cancel</button>
              <button className="btn-primary" onClick={confirmSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="cohere-card" style={{ padding: '32px', maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={32} color="#991b1b" style={{ margin: '0 auto 12px' }} />
            <h4 className="heading-4">Soft Delete Profile?</h4>
            <p style={{ color: 'var(--muted-slate)', margin: '8px 0 24px' }}>This will hide the profile for 6 months, after which it will be permanently removed.</p>
            <div className="flex gap-2 justify-center">
              <button className="btn-outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-outline" style={{ color: '#991b1b', borderColor: '#fca5a5' }} onClick={() => handleSoftDelete(selectedUser!.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
