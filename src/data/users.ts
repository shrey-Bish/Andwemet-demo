export interface UserTimelineEvent {
  timestamp: string;
  action: string;
}

export interface Introduction {
  target_user_id: number;
  date: string;
  amount_paid: number;
  connected: boolean;
}

export interface User {
  id: number;
  first_name: string;
  email: string;
  gender: 'Female' | 'Male';
  age: number;
  whatsapp_number: string;
  city_of_residence: string;
  native_region: 'North India' | 'East India' | 'West India' | 'Central India' | 'South India' | 'North East India';
  languages_spoken: string[];
  educational_degree: 'Graduate Degree (Undergraduate)' | 'Masters' | 'PG Diploma' | 'Phd and equivalent' | 'Vocational Degree' | 'High School' | 'College Dropout';
  last_institute: string;
  professional_intro: string;
  annual_income: string;
  privilege_definition: string;
  growing_up_story: string;
  relationship_status: 'Never married' | 'Divorced' | 'Widow/Widower' | 'Separated, filed for a divorce' | 'Separated, yet to file for a divorce';
  has_children: boolean;
  seeking_relationship_type: 'Marriage' | 'Live-in' | 'Companionship (committed, living under separate roofs)' | 'I seek committed relationship, but unsure what';
  looking_for_long_term: boolean;
  religious_inclination: 'Hindu' | 'Muslim' | 'Christian' | 'Jain' | 'Buddhist' | 'Sikh' | 'Spiritual' | 'Atheist' | 'Agnostic' | 'Other';
  open_to_other_faith: 'Yes' | 'I am not sure' | 'No';
  open_to_divorced: 'Yes' | 'I am not sure' | 'I am not';
  fine_with_single_parent: 'Yes I am' | 'I am not sure' | 'It will not work for me';
  open_to_relocate: 'Yes' | 'No';
  musthaves: string;
  additional_mentions: string;
  heard_about_from: string;
  video_approved: boolean;
  pipeline_status: 'Pending Video' | 'Available' | 'In Active Intro' | 'Payment Pending' | 'On Hold';
  is_soft_deleted: boolean;
  soft_deleted_at: string | null;
  admin_notes: string;
  activity_timeline: UserTimelineEvent[];
  engagement_level: 'High' | 'Medium' | 'Low';
  engagement_replies: number;
  last_active: string;
  profile_health_score: number;
  profile_health_flags: string[];
  purchase_status: 'Has purchased' | 'Never purchased' | 'Purchased this month';
  introductions: Introduction[];
}

import { generated100Users } from './generatedUsers';

