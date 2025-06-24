
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

const initialState: User[] = [];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<Partial<User> & { id: string }>) => {
      const index = state.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      return state.filter(user => user.id !== action.payload);
    }
  }
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
