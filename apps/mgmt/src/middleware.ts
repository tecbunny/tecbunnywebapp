import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// @ts-ignore
import { createClient } from '@tecbunny/core';

// Allowed staff roles for the mgmt dashboard
const ALLOWED_ROLES = ['admin', 'sales_manager', 'service_manager', 'sales_executive', 'store_executive', 'superadmin'];

export async function middleware(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Assuming roles are embedded in user_metadata or app_metadata
  const userRole = user.app_metadata?.role || user.user_metadata?.role;

  if (!userRole || !ALLOWED_ROLES.includes(userRole)) {
    // If authenticated but wrong role, return a 403 or redirect
    return new NextResponse('Forbidden: Insufficient Privileges', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/login (the login page itself to prevent redirect loops)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/login).*)',
  ],
};
