export interface User {
  id: string;
  github_username: string;
  avatar_url: string | null;
  sponsor_url?: string | null;
  created_at: string;
}

export interface Snippet {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  author_id: string;
  votes: number;
  used_count: number;
  forks_count: number;
  parent_id: string | null;
  current_version: string;
  is_verified: boolean;
  github_repo?: string | null;
  team_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  votes: number;
  used_count: number;
  forks_count: number;
  parent_id: string | null;
  current_version: string;
  is_verified: boolean;
  github_repo?: string | null;
  team_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface SnippetTag {
  snippet_id: string;
  tag_id: string;
}

export interface PromptTag {
  prompt_id: string;
  tag_id: string;
}

export interface ItemVersion {
  id: string;
  item_id: string;
  item_type: "snippet" | "prompt";
  version_label: string;
  title: string;
  content: string;
  changelog?: string | null;
  created_at: string;
}

export interface SkillBundle {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  items: any[];
  votes: number;
  is_verified: boolean;
  team_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  item_type: 'snippet' | 'prompt';
  id: string;
  title: string;
  author_id: string;
  votes: number;
  view_count: number;
  used_count: number;
  forks_count: number;
  created_at: string;
  impact_score: number;
}

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  stripe_customer_id?: string | null;
  created_at: string;
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

