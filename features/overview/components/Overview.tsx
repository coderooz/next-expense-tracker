'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { categories, categoryColors } from '@/constants/categories.constants';
import PageHeading from '@/components/shared/PageHeading';
import StatCard from '@/components/shared/StatCard';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import TransactionList from '@/components/transactions/TransactionList';
import { money } from '@/lib/currency';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { useExpenses } from '@/hooks/useExpenses';
import { useApp } from '@/context/AppContext';
import type { Expense } from '@/types/expenses.types';

export function Overview() {
  const router = useRouter();
  const { data: session } = useSession();
  const { setIsModalOpen, setEditingExpense } = useApp();

  // Fetch expenses from API via SWR
  const { expenses: transactions, summary, isLoading } = useExpenses({
    limit: 100,
  });

  const userName = session?.user?.name ? session.user.name.split(' ')[0] : 'there';

  const income = summary.totalIncome;
  const totalExpenses = summary.totalExpenses;
  const balance = summary.netBalance;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  const latest = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const byCategory = categories
    .filter((c) => c !== 'Income')
    .map((category) => ({
      category,
      value: transactions
        .filter((t) => t.type === 'Expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalSpend = byCategory.reduce((sum, row) => sum + row.value, 0);

  // Compute 6-month cashflow bars dynamically from real transaction data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      monthStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: months[d.getMonth()],
    };
  });

  const maxMonthValue = Math.max(
    1,
    ...last6Months.map(({ monthStr }) => {
      const monthTx = transactions.filter((t) => t.date.startsWith(monthStr));
      const inc = monthTx.filter((t) => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
      const exp = monthTx.filter((t) => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
      return Math.max(inc, exp);
    })
  );

  const monthlyBars = last6Months.map(({ monthStr, label }) => {
    const monthTx = transactions.filter((t) => t.date.startsWith(monthStr));
    const inc = monthTx.filter((t) => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
    const exp = monthTx.filter((t) => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
    return {
      month: label,
      income: maxMonthValue > 0 ? inc / maxMonthValue : 0,
      expense: maxMonthValue > 0 ? exp / maxMonthValue : 0,
    };
  });

  const handleAdd = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Expense) => {
    setEditingExpense(item);
    setIsModalOpen(true);
  };

  const handleViewAll = () => {
    router.push('/dashboard/transactions');
  };

  return (
    <>
      <PageHeading
        title={`Good morning, ${userName} 👋`}
        description="Here’s what’s happening with your money today."
        action={
          <button
            type="button"
            className="button button-primary"
            onClick={handleAdd}
          >
            <Plus size={17} />
            <span>Add transaction</span>
          </button>
        }
      />

      <section className="stat-grid">
        <StatCard
          label="Total balance"
          value={money(balance)}
          trend={balance >= 0 ? '+Active' : '−Deficit'}
          note="computed total"
          icon={<Wallet size={18} />}
          tone="green"
        />
        <StatCard
          label="Total Income"
          value={money(income)}
          trend="+Received"
          note="all time"
          icon={<ArrowDownRight size={18} />}
          tone="blue"
        />
        <StatCard
          label="Total Expenses"
          value={money(totalExpenses)}
          trend="−Spent"
          note="all time"
          icon={<ArrowUpRight size={18} />}
          tone="orange"
        />
        <StatCard
          label="Savings rate"
          value={`${savingsRate}%`}
          trend={savingsRate > 20 ? 'Optimal' : 'Caution'}
          note="of total earnings"
          icon={<TrendingUp size={18} />}
          tone="violet"
        />
      </section>

      <section className="overview-grid">
        <article className="panel cashflow-panel">
          <div className="panel-header">
            <div>
              <h2>Cash flow</h2>
              <p>Income vs. expenses (last 6 months)</p>
            </div>
            <button type="button" className="select-control">
              <span>Last 6 months</span>
              <ChevronDown size={14} />
            </button>
          </div>
          <div className="chart-legend">
            <span>
              <i className="legend-dot income-dot" /> Income
            </span>
            <span>
              <i className="legend-dot expense-dot" /> Expenses
            </span>
          </div>
          <div className="bar-chart">
            <div className="chart-y-labels">
              <span>₹80k</span>
              <span>₹60k</span>
              <span>₹40k</span>
              <span>₹20k</span>
              <span>₹0</span>
            </div>
            <div className="chart-plot">
              <div className="chart-grid-lines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              {monthlyBars.map((item) => (
                <div className="bar-group" key={item.month}>
                  <div className="bar-pair">
                    <div
                      className="bar income-bar"
                      style={{ height: `${Math.max(4, item.income * 100)}%` }}
                    />
                    <div
                      className="bar expense-bar"
                      style={{ height: `${Math.max(4, item.expense * 100)}%` }}
                    />
                  </div>
                  <span>{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel category-panel">
          <div className="panel-header">
            <div>
              <h2>Spending by category</h2>
              <p>Where your money goes</p>
            </div>
            <button
              type="button"
              className="icon-button subtle-icon"
              aria-label="Category options"
              onClick={() => router.push('/dashboard/categories')}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="category-total">
            <strong>{money(totalSpend)}</strong>
            <span>Total spent</span>
          </div>
          <div className="category-breakdown">
            {byCategory.slice(0, 5).map((row) => (
              <div className="category-line" key={row.category}>
                <CategoryIcon category={row.category} />
                <div className="category-line-copy">
                  <div>
                    <strong>{row.category}</strong>
                    <span>{money(row.value)}</span>
                  </div>
                  <div className="progress-track">
                    <i
                      className={categoryColors[row.category]}
                      style={{
                        width: `${totalSpend ? (row.value / totalSpend) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {byCategory.length === 0 && !isLoading && (
              <div className="text-xs text-[#9aa4ab] py-6 text-center">
                No expense categories recorded yet.
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="overview-grid lower-grid">
        <article className="panel recent-panel">
          <div className="panel-header">
            <div>
              <h2>Recent transactions</h2>
              <p>Your latest money movements</p>
            </div>
            <button
              type="button"
              className="text-button flex items-center gap-1 text-xs text-[#237a61] font-bold"
              onClick={handleViewAll}
            >
              <span>View all</span>
              <ArrowRight size={15} />
            </button>
          </div>
          <TransactionList rows={latest} onEdit={handleEdit} compact />
        </article>

        <article className="panel insight-panel">
          <div className="panel-header">
            <div>
              <h2>Monthly snapshot</h2>
              <p>Your progress at a glance</p>
            </div>
            <span className="snapshot-icon">
              <Sparkles size={17} />
            </span>
          </div>
          <div className="snapshot-highlight">
            <span>Available to save</span>
            <strong>{money(balance)}</strong>
            <small>Based on your recorded income and expenses</small>
          </div>
          <div className="snapshot-row">
            <span>Income</span>
            <strong>{money(income)}</strong>
          </div>
          <div className="snapshot-row">
            <span>Expenses</span>
            <strong>{money(totalExpenses)}</strong>
          </div>
          <div className="snapshot-row">
            <span>Savings rate</span>
            <strong className="positive-text">{savingsRate}%</strong>
          </div>
          <div className="snapshot-footer">
            <span className="snapshot-check">
              <Check size={13} />
            </span>{' '}
            <span>You’re building a healthy habit.</span>
          </div>
        </article>
      </section>
    </>
  );
}

export default Overview;
