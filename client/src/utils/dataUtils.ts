
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../store/store';
import { Comment, User, Project, Task } from '../store/types';
import { toast } from '@/components/ui/use-toast';

// Generate a unique ID
export const generateId = (): string => uuidv4();

// Format date to a readable format
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'No date set';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Calculate days remaining until deadline
export const daysRemaining = (deadline: string | null): number | null => {
  if (!deadline) return null;
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Create a new comment
export const createComment = (content: string, authorId: string): Comment => {
  return {
    id: generateId(),
    content,
    authorId,
    createdAt: new Date().toISOString()
  };
};

// Export the entire state to JSON
export const exportStateToJson = (state: RootState): string => {
  return JSON.stringify(state, null, 2);
};

// Import state from JSON
export const importStateFromJson = (jsonString: string): RootState | null => {
  try {
    return JSON.parse(jsonString) as RootState;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    toast({
      title: 'Error',
      description: 'Failed to import data. Invalid JSON format.',
      variant: 'destructive'
    });
    return null;
  }
};

// Download a JSON file
export const downloadJson = (data: any, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  toast({
    title: 'Success',
    description: `${filename} has been downloaded.`
  });
};

// Initialize app with mock data
export const initializeWithMockData = (
  users: User[], 
  projects: Project[], 
  tasks: Task[]
): RootState => {
  return {
    users,
    projects,
    tasks,
    auth: {
      currentUserId: null,
      isAuthenticated: false
    }
  };
};

// Calculate project progress
export const calculateProjectProgress = (projectId: string, tasks: Task[]): number => {
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  if (projectTasks.length === 0) return 0;
  
  const completedTasks = projectTasks.filter(task => task.status === 'completed');
  return Math.round((completedTasks.length / projectTasks.length) * 100);
};

// Get project tasks
export const getProjectTasks = (projectId: string, tasks: Task[]): Task[] => {
  return tasks.filter(task => task.projectId === projectId);
};

// Get user tasks
export const getUserTasks = (userId: string, tasks: Task[]): Task[] => {
  return tasks.filter(task => task.assigneeId === userId);
};

// Get task status color
export const getStatusColor = (status: Task['status']): string => {
  switch (status) {
    case 'todo':
      return 'bg-gray-200 text-gray-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'on_hold':
      return 'bg-yellow-100 text-yellow-800';
    case 'blocked':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get priority color
export const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'low':
      return 'bg-gray-100 text-gray-800';
    case 'medium':
      return 'bg-blue-100 text-blue-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
