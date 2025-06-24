
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, Comment } from '../types';

const initialState: Project[] = [];

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Partial<Project> & { id: string }>) => {
      const index = state.findIndex(project => project.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      return state.filter(project => project.id !== action.payload);
    },
    addProjectMember: (state, action: PayloadAction<{ projectId: string, userId: string }>) => {
      const { projectId, userId } = action.payload;
      const project = state.find(p => p.id === projectId);
      if (project && !project.members.includes(userId)) {
        project.members.push(userId);
      }
    },
    removeProjectMember: (state, action: PayloadAction<{ projectId: string, userId: string }>) => {
      const { projectId, userId } = action.payload;
      const project = state.find(p => p.id === projectId);
      if (project) {
        project.members = project.members.filter(id => id !== userId);
      }
    },
    addProjectComment: (state, action: PayloadAction<{ projectId: string, comment: Comment }>) => {
      const { projectId, comment } = action.payload;
      const project = state.find(p => p.id === projectId);
      if (project) {
        project.comments.push(comment);
      }
    }
  }
});

export const { 
  addProject, 
  updateProject, 
  deleteProject, 
  addProjectMember, 
  removeProjectMember,
  addProjectComment
} = projectsSlice.actions;
export default projectsSlice.reducer;