const originalMockUsers: User[] = [
  {
    id: 1042, first_name: "Eleanor", email: "eleanor.t@gmail.com", gender: "Female", age: 29,
    whatsapp_number: "+919876543210", city_of_residence: "Bangalore", native_region: "South India",
    languages_spoken: ["English", "Tamil", "Kannada"], educational_degree: "Masters",
    last_institute: "National Institute of Design", professional_intro: "Urban Planner",
    annual_income: "Between 20-24 Lakhs",
    privilege_definition: "Privilege to me is the invisible safety net of time.",
    growing_up_story: "I grew up in a household where intellect was often a weapon rather than a bridge. Love was expressed through rigorous academic expectations.",
    relationship_status: "Never married", has_children: false, seeking_relationship_type: "Marriage", looking_for_long_term: true,
    religious_inclination: "Spiritual", open_to_other_faith: "Yes", open_to_divorced: "Yes",
    fine_with_single_parent: "I am not sure", open_to_relocate: "No",
    musthaves: "Someone who understands silence isn't absence. Shared dark sense of humor.", additional_mentions: "I need a slow burn connection.", heard_about_from: "Linkedin",
    video_approved: true, pipeline_status: "Available", is_soft_deleted: false, soft_deleted_at: null,
    admin_notes: "Very solid profile. Might need a gentle nudge to accept intros.",
    activity_timeline: [
      { timestamp: "2026-10-01T10:00:00Z", action: "Signed Up" },
      { timestamp: "2026-10-02T14:30:00Z", action: "Video Approved" },
      { timestamp: "2026-10-10T11:00:00Z", action: "Declined Interest from User #882" }
    ],
    engagement_level: "Medium", engagement_replies: 8, last_active: "2026-10-09T18:00:00Z",
    profile_health_score: 90, profile_health_flags: ["Bio complete", "Preferences added", "Video uploaded"],
    purchase_status: "Has purchased",
    introductions: [{ target_user_id: 882, date: "2026-10-08T12:00:00Z", amount_paid: 999, connected: false }]
  },
  {
    id: 2099, first_name: "Julian", email: "julian.k@outlook.com", gender: "Male", age: 32,
    whatsapp_number: "+919876123456", city_of_residence: "Mumbai", native_region: "North India",
    languages_spoken: ["English", "Hindi"], educational_degree: "Masters",
    last_institute: "TISS Mumbai", professional_intro: "Crisis Comms Director",
    annual_income: "Between 35-40 Lakhs",
    privilege_definition: "I define privilege as the freedom to fail without catastrophic consequences.",
    growing_up_story: "Childhood was warm but marked by constant geographic instability due to my father's career.",
    relationship_status: "Never married", has_children: false, seeking_relationship_type: "Live-in", looking_for_long_term: true,
    religious_inclination: "Agnostic", open_to_other_faith: "Yes", open_to_divorced: "Yes",
    fine_with_single_parent: "Yes I am", open_to_relocate: "Yes",
    musthaves: "Total, unvarnished honesty. Deep sense of purpose beyond career.", additional_mentions: "Therapy has been a big part of my journey.", heard_about_from: "Friend recommended",
    video_approved: true, pipeline_status: "Available", is_soft_deleted: false, soft_deleted_at: null,
    admin_notes: "Great conversationalist in the video. High match potential.",
    activity_timeline: [
      { timestamp: "2026-10-12T09:00:00Z", action: "Signed Up" },
      { timestamp: "2026-10-13T10:15:00Z", action: "Video Approved" }
    ],
    engagement_level: "High", engagement_replies: 22, last_active: "2026-10-14T09:00:00Z",
    profile_health_score: 95, profile_health_flags: ["Bio complete", "Preferences added", "Video uploaded", "Engagement present"],
    purchase_status: "Purchased this month",
    introductions: [
      { target_user_id: 1042, date: "2026-10-14T10:00:00Z", amount_paid: 999, connected: true },
      { target_user_id: 5022, date: "2026-10-13T08:00:00Z", amount_paid: 999, connected: false }
    ]
  },
  {
    id: 3110, first_name: "Amina", email: "amina.r@yahoo.in", gender: "Female", age: 31,
    whatsapp_number: "+919988776655", city_of_residence: "Delhi", native_region: "North India",
    languages_spoken: ["English", "Hindi", "Urdu"], educational_degree: "Phd and equivalent",
    last_institute: "Delhi School of Economics", professional_intro: "Behavioral Economist",
    annual_income: "Between 24-30 Lakhs",
    privilege_definition: "Privilege is the absence of systemic friction.",
    growing_up_story: "Child of diaspora. Parents sacrificed everything, instilled a crushing sense of indebtedness.",
    relationship_status: "Separated, filed for a divorce", has_children: false,
    seeking_relationship_type: "Companionship (committed, living under separate roofs)", looking_for_long_term: true,
    religious_inclination: "Muslim", open_to_other_faith: "I am not sure", open_to_divorced: "Yes",
    fine_with_single_parent: "I am not sure", open_to_relocate: "No",
    musthaves: "Cannot view independence and intimacy as mutually exclusive. Kind debater.", additional_mentions: "Finalizing my divorce logically. Seeking LAT.", heard_about_from: "Twitter",
    video_approved: false, pipeline_status: "Pending Video", is_soft_deleted: false, soft_deleted_at: null,
    admin_notes: "Waiting on her to upload the 5s verification video.",
    activity_timeline: [{ timestamp: "2026-10-20T16:45:00Z", action: "Signed Up" }],
    engagement_level: "Low", engagement_replies: 1, last_active: "2026-10-20T17:00:00Z",
    profile_health_score: 45, profile_health_flags: ["Bio complete", "No video", "Preferences added"],
    purchase_status: "Never purchased", introductions: []
  },
  {
    id: 4501, first_name: "Marcus", email: "marcus.d@proton.me", gender: "Male", age: 34,
    whatsapp_number: "+919123456789", city_of_residence: "Pune", native_region: "West India",
    languages_spoken: ["English", "Marathi"], educational_degree: "Graduate Degree (Undergraduate)",
    last_institute: "Fergusson College", professional_intro: "Independent Tech Journalist",
    annual_income: "Between 15-18 Lakhs",
    privilege_definition: "Privilege is the assumption that your voice will be heard without justification.",
    growing_up_story: "Raised in an extremely religious community that I left. Profound ontological shock.",
    relationship_status: "Divorced", has_children: true, seeking_relationship_type: "Marriage", looking_for_long_term: true,
    religious_inclination: "Atheist", open_to_other_faith: "Yes", open_to_divorced: "Yes",
    fine_with_single_parent: "Yes I am", open_to_relocate: "Yes",
    musthaves: "Intellectually aggressive but emotionally gentle. Comfortable questioning everything.", additional_mentions: "6-year-old daughter, amicable co-parenting.", heard_about_from: "Reddit",
    video_approved: true, pipeline_status: "In Active Intro", is_soft_deleted: false, soft_deleted_at: null,
    admin_notes: "Currently exploring a match with User #2112.",
    activity_timeline: [
      { timestamp: "2026-09-15T08:00:00Z", action: "Signed Up" },
      { timestamp: "2026-09-16T12:00:00Z", action: "Video Approved" },
      { timestamp: "2026-10-21T14:00:00Z", action: "Intiated Active Intro" }
    ],
    engagement_level: "High", engagement_replies: 15, last_active: "2026-10-21T14:00:00Z",
    profile_health_score: 80, profile_health_flags: ["Bio complete", "Preferences added", "Video uploaded"],
    purchase_status: "Has purchased",
    introductions: [{ target_user_id: 2112, date: "2026-10-21T14:00:00Z", amount_paid: 1499, connected: true }]
  }
];

export const mockUsers: User[] = [
  ...originalMockUsers,
  ...generated100Users
];
