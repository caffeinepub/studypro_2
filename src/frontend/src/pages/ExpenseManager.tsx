import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useExpenses } from "@/hooks/useExpenses";
import type { Expense } from "@/types";
import {
  CATEGORY_COLORS,
  EXPENSE_CATEGORIES,
  formatCurrency,
} from "@/utils/helpers";
import {
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const defaultForm = {
  date: format(new Date(), "yyyy-MM-dd"),
  category: "Food" as Expense["category"],
  amount: 0,
  description: "",
};

export function ExpenseManager() {
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const monthStr = format(currentMonth, "yyyy-MM");
  const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

  const monthExpenses = expenses.filter(
    (e) => e.date >= monthStart && e.date <= monthEnd,
  );
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Category breakdown for pie chart
  const categoryData = EXPENSE_CATEGORIES.map((cat) => ({
    name: cat,
    value: monthExpenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0),
    color: CATEGORY_COLORS[cat],
  })).filter((c) => c.value > 0);

  // Daily totals for bar chart
  const daysInMonth = endOfMonth(currentMonth).getDate();
  const dailyData = Array.from(
    { length: Math.min(daysInMonth, 31) },
    (_, i) => {
      const day = i + 1;
      const dateStr = `${monthStr}-${String(day).padStart(2, "0")}`;
      const total = monthExpenses
        .filter((e) => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);
      return { day: String(day), amount: total };
    },
  ).filter(
    (d) => d.amount > 0 || Number.parseInt(d.day) <= new Date().getDate() + 1,
  );

  const handleSubmit = () => {
    if (!form.amount || form.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    addExpense(form);
    toast.success("Expense added");
    setSheetOpen(false);
    setForm(defaultForm);
  };

  return (
    <div data-ocid="expenses.page" className="space-y-4 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-foreground">
          Expenses
        </h1>
        <Button
          data-ocid="expenses.add_button"
          size="sm"
          onClick={() => setSheetOpen(true)}
          className="bg-[oklch(0.62_0.22_265)] text-white rounded-xl h-8 px-3 gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <h2 className="text-sm font-display font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Monthly total */}
      <div
        className="relative overflow-hidden rounded-2xl p-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.05 65) 0%, oklch(0.18 0.03 70) 100%)",
          border: "1px solid oklch(0.75 0.18 65 / 0.3)",
        }}
      >
        <p className="text-xs text-[oklch(0.82_0.16_65)] font-medium uppercase tracking-wider">
          Total This Month
        </p>
        <p className="text-4xl font-display font-black text-[oklch(0.88_0.16_65)] mt-1">
          {formatCurrency(monthTotal)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {monthExpenses.length} transactions
        </p>
      </div>

      {/* Category breakdown */}
      {categoryData.length > 0 && (
        <div className="glass-card rounded-2xl p-4">
          <h2 className="text-sm font-display font-semibold text-foreground mb-3">
            By Category
          </h2>
          <div className="flex items-center gap-4">
            <PieChart width={90} height={90}>
              <Pie
                data={categoryData}
                cx={45}
                cy={45}
                innerRadius={25}
                outerRadius={42}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="flex-1 space-y-1.5">
              {categoryData.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: cat.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {formatCurrency(cat.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Daily chart */}
      {dailyData.some((d) => d.amount > 0) && (
        <div className="glass-card rounded-2xl p-4">
          <h2 className="text-sm font-display font-semibold text-foreground mb-3">
            Daily Spending
          </h2>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={dailyData}>
              <XAxis
                dataKey="day"
                tick={{ fill: "oklch(0.6 0.01 265)", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.18 0.022 275)",
                  border: "1px solid oklch(0.3 0.025 275)",
                  borderRadius: "8px",
                  color: "oklch(0.96 0.008 265)",
                  fontSize: 12,
                }}
                formatter={(val: number) => [formatCurrency(val), ""]}
              />
              <Bar
                dataKey="amount"
                fill="oklch(0.75 0.18 65)"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Expense list */}
      <div>
        <h2 className="text-sm font-display font-semibold text-foreground mb-2">
          Transactions
        </h2>
        {monthExpenses.length === 0 ? (
          <div
            data-ocid="expenses.empty_state"
            className="glass-card rounded-2xl p-8 text-center"
          >
            <DollarSign className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground">
              No expenses this month
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {monthExpenses.map((expense, i) => (
                <motion.div
                  key={expense.id}
                  data-ocid={`expenses.expense.item.${i + 1}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card rounded-xl px-4 py-3 flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{
                      background: `${CATEGORY_COLORS[expense.category]}22`,
                    }}
                  >
                    {expense.category === "Food"
                      ? "🍽️"
                      : expense.category === "Travel"
                        ? "🚌"
                        : expense.category === "Bills"
                          ? "📱"
                          : expense.category === "Shopping"
                            ? "🛍️"
                            : "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {expense.description || expense.category}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{
                          background: `${CATEGORY_COLORS[expense.category]}22`,
                          color: CATEGORY_COLORS[expense.category],
                        }}
                      >
                        {expense.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {expense.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-display font-bold text-[oklch(0.82_0.16_65)]">
                      {formatCurrency(expense.amount)}
                    </span>
                    <button
                      type="button"
                      data-ocid={`expenses.delete_button.${i + 1}`}
                      onClick={() => {
                        deleteExpense(expense.id);
                        toast.success("Expense deleted");
                      }}
                      className="w-7 h-7 rounded-lg bg-[oklch(0.65_0.22_25/0.1)] flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3 text-[oklch(0.78_0.2_25)]" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Expense Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="bg-[oklch(0.15_0.02_275)] border-[oklch(0.3_0.025_275)] rounded-t-3xl max-h-[85vh] overflow-y-auto"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="font-display text-foreground">
              Add Expense
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-6">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Amount (₹)
              </Label>
              <Input
                data-ocid="expenses.amount.input"
                type="number"
                min={0}
                value={form.amount || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    amount: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0.00"
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl text-lg font-display"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    category: v as Expense["category"],
                  }))
                }
              >
                <SelectTrigger
                  data-ocid="expenses.category.select"
                  className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.18_0.022_275)] border-[oklch(0.3_0.025_275)]">
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Description
              </Label>
              <Input
                data-ocid="expenses.description.input"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="What was this for?"
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input
                data-ocid="expenses.date.input"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setSheetOpen(false)}
                className="flex-1 rounded-xl border-[oklch(0.3_0.025_275)]"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                data-ocid="expenses.submit_button"
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-[oklch(0.62_0.22_265)] text-white"
              >
                Add Expense
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
