import { Expense } from "@/types/expenses.types";


interface StorageProps {
  transaction: Expense[];
  storage_key?:string;
}

export function PersistStorage ({transaction, storage_key="pennywise-transactions"} : StorageProps) {
  
    localStorage.setItem(
      storage_key,
      JSON.stringify(transaction)
    );
}