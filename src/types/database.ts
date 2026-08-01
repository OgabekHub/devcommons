export interface User {
  id: string;
  github_username: string;
  avatar_url: string | null;
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
  used_count?: number;
  forks_count?: number;
  parent_id?: string | null;
  current_version?: string;
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
  used_count?: number;
  forks_count?: number;
  parent_id?: string | null;
  current_version?: string;
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
