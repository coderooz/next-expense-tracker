'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Sparkles,
  ArrowRight,
  MoreHorizontal,
  PieChart,
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Transactions', icon: ArrowLeftRight },
  { label: 'Categories', icon: Tags },
  { label: 'Reports', icon: PieChart },
];

export default function Header() {
  const [activeView, setActiveView] = useState('Overview');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const navigate = (view: string) => {
    setActiveView(view);
    setMobileNavOpen(false);
  };

  return (
    <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">
          <Wallet size={21} strokeWidth={2.2} />
        </div>
        <span>Pennywise</span>
      </div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={`nav-item ${activeView === item.label ? 'active' : ''}`}
              onClick={() => navigate(item.label)}
            >
              <Icon size={18} strokeWidth={1.9} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="tip-card">
          <div className="tip-icon">
            <Sparkles size={16} />
          </div>
          <strong>Small steps add up.</strong>
          <p>Stay consistent and make every rupee count.</p>
          <span className="tip-link">
            Your money, in focus <ArrowRight size={13} />
          </span>
        </div>
        <div className="profile">
          <div className="avatar">RS</div>
          <div className="profile-copy">
            <strong>Ranit Saha</strong>
            <span>Personal account</span>
          </div>
          <MoreHorizontal size={18} className="profile-more" />
        </div>
      </div>
    </aside>
  );
}
