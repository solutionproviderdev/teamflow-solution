
import { User, Project, Task } from '@/store/types';
import { generateId } from './dataUtils';

// Create mock users with consistent iconNames
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'admin@example.com',
    role: 'admin',
    jobTitle: 'Project Manager',
    iconName: 'user',
    createdAt: new Date(2023, 0, 15).toISOString()
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'worker',
    jobTitle: 'UI Designer',
    iconName: 'pen-tool',
    createdAt: new Date(2023, 1, 10).toISOString()
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'worker',
    jobTitle: 'Frontend Developer',
    iconName: 'code',
    createdAt: new Date(2023, 2, 5).toISOString()
  },
  {
    id: 'user-4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'worker',
    jobTitle: 'Backend Developer',
    iconName: 'database',
    createdAt: new Date(2023, 3, 20).toISOString()
  },
  {
    id: 'user-5',
    name: 'Alex Brown',
    email: 'alex@example.com',
    role: 'worker',
    jobTitle: 'QA Engineer',
    iconName: 'check-circle',
    createdAt: new Date(2023, 4, 12).toISOString()
  },
  {
    id: 'user-6',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'worker',
    jobTitle: 'Product Manager',
    iconName: 'briefcase',
    createdAt: new Date(2023, 5, 8).toISOString()
  }
];

// Create mock projects
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'Website Redesign',
    description: 'Redesign the company website with a modern look and improved user experience. Focus on mobile-first approach and optimize for performance.',
    managerId: 'user-1',
    members: ['user-2', 'user-3', 'user-5'],
    status: 'active',
    iconName: 'layout',
    comments: [
      {
        id: generateId(),
        content: 'Let\'s start by defining the key pages we need to redesign.',
        authorId: 'user-1',
        createdAt: new Date(2023, 6, 1, 10, 0).toISOString()
      },
      {
        id: generateId(),
        content: 'I\'ve prepared some initial wireframes. Will share them in our next meeting.',
        authorId: 'user-2',
        createdAt: new Date(2023, 6, 2, 14, 30).toISOString()
      }
    ],
    createdAt: new Date(2023, 6, 1).toISOString(),
    deadline: new Date(2023, 8, 30).toISOString()
  },
  {
    id: 'project-2',
    title: 'Mobile App Development',
    description: 'Develop a cross-platform mobile application for both iOS and Android using React Native. The app will allow users to track their fitness activities and nutrition.',
    managerId: 'user-6',
    members: ['user-3', 'user-4', 'user-5'],
    status: 'active',
    iconName: 'smartphone',
    comments: [
      {
        id: generateId(),
        content: 'We need to finalize the tech stack. Are we using Expo or bare React Native?',
        authorId: 'user-3',
        createdAt: new Date(2023, 7, 5, 11, 15).toISOString()
      }
    ],
    createdAt: new Date(2023, 7, 1).toISOString(),
    deadline: new Date(2023, 11, 15).toISOString()
  },
  {
    id: 'project-3',
    title: 'API Integration',
    description: 'Integrate third-party APIs for payment processing, user authentication, and data analytics. Ensure secure communication and proper error handling.',
    managerId: 'user-4',
    members: ['user-3', 'user-5'],
    status: 'on_hold',
    iconName: 'link',
    comments: [],
    createdAt: new Date(2023, 8, 10).toISOString(),
    deadline: new Date(2023, 9, 25).toISOString()
  },
  {
    id: 'project-4',
    title: 'Database Migration',
    description: 'Migrate from legacy SQL database to MongoDB. Create a data migration plan, execute the migration with minimal downtime, and validate the data integrity.',
    managerId: 'user-1',
    members: ['user-4'],
    status: 'completed',
    iconName: 'database',
    comments: [
      {
        id: generateId(),
        content: 'Migration completed successfully with zero data loss. Final validation passed.',
        authorId: 'user-4',
        createdAt: new Date(2023, 5, 20, 16, 45).toISOString()
      }
    ],
    createdAt: new Date(2023, 4, 15).toISOString(),
    deadline: new Date(2023, 5, 15).toISOString()
  }
];

