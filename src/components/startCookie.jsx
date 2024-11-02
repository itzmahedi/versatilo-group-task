"use client";

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import Cookies from 'js-cookie';

import {startCookieMonitor} from '../utils/cookieMonitor';

import {useLogoutUserMutation} from '../redux/features/authApiSlice'


const StartCookie = ({ children }) => {
  const router = useRouter();
  const [logoutUser, { isLoadings, isErrors, errors }] = useLogoutUserMutation();

  useEffect(() => {
    const intervalId = startCookieMonitor((newCookieValue) => {
      logoutUser();
      router.push('/login');
    });

    return () => clearInterval(intervalId);
  }, []);

  return children;
};

export default StartCookie;
