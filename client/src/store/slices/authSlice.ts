
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  currentUserId: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUserId: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUserId = null;
      state.isAuthenticated = false;
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
