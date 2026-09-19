export interface TeamMember {
  id: number;
  name?: string;
  email: string;
}

export interface TaskComment {
  id: number;
  content: string;
  author: TeamMember;
  mentions: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskSummary {
  id: number;
  title: string;
  description?: string;
  assignees: TeamMember[];
}

export interface TaskDetail extends TaskSummary {
  comments: TaskComment[];
}
