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
  author_id: string | null;
  user_id?: string | null;
  author_name?: string | null;
  author_avatar?: string | null;
  tags?: string[] | null;
  view_count: number;
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
  description?: string | null;
  category: string;
  author_id: string | null;
  user_id?: string | null;
  author_name?: string | null;
  author_avatar?: string | null;
  ai_model?: string | null;
  tags?: string[] | null;
  view_count: number;
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
  items: Array<{ id: string; type: "snippet" | "prompt" }>;
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
  slug?: string | null;
  description?: string | null;
  avatar_url?: string | null;
  owner_id: string;
  subscription_tier?: 'free' | 'pro' | 'enterprise' | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface Vote {
  id: string;
  user_id: string;
  created_at: string;
}

export interface SnippetVote extends Vote {
  snippet_id: string;
}

export interface PromptVote extends Vote {
  prompt_id: string;
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  type: string;
  snippet_id?: string | null;
  prompt_id?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Feedback {
  id: string;
  type: 'bug' | 'feature' | 'general';
  content: string;
  user_id?: string | null;
  created_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  key_hash: string;
  name: string;
  last_used_at?: string | null;
  created_at: string;
}
