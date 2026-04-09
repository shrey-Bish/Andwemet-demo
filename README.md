# AndWeMet — Admin CRM & Amie AI Matchmaker

A full-stack Admin Dashboard prototype for the **andwemet** matchmaking platform. Built with React + Vite + TypeScript, styled using the **Cohere Enterprise Design System** (clean white canvas, 22px card radius, monochrome palette with Interaction Blue accents).

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the dashboard.

---

## 📋 Feature List

### 1. Stats Dashboard
Live counters and visual breakdowns across the entire member base.

| Metric | Description |
|--------|-------------|
| Total Active Members | All non-deleted profiles |
| Gender Ratio | Visual bar showing Male/Female split |
| % With Video | Percentage who uploaded their 5-second verification |
| % Engaged | Percentage with Medium or High engagement |
| Top Cities | Top 5 cities by member count |
| Pipeline Breakdown | Count per status: Available, Pending Video, In Active Intro, Payment Pending, On Hold |

### 2. Member Directory
A fast, sortable, filterable table of 100+ profiles.

- **Search** by ID, Name, Email, or Phone number — all in one search bar.
- **Sort** by clicking any column header (ID, Name, Age, City, Health Score, Last Active). Click again to reverse direction.
- **Dropdown Filters:**
  - Status: Approved / Pending / Rejected (On Hold)
  - Video: Has Video / No Video
  - Engagement: High / Medium / Low
  - Purchase: Has Purchased / Never Purchased / Purchased This Month
  - Recently Joined (last 7 days)
  - Incomplete Profiles (health score < 60%)
- **Pagination** with rows-per-page control (10 / 30 / 50). Defaults to 30.

### 3. 360° Profile Drawer
Click "View" on any member to slide open a detailed side panel. Instead of one long scroll, the profile is organized into **5 tabs**:

#### Overview Tab
- **Profile Health Score** — a progress bar (0–100%) with colored flags showing what's complete (Bio, Video, Preferences, Engagement) and what's missing.
- **Demographics Grid** — Name (read-only), Email, Age, Gender, City, WhatsApp, Education, Income, Profession, Region.
- **Edit Mode** — Click "Edit" to make all fields editable (except Name). A confirmation dialog ("Save Changes?") prevents accidental saves.
- **Admin Actions** — 1-click Hold / Unhold toggle + Soft Delete button (with confirmation modal explaining the 6-month grace period).
- **Internal Notes** — Private text box for the admin team to leave hidden notes. Click "Save Note" to persist.
- **Activity Timeline** — Timestamped log of every action (Signed Up → Video Approved → Declined Interest → etc.)

#### Video Tab
- Displays the 5-second verification video (placeholder in the PoC).
- **Approve** / **Disapprove** buttons that immediately update the user's pipeline status.

#### Background & Story Tab
- Full display of their qualitative narrative answers: Definition of Privilege, Growing Up Story, Additional Mentions.
- **Amie Matchmaker** is embedded here — select a target user and click "Run Match" to generate the AI compatibility report (see AI section below).

#### Partner Preferences Tab
- All relationship criteria at a glance: Current Status, Seeking, Has Children, Religion, Open to Other Faith, Open to Divorced, Fine with Single Parent, Open to Relocate.
- Their written Must-Haves.

#### Engagement Tab
- **Engagement Summary**: Level (High/Medium/Low), Reply Count, Last Active (in "X days ago" format).
- **Purchase Status**: Has Purchased / Never Purchased / Purchased This Month.
- **Introductions Table**: Every introduction they've paid for — Target User ID, Date, Amount (₹), and whether they connected or not.

### 4. Soft Delete Flow
When an admin clicks "Soft Delete":
- A confirmation modal warns that the profile will be hidden for 6 months, then permanently removed.
- On confirmation, the profile vanishes from the active directory immediately.
- The `soft_deleted_at` timestamp is stored for the 6-month hard-delete policy.

---

## 🤖 How the "Amie" AI Engine Works

Amie is the platform's **LLM-as-a-Matchmaker** module. It doesn't match on hobbies — it analyzes psychology.

### The Process
1. **Data Ingestion** — Amie reads the complete 25+ field profile of two users, focusing on their narrative answers (Privilege, Growing Up Story, Must-Haves) plus hard demographic data (city, religion, relocation, income, relationship type).
2. **Prompt Generation** — The code constructs a structured system prompt instructing the LLM to act as a clinical psychologist evaluating attachment styles, trauma responses, and lifestyle logistics.
3. **Analysis Output** — Amie returns 5 things:

| Output | What It Tells You |
|--------|-------------------|
| **Score** (0–100) | Numerical compatibility rating |
| **Verdict** | Highly Compatible / Potentially Compatible / Proceed with Caution / Incompatible |
| **Psychological Alignment** | How their childhoods, defense mechanisms, and values interact |
| **Demographic Alignment** | Blunt logistical reality check (city mismatch, income gap, religion compatibility) |
| **Potential Pitfalls** | Early-warning system for attachment clashes |
| **Community Question** | A philosophical question derived from their unique dynamic, ready to post on social media |

### Current State
The PoC uses a **simulated AI engine** — it generates the full LLM prompt but returns pre-written mock responses for speed and zero API cost. When ready for production, the architecture is pre-built to accept a live LLM call (Gemini API, OpenAI, etc.) by simply swapping the `evaluateMatch()` function.

---

## 🗂️ Project Structure

```
andwemet-demo/
├── index.html                    # Google Fonts (Space Grotesk, Inter, Space Mono)
├── src/
│   ├── main.tsx                  # App entry point
│   ├── index.css                 # Cohere Design System (CSS variables, cards, buttons, drawer)
│   ├── App.tsx                   # Full dashboard: sidebar, stats, directory, drawer, modals
│   ├── data/
│   │   ├── users.ts              # User interface (25+ fields) + 4 hand-crafted profiles
│   │   └── generatedUsers.ts     # 100 auto-generated profiles (from seed script)
│   └── lib/
│       └── matchmaker.ts         # Amie AI prompt builder + mock response engine
├── scripts/
│   └── seed.js                   # Node script to regenerate 100 users
└── README.md
```

---

## 🎨 Design System: Cohere Enterprise

The UI intentionally looks like **serious professional infrastructure**, not a consumer dating app.

| Token | Value | Usage |
|-------|-------|-------|
| `--cohere-black` | `#000000` | Primary text |
| `--pure-white` | `#ffffff` | Card backgrounds |
| `--snow` | `#fafafa` | Page background |
| `--interaction-blue` | `#1863dc` | Hover & active states |
| `--border-cool` | `#d9d9dd` | Card & section borders |
| `--radius-cohere` | `22px` | Signature card roundness |
| Font: Display | Space Grotesk | Headings |
| Font: Body | Inter | All body text |
| Font: Labels | Space Mono | Uppercase mono labels |

---

## 🔮 Next Steps (Production Roadmap)

1. **Live LLM Integration** — Swap mock responses for real Gemini/OpenAI API calls.
2. **MongoDB Backend** — Connect to the actual andwemet database instead of in-memory state.
3. **WhatsApp Automation** — Trigger onboarding and matchmaking flows via WhatsApp Business API.
4. **Hard Delete CRON** — Automated job to permanently purge profiles 6 months after soft deletion.
5. **Community Question Publishing** — Auto-post Amie's generated discussion questions to social channels.
