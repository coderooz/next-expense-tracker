'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, CalendarDays, Bell } from 'lucide-react';

interface TopbarProps {
  onOpenMobileNav: () => void;
}

export function Topbar({ onOpenMobileNav }: TopbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const getPageTitle = () => {
    if (pathname.includes('/transactions')) return 'Transactions';
    if (pathname.includes('/categories')) return 'Categories';
    if (pathname.includes('/reports')) return 'Reports';
    return 'Overview';
  };

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  }).format(new Date());

  const initials =
    session?.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        <button
          className="mobile-menu icon-button"
          aria-label="Open navigation"
          onClick={onOpenMobileNav}
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumb">
          Workspace <span>/</span> <strong>{getPageTitle()}</strong>
        </div>
      </div>

      <div className="topbar-actions">
        <span className="today-label hidden sm:flex items-center gap-1.5 text-xs text-[#87939c]">
          <CalendarDays size={15} /> {todayFormatted}
        </span>

        <button
          className="icon-button notification-button"
          aria-label="Notifications"
          title="No unread alerts"
        >
          <Bell size={18} />
          <i />
        </button>

        <div className="top-avatar" title={session?.user?.name || 'User'}>
          {initials}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
