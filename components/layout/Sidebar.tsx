'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  PieChart,
  LogOut,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
  { label: 'Categories', href: '/dashboard/categories', icon: Tags },
  { label: 'Reports', href: '/dashboard/reports', icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || 'user@example.com';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <Link href="/dashboard" prefetch={true} className="brand flex items-center gap-2.5">
        <Image
          src="/pennywise-brand.svg"
          alt="Pennywise"
          width={32}
          height={32}
          priority
          className="rounded-lg shadow-sm"
        />
        <span>Pennywise</span>
      </Link>

      <div className="workspace-label">WORKSPACE</div>

      {/* Navigation Links */}
      <nav className="side-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : item.href === '/dashboard/transactions'
              ? pathname.startsWith('/dashboard/transactions') || pathname.startsWith('/expenses')
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer / Profile */}
      <div className="sidebar-bottom">
        <div className="tip-card">
          <div className="tip-icon">
            <Sparkles size={14} />
          </div>
          <strong>Smart Budgeting</strong>
          <p>Categorize expenses consistently to uncover savings opportunities.</p>
        </div>

        <div className="profile">
          <div className="avatar">{initials}</div>
          <div className="profile-copy">
            <strong className="truncate max-w-[120px]">{userName}</strong>
            <span className="truncate max-w-[120px]">{userEmail}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Sign out"
            className="profile-more p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
