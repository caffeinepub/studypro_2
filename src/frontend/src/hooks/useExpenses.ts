import { format } from "date-fns";
import { useCallback } from "react";
import type { Expense } from "../types";
import { useLocalStorage } from "./useLocalStorage";

const today = format(new Date(), "yyyy-MM-dd");
const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
const twoDaysAgo = format(new Date(Date.now() - 172800000), "yyyy-MM-dd");

const SEED_EXPENSES: Expense[] = [
  {
    id: "exp-1",
    date: today,
    category: "Food",
    amount: 120,
    description: "Lunch at canteen",
  },
  {
    id: "exp-2",
    date: today,
    category: "Travel",
    amount: 45,
    description: "Bus fare to library",
  },
  {
    id: "exp-3",
    date: yesterday,
    category: "Shopping",
    amount: 250,
    description: "New notebook and stationery",
  },
  {
    id: "exp-4",
    date: yesterday,
    category: "Food",
    amount: 80,
    description: "Evening snacks",
  },
  {
    id: "exp-5",
    date: twoDaysAgo,
    category: "Bills",
    amount: 500,
    description: "Mobile recharge",
  },
  {
    id: "exp-6",
    date: twoDaysAgo,
    category: "Other",
    amount: 150,
    description: "Study material photocopy",
  },
];

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>(
    "studypro_expenses",
    SEED_EXPENSES,
  );

  const addExpense = useCallback(
    (expense: Omit<Expense, "id">) => {
      const newExpense: Expense = {
        ...expense,
        id: `exp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      setExpenses((prev) => [newExpense, ...prev]);
    },
    [setExpenses],
  );

  const deleteExpense = useCallback(
    (id: string) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    },
    [setExpenses],
  );

  const todayExpenses = useCallback(
    (dateStr?: string) => {
      const d = dateStr ?? format(new Date(), "yyyy-MM-dd");
      return expenses
        .filter((e) => e.date === d)
        .reduce((sum, e) => sum + e.amount, 0);
    },
    [expenses],
  );

  return { expenses, addExpense, deleteExpense, todayExpenses };
}
