'use client';

import React from 'react';
import {
  Search,
  Tags,
  CalendarDays,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { categories } from '@/constants/categories.constants';

interface TransactionFiltersProps {
  search: string;
  category: string;
  dateFilter: string;
  type: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onReset: () => void;
}

export function TransactionFilters({
  search,
  category,
  dateFilter,
  type,
  onSearchChange,
  onCategoryChange,
  onDateFilterChange,
  onTypeChange,
  onReset,
}: TransactionFiltersProps) {
  return (
    <div className="transaction-toolbar">
      {/* Search Input */}
      <div className="search-box">
        <Search size={17} className="text-[#9aa5ab]" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search transactions by title…"
          aria-label="Search transactions"
        />
      </div>

      {/* Filter Select Controls */}
      <div className="filter-controls">
        {/* Category Filter */}
        <label>
          <Tags size={15} />
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="All categories">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown size={13} />
        </label>

        {/* Date Filter */}
        <label>
          <CalendarDays size={15} />
          <select
            aria-label="Filter by date"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
          >
            <option value="All time">All time</option>
            <option value="This month">This month</option>
            <option value="Last 30 days">Last 30 days</option>
          </select>
          <ChevronDown size={13} />
        </label>

        {/* Type Filter */}
        <label>
          <SlidersHorizontal size={15} />
          <select
            aria-label="Filter by type"
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value="All">All types</option>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
          <ChevronDown size={13} />
        </label>
      </div>

      {/* Reset Action */}
      <button
        type="button"
        className="reset-button flex items-center gap-1.5"
        onClick={onReset}
        title="Reset all filters"
      >
        <RotateCcw size={12} />
        <span>Reset</span>
      </button>
    </div>
  );
}

export default TransactionFilters;
