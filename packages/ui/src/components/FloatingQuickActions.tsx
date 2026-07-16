'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, User, ShoppingBag, FileText, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from "@tecbunny/core/utils";

export function FloatingQuickActions() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const actions = [
    {
      label: 'New Customer',
      icon: User,
      href: '/mgmt/manager/customers/new',
      color: 'bg-blue-500 text-white hover:bg-blue-600',
    },
    {
      label: 'New Order',
      icon: ShoppingBag,
      href: '/mgmt/sales/orders/new',
      color: 'bg-emerald-500 text-white hover:bg-emerald-600',
    },
    {
      label: 'Create Invoice',
      icon: FileText,
      href: '/mgmt/accounts/invoices',
      color: 'bg-amber-500 text-white hover:bg-amber-600',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-5 fade-in-0 duration-200">
          {actions.map((action, i) => (
            <div
              key={action.label}
              className="flex items-center gap-3 group animate-in slide-in-from-bottom-2 fade-in-0"
              style={{ animationDelay: `${(actions.length - i) * 50}ms`, animationFillMode: 'both' }}
            >
              <span className="px-2.5 py-1 text-xs font-semibold text-white bg-zinc-900 rounded-md shadow-sm border border-zinc-700/50">
                {action.label}
              </span>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push(action.href);
                }}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-transform hover:scale-110",
                  action.color
                )}
                title={action.label}
              >
                <action.icon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full shadow-2xl shadow-blue-500/20 transition-all duration-300",
          open ? "bg-zinc-800 text-zinc-400 rotate-45" : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
        )}
      >
        {open ? <Plus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
}
