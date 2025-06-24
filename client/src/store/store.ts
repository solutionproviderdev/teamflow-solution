
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import projectsReducer from './slices/projectsSlice';
import tasksReducer from './slices/tasksSlice';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('solutionManagerState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['payload.deadline', 'tasks/addTask/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: [
          'tasks.entities.*.deadline',
          'tasks.entities.*.createdAt',
          'tasks.entities.*.startedAt',
          'tasks.entities.*.completedAt',
          'projects.entities.*.deadline',
          'projects.entities.*.createdAt',
        ],
      },
    }),
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Save state to localStorage
const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('solutionManagerState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

// Subscribe to store changes to save state to localStorage
store.subscribe(() => {
  saveState(store.getState());
});
