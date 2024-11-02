import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('access_token');

  if (!token) {
    const url = new URL('/login', request.url);

    url.searchParams.set('sessionExpired', 'true');

return NextResponse.redirect(url);
  }


return NextResponse.next();
}

export const config = {
  matcher: ['/about', '/home'],
};
