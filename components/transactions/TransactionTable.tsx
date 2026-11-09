'use client';

import React from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import type { Expense } from '@/types/expenses.types';
import { prettyDate } from '@/lib/date';
import { money } from '@/lib/currency';
import CategoryIcon from '@/components/shared/CategoryIcon';

interface TransactionTableProps {
  rows: Expense[];
  onEdit: (item: Expense) => void;
  onDelete: (item: Expense) => void;
}

export function TransactionTable({
  rows,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>TRANSACTION</th>
            <th>CATEGORY</th>
            <th>DATE</th>
            <th>PAYMENT METHOD</th>
            <th className="align-right">AMOUNT</th>
            <th className="align-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="table-title">
                  <CategoryIcon category={item.category} size={15} />
                  <strong className="text-xs font-semibold text-[#202b37]">
                    {item.title}
                  </strong>
                </div>
              </td>
              <td>
                <span className="category-label">{item.category}</span>
              </td>
              <td className="text-xs text-[#788591]">{prettyDate(item.date)}</td>
              <td className="text-xs text-[#788591]">
                {item.paymentMethod || item.payment || 'UPI'}
              </td>
              <td
                className={`align-right amount-cell text-xs font-bold ${
                  item.type === 'Income' ? 'positive-text' : 'text-[#202b37]'
                }`}
              >
                {item.type === 'Income' ? '+' : '−'}
                {money(item.amount)}
              </td>
              <td>
                <div className="table-actions flex justify-end gap-1">
                  <button
                    type="button"
                    className="p-1.5 text-[#788591] hover:text-[#237a61] hover:bg-[#eaf4f0] rounded-lg transition"
                    aria-label={`Edit ${item.title}`}
                    onClick={() => onEdit(item)}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-[#788591] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => onDelete(item)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="empty-state table-empty p-8 text-center flex flex-col items-center justify-center">
          <Search size={24} className="text-[#9aa5ab] mb-2" />
          <strong className="text-xs font-bold text-[#202b37]">
            No matching transactions
          </strong>
          <span className="text-[11px] text-[#788591] mt-0.5">
            Try changing your search or filters.
          </span>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;
