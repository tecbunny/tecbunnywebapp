import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// @ts-ignore
import { createClient } from '@tecbunny/core';

export async function middleware(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If no user, redirect to login (assuming superadmin uses the same auth flow or custom route)
  if (!user) {
    const url = request.nextUrl.clone();
    // Assuming mgmt dashboard handles auth or there is a specific superadmin login
    url.hostname = 'mgmt.tecbunny.com';
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Assuming roles are embedded in user_metadata or app_metadata
  const userRole = user.app_metadata?.role || user.user_metadata?.role;

  // Strict Superadmin boundary check
  if (userRole !== 'superadmin') {
    return new NextResponse('Forbidden: Superadmin Privileges Required', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
