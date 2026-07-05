import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

import { verifySuperadminSessionToken } from "@tecbunny/core/server";

export const dynamic = 'force-dynamic';

export default async function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const superadminCookie = cookieStore.get('superadmin-session')?.value;
  const isSuperadmin = Boolean(await verifySuperadminSessionToken(superadminCookie));

  if (!isSuperadmin) {
    redirect('/superadmin/login?error=session_expired');
  }

  return (
    <div id="superadmin-main">
      {children}
    </div>
  );
}
