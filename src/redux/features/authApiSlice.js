import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { logout } from '../features/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://mges.tech/api',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
  
    const token = Cookies.get('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Login an Logout Slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: '/resources',
        method: 'POST',
        body: {
          resource: 'auth',
          action: 'login',
          ...credentials,
        },
      }),
    }),
    // Log Out
    logoutUser: builder.mutation({
      query: () => ({
        url: '/resources',
        method: 'POST',
        body: {
          resource: 'auth',
          action: 'logout',
        },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          Cookies.remove('access_token');
          dispatch(logout());
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutUserMutation } = authApi;