// Create mock tasks
export const mockTasks: Task[] = [
  // Website Redesign Tasks
  {
    id: 'task-1',
    title: 'Create Wireframes',
    description: 'Design wireframes for the homepage, about us, services, and contact pages. Focus on responsive layouts for mobile, tablet, and desktop.',
    projectId: 'project-1',
    assigneeId: 'user-2',
    status: 'completed',
    priority: 'high',
    deadline: new Date(2023, 6, 15).toISOString(),
    iconName: 'pen-tool',
    comments: [
      {
        id: generateId(),
        content: 'Wireframes completed for desktop view. Working on mobile versions now.',
        authorId: 'user-2',
        createdAt: new Date(2023, 6, 10, 14, 0).toISOString()
      }
    ],
    createdAt: new Date(2023, 6, 2).toISOString(),
    startedAt: new Date(2023, 6, 3).toISOString(),
    completedAt: new Date(2023, 6, 14).toISOString()
  },
  {
    id: 'task-2',
    title: 'Implement Homepage',
    description: 'Develop the homepage according to the approved wireframes and designs. Implement responsive behavior and optimize loading performance.',
    projectId: 'project-1',
    assigneeId: 'user-3',
    status: 'in_progress',
    priority: 'medium',
    deadline: new Date(2023, 7, 5).toISOString(),
    iconName: 'code',
    comments: [],
    createdAt: new Date(2023, 6, 16).toISOString(),
    startedAt: new Date(2023, 6, 18).toISOString(),
    completedAt: null
  },
  {
    id: 'task-3',
    title: 'QA Testing',
    description: 'Perform quality assurance testing on all implemented pages. Test across different browsers and devices. Document any issues found.',
    projectId: 'project-1',
    assigneeId: 'user-5',
    status: 'todo',
    priority: 'medium',
    deadline: new Date(2023, 7, 20).toISOString(),
    iconName: 'check-circle',
    comments: [],
    createdAt: new Date(2023, 6, 25).toISOString(),
    startedAt: null,
    completedAt: null
  },
  
  // Mobile App Development Tasks
  {
    id: 'task-4',
    title: 'Design UI Components',
    description: 'Create reusable UI components following the material design guidelines. Components should include buttons, cards, lists, and form elements.',
    projectId: 'project-2',
    assigneeId: 'user-2',
    status: 'in_progress',
    priority: 'high',
    deadline: new Date(2023, 7, 25).toISOString(),
    iconName: 'palette',
    comments: [],
    createdAt: new Date(2023, 7, 5).toISOString(),
    startedAt: new Date(2023, 7, 7).toISOString(),
    completedAt: null
  },
  {
    id: 'task-5',
    title: 'Implement User Authentication',
    description: 'Implement user registration, login, password reset, and profile management features. Use Firebase Authentication for backend services.',
    projectId: 'project-2',
    assigneeId: 'user-3',
    status: 'todo',
    priority: 'high',
    deadline: new Date(2023, 8, 10).toISOString(),
    iconName: 'lock',
    comments: [],
    createdAt: new Date(2023, 7, 10).toISOString(),
    startedAt: null,
    completedAt: null
  },
  {
    id: 'task-6',
    title: 'Develop API Integration Layer',
    description: 'Create a service layer to handle all API interactions. Implement proper error handling, retries, and offline support.',
    projectId: 'project-2',
    assigneeId: 'user-4',
    status: 'blocked',
    priority: 'medium',
    deadline: new Date(2023, 8, 20).toISOString(),
    iconName: 'server',
    comments: [
      {
        id: generateId(),
        content: 'This task is blocked until we finalize the API endpoints with the backend team.',
        authorId: 'user-4',
        createdAt: new Date(2023, 7, 15, 11, 30).toISOString()
      }
    ],
    createdAt: new Date(2023, 7, 12).toISOString(),
    startedAt: new Date(2023, 7, 14).toISOString(),
    completedAt: null
  },
  
  // API Integration Tasks
  {
    id: 'task-7',
    title: 'Stripe Payment Integration',
    description: 'Integrate Stripe for payment processing. Implement payment methods, subscriptions, and webhook handling.',
    projectId: 'project-3',
    assigneeId: 'user-3',
    status: 'on_hold',
    priority: 'high',
    deadline: new Date(2023, 8, 30).toISOString(),
    iconName: 'credit-card',
    comments: [],
    createdAt: new Date(2023, 8, 12).toISOString(),
    startedAt: null,
    completedAt: null
  },
  {
    id: 'task-8',
    title: 'Google Analytics Integration',
    description: 'Implement Google Analytics for tracking user behavior and application performance. Set up custom events and conversion tracking.',
    projectId: 'project-3',
    assigneeId: 'user-5',
    status: 'on_hold',
    priority: 'low',
    deadline: new Date(2023, 9, 10).toISOString(),
    iconName: 'bar-chart-2',
    comments: [],
    createdAt: new Date(2023, 8, 15).toISOString(),
    startedAt: null,
    completedAt: null
  },
  
  // Database Migration Tasks
  {
    id: 'task-9',
    title: 'Create Migration Script',
    description: 'Develop scripts to export data from SQL database and import it into MongoDB. Ensure data integrity and proper type conversions.',
    projectId: 'project-4',
    assigneeId: 'user-4',
    status: 'completed',
    priority: 'high',
    deadline: new Date(2023, 5, 1).toISOString(),
    iconName: 'file-text',
    comments: [],
    createdAt: new Date(2023, 4, 20).toISOString(),
    startedAt: new Date(2023, 4, 21).toISOString(),
    completedAt: new Date(2023, 4, 30).toISOString()
  },
  {
    id: 'task-10',
    title: 'Test Migration in Staging',
    description: 'Run the migration scripts in a staging environment. Verify data integrity and application functionality with the new database.',
    projectId: 'project-4',
    assigneeId: 'user-4',
    status: 'completed',
    priority: 'high',
    deadline: new Date(2023, 5, 10).toISOString(),
    iconName: 'check-square',
    comments: [],
    createdAt: new Date(2023, 5, 1).toISOString(),
    startedAt: new Date(2023, 5, 2).toISOString(),
    completedAt: new Date(2023, 5, 8).toISOString()
  },
  {
    id: 'task-11',
    title: 'Production Migration',
    description: 'Execute the migration in the production environment during the scheduled maintenance window. Have a rollback plan ready.',
    projectId: 'project-4',
    assigneeId: 'user-4',
    status: 'completed',
    priority: 'high',
    deadline: new Date(2023, 5, 15).toISOString(),
    iconName: 'upload-cloud',
    comments: [
      {
        id: generateId(),
        content: 'Migration completed successfully. All services are now using the new MongoDB database.',
        authorId: 'user-4',
        createdAt: new Date(2023, 5, 15, 4, 30).toISOString()
      }
    ],
    createdAt: new Date(2023, 5, 10).toISOString(),
    startedAt: new Date(2023, 5, 15, 1, 0).toISOString(),
    completedAt: new Date(2023, 5, 15, 4, 0).toISOString()
  }
];
