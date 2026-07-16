'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Package,
  ShoppingBag,
  FileText,
  LifeBuoy
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './ui/command';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() => runCommand(() => router.push('/mgmt/sales/orders/new'))}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>New Order</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/mgmt/manager/customers/new'))}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Add Customer</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/mgmt/accounts/invoices'))}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Create Invoice</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => router.push('/waba'))}
            >
              <Smile className="mr-2 h-4 w-4" />
              <span>WABA Workspace</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/mgmt/sales'))}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Sales Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/mgmt/manager/inventory'))}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>Inventory</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/mgmt/accounts'))}
            >
              <Calculator className="mr-2 h-4 w-4" />
              <span>Accounts</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => runCommand(() => router.push('/superadmin/users'))}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/superadmin/settings'))}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
