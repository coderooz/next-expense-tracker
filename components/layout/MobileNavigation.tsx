'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  PieChart,
  Wallet,
  X,
  LogOut,
} from 'lucide-react';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
  { label: 'Categories', href: '/dashboard/categories', icon: Tags },
  { label: 'Reports', href: '/dashboard/reports', icon: PieChart },
];

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!isOpen) return null;

  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || 'user@example.com';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white p-6 shadow-xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#237a61] text-white flex items-center justify-center shadow-md shadow-[#237a6126]">
                <Wallet size={18} />
              </div>
              <span className="font-extrabold text-xl text-[#202b37] tracking-tight">
                Pennywise
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#788591] hover:text-[#202b37] rounded-lg transition"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="text-[10px] font-bold text-[#9aa5ad] tracking-wider mb-3">
            WORKSPACE
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#eaf4f0] text-[#237a61]'
                      : 'text-[#79858e] hover:bg-zinc-50 hover:text-[#237a61]'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer profile */}
        <div className="pt-4 border-t border-[#e8edef]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-[#efebf9] text-[#695b9a] font-bold text-xs flex items-center justify-center">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#202b37] truncate max-w-[110px]">
                  {userName}
                </p>
                <p className="text-[10px] text-[#9aa4ab] truncate max-w-[110px]">
                  {userEmail}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 text-[#788591] hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileNavigation;
