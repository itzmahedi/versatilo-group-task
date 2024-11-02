import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      Cookies.remove('authUser');
      Cookies.remove('access_token');
    },
    checkAuth: (state) => {
      const userDataString = Cookies.get('authUser');

      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);

          state.isAuthenticated = true;
          state.user = userData;
        } catch (error) {
          console.error('Error parsing user data from cookies:', error);
          Cookies.remove('authUser');
        }
      }
    },
  },
});


export const { setAuth, logout, checkAuth } = authSlice.actions;

export default authSlice.reducer;
