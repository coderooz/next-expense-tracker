'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface MonthlyBarItem {
  month: string;
  income: number;
  expense: number;
}

interface CashFlowChartProps {
  monthlyBars?: MonthlyBarItem[];
}

const defaultBars: MonthlyBarItem[] = [
  { month: 'Jan', income: 0.62, expense: 0.38 },
  { month: 'Feb', income: 0.78, expense: 0.42 },
  { month: 'Mar', income: 0.7, expense: 0.49 },
  { month: 'Apr', income: 0.9, expense: 0.58 },
  { month: 'May', income: 0.76, expense: 0.46 },
  { month: 'Jun', income: 1, expense: 0.55 },
];

export function CashFlowChart({ monthlyBars = defaultBars }: CashFlowChartProps) {
  return (
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
  );
}

export default CashFlowChart;
