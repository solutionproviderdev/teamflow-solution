
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'worker';
  jobTitle: string;
  iconName: string;
  createdAt: string;
  avatarUrl?: string;
}

 // What you send to backend when creating a user
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'worker';
  jobTitle?: string;
  iconName?: string;
}
 
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string | null;
  status: 'todo' | 'in_progress' | 'on_hold' | 'blocked' | 'completed';
  priority: 'low' | 'medium' | 'high';
  deadline: string | null;
  iconName: string;
  comments: Comment[];
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  managerId: string;
  members: string[];
  status: 'active' | 'completed' | 'on_hold';
  iconName: string;
  comments: Comment[];
  createdAt: string;
  deadline: string | null;
}

// Remove the conflicting RootState interface since it's now defined in store.ts
// The RootState type should be inferred from the actual store configuration
