'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  GitBranch,
  Shield,
  Users,
  Package,
  Wrench,
  CreditCard,
  Activity,
  Bot,
  Settings,
  ClipboardList,
  Menu,
  Search,
  Sparkles,
  Bell,
  LogOut,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Command Center',
    items: [
      { href: '/superadmin/mgmt/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    title: 'Governance',
    items: [
      { href: '/superadmin/mgmt/organizations', label: 'Organizations', icon: Building2 },
      { href: '/superadmin/mgmt/branches', label: 'Branches', icon: GitBranch },
      { href: '/superadmin/mgmt/roles', label: 'RBAC (Roles)', icon: Shield },
      { href: '/superadmin/mgmt/users', label: 'Users', icon: Users },
    ],
  },
  {
    title: 'Catalogue',
    items: [
      { href: '/superadmin/mgmt/products', label: 'Products', icon: Package },
      { href: '/superadmin/mgmt/services', label: 'Services', icon: Wrench },
      { href: '/superadmin/mgmt/payment-settings', label: 'Payment Settings', icon: CreditCard },
      { href: '/superadmin/mgmt/marketing', label: 'Marketing', icon: Activity },
    ],
  },
  {
    title: 'Platform',
    items: [
      { href: '/superadmin/mgmt/ai-config', label: 'AI Configuration', icon: Bot },
      { href: '/superadmin/mgmt/settings', label: 'System Settings', icon: Settings },
      { href: '/superadmin/mgmt/audit-logs', label: 'Audit Logs', icon: ClipboardList },
    ],
  },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function SuperadminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'inherit', backgroundColor: '#f8fafc' }}>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(15,23,42,0.5)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          position: 'fixed',
          inset: '0 auto 0 0',
          zIndex: 50,
          width: '256px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s',
        }}
        className="lg:static lg:translate-x-0"
      >
        {/* Logo */}
        <div style={{ height: '64px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 20px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          {/* Inline SVG logo mark */}
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #dc2626, #991b1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '14px', flexShrink: 0 }}>
            T
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', lineHeight: 1.2 }}>
              TecBunny
            </p>
            <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#dc2626', lineHeight: 1.2 }}>
              Superadmin
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} style={{ marginBottom: '20px' }}>
              <p style={{ padding: '0 12px', marginBottom: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>
                {section.title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {section.items.map((item) => {
                  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'all 0.15s',
                        backgroundColor: isActive ? '#fef2f2' : 'transparent',
                        color: isActive ? '#b91c1c' : '#475569',
                        border: isActive ? '1px solid #fee2e2' : '1px solid transparent',
                      }}
                    >
                      <Icon style={{ width: '16px', height: '16px', flexShrink: 0, color: isActive ? '#dc2626' : '#94a3b8' }} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sign out */}
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px', flexShrink: 0 }}>
          <Link
            href="/api/admin-auth/logout"
            prefetch={false}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              color: '#64748b',
            }}
          >
            <LogOut style={{ width: '16px', height: '16px' }} />
            Sign out
          </Link>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="lg:ml-64" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{ height: '64px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            {/* Hamburger */}
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <Menu style={{ width: '20px', height: '20px' }} />
            </button>

            {/* Search */}
            <button
              className="hidden md:flex"
              style={{ alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: '8px', maxWidth: '400px', width: '100%', cursor: 'pointer', border: 'none', color: '#94a3b8', fontSize: '14px' }}
            >
              <Search style={{ width: '16px', height: '16px' }} />
              Search anywhere… (Cmd+K)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* AI Command */}
            <button
              className="hidden sm:flex"
              style={{ alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, background: 'linear-gradient(to right, #eef2ff, #f5f3ff)', color: '#4338ca', border: '1px solid #e0e7ff', cursor: 'pointer' }}
            >
              <Sparkles style={{ width: '14px', height: '14px', color: '#7c3aed' }} />
              AI Command
            </button>

            {/* Bell */}
            <button style={{ padding: '8px', borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', position: 'relative' }}>
              <Bell style={{ width: '20px', height: '20px' }} />
              <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }} />
            </button>

            {/* Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px' }}>
                S
              </div>
              <div className="hidden sm:block" style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>System Super Administrator</p>
                <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.3 }}>Superadmin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 32px' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
