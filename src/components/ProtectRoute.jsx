"use client";

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import Cookies from 'js-cookie';

const ProtectRoute = ({ children }) => {
  const router = useRouter();

  // I need to check also server side access token

  useEffect(() => {
    const token = Cookies.get('access_token');

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return children;
};

export default ProtectRoute;
