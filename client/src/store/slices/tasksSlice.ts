
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, Comment } from '../types';

const initialState: Task[] = [];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Partial<Task> & { id: string }>) => {
      const index = state.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      return state.filter(task => task.id !== action.payload);
    },
    startTask: (state, action: PayloadAction<string>) => {
      const task = state.find(t => t.id === action.payload);
      if (task) {
        task.status = 'in_progress';
        task.startedAt = new Date().toISOString();
      }
    },
    completeTask: (state, action: PayloadAction<string>) => {
      const task = state.find(t => t.id === action.payload);
      if (task) {
        task.status = 'completed';
        task.completedAt = new Date().toISOString();
      }
    },
    holdTask: (state, action: PayloadAction<string>) => {
      const task = state.find(t => t.id === action.payload);
      if (task) {
        task.status = 'on_hold';
      }
    },
    blockTask: (state, action: PayloadAction<string>) => {
      const task = state.find(t => t.id === action.payload);
      if (task) {
        task.status = 'blocked';
      }
    },
    reopenTask: (state, action: PayloadAction<string>) => {
      const task = state.find(t => t.id === action.payload);
      if (task) {
        task.status = 'todo';
        task.completedAt = null;
      }
    },
    addTaskComment: (state, action: PayloadAction<{ taskId: string, comment: Comment }>) => {
      const { taskId, comment } = action.payload;
      const task = state.find(t => t.id === taskId);
      if (task) {
        task.comments.push(comment);
      }
    },
    assignTask: (state, action: PayloadAction<{ taskId: string, userId: string }>) => {
      const { taskId, userId } = action.payload;
      const task = state.find(t => t.id === taskId);
      if (task) {
        task.assigneeId = userId;
      }
    },
    unassignTask: (state, action: PayloadAction<string>) => {
      const task = state.find(t => t.id === action.payload);
      if (task) {
        task.assigneeId = null;
      }
    }
  }
});

export const { 
  addTask, 
  updateTask, 
  deleteTask, 
  startTask, 
  completeTask, 
  holdTask, 
  blockTask, 
  reopenTask, 
  addTaskComment,
  assignTask,
  unassignTask
} = tasksSlice.actions;
export default tasksSlice.reducer;
