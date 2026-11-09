
import {Expense } from "@/types/expenses.types";

import { money } from "@/lib/currency";
import {prettyDate} from "@/lib/date";
import {CategoryIcon} from "@/components/shared/CategoryIcon";
import {
  Pencil,
  ReceiptText,
} from 'lucide-react';


export default function TransactionList({
  rows,
  onEdit,
  compact = false,
}: {
  rows: Expense[];
  onEdit?: (item: Expense) => void;
  compact?: boolean;
}) {
  return (
    <div className={`transaction-list ${compact ? 'compact-list' : ''}`}>
      {rows.map(item => (
        <div className="transaction-row" key={item.id}>
          
            <CategoryIcon category={item.category} />
          
          <div className="transaction-copy">
            <strong>{item.title}</strong>
            <span>
              {item.category} · {prettyDate(item.date)}
            </span>
          </div>
          <div className="transaction-amount">
            <strong className={item.type === 'Income' ? 'positive-text' : ''}>
              {item.type === 'Income' ? '+' : '−'}
              {money(item.amount)}
            </strong>
            {!compact && <span>{item.payment}</span>}
          </div>
          {onEdit && (
            <button
              className="row-action"
              aria-label={`Edit ${item.title}`}
              onClick={() => onEdit(item)}
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
      ))}
      {rows.length === 0 && (
        <div className="empty-state">
          <ReceiptText size={25} />
          <strong>No transactions yet</strong>
          <span>Add an expense to get started.</span>
        </div>
      )}
    </div>
  );
}