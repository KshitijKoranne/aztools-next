"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BarChart3, Download, Plus, Trash2, TrendingUp, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string;
};

type Budget = {
  category: string;
  limit: number;
};

const CATEGORIES = ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Healthcare", "Travel", "Education", "Groceries", "Subscriptions", "Other"];
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];
const EXPENSES_KEY = "aztools-expense-tracker-expenses";
const BUDGETS_KEY = "aztools-expense-tracker-budgets";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function monthNow() {
  return new Date().toISOString().slice(0, 7);
}

function loadArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveArray<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export default function Client() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadArray<Expense>(EXPENSES_KEY));
  const [budgets, setBudgets] = useState<Budget[]>(() => loadArray<Budget>(BUDGETS_KEY));
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);
  const [currency, setCurrency] = useState("USD");
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(monthNow);

  const filteredExpenses = useMemo(() => expenses.filter((expense) => expense.date.startsWith(selectedMonth)), [expenses, selectedMonth]);
  const total = useMemo(() => filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0), [filteredExpenses]);
  const categoryTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const expense of filteredExpenses) totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  }, [filteredExpenses]);

  function updateExpenses(next: Expense[]) {
    setExpenses(next);
    saveArray(EXPENSES_KEY, next);
  }

  function updateBudgets(next: Budget[]) {
    setBudgets(next);
    saveArray(BUDGETS_KEY, next);
  }

  function addExpense() {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    if (!category || !description.trim()) {
      toast.error("Category and description are required.");
      return;
    }

    updateExpenses([{ id: crypto.randomUUID(), amount: parsed, category, description: description.trim(), date, currency }, ...expenses]);
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(today());
    toast.success("Expense added.");
  }

  function addBudget() {
    const parsed = Number(budgetLimit);
    if (!budgetCategory || !Number.isFinite(parsed) || parsed <= 0) {
      toast.error("Select a category and valid limit.");
      return;
    }
    updateBudgets([...budgets.filter((budget) => budget.category !== budgetCategory), { category: budgetCategory, limit: parsed }]);
    setBudgetCategory("");
    setBudgetLimit("");
    toast.success("Budget saved.");
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ expenses, budgets, exportDate: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expense-tracker-${today()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function importData(file: File | undefined) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data.expenses)) updateExpenses(data.expenses);
        if (Array.isArray(data.budgets)) updateBudgets(data.budgets);
        toast.success("Expense data imported.");
      } catch {
        toast.error("Invalid import file.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <ToolLayout toolId="expense-tracker">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Add Expense</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Amount</Label><Input type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} /></div>
            <div className="space-y-2"><Label>Currency</Label><Select value={currency} onValueChange={setCurrency}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CURRENCIES.map((code) => <SelectItem key={code} value={code}>{code}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What was this expense for?" /></div>
            <Button className="md:col-span-2" onClick={addExpense}><Plus className="mr-2 h-4 w-4" />Add Expense</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Monthly Expenses</span>
                <Input type="month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className="w-44" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Total for {selectedMonth}</div>
                <div className="text-3xl font-bold">{currency} {total.toFixed(2)}</div>
              </div>
              <div className="space-y-2">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-xs text-muted-foreground">{expense.date} · {expense.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{expense.currency} {expense.amount.toFixed(2)}</Badge>
                      <Button size="icon" variant="ghost" onClick={() => updateExpenses(expenses.filter((item) => item.id !== expense.id))}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
                {filteredExpenses.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No expenses for this month.</p>}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Category Totals</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {categoryTotals.map(([name, value]) => <div key={name} className="flex justify-between text-sm"><span>{name}</span><span>{value.toFixed(2)}</span></div>)}
                {categoryTotals.length === 0 && <p className="text-sm text-muted-foreground">No category data yet.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Budgets</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Select value={budgetCategory} onValueChange={setBudgetCategory}><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger><SelectContent>{CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
                <Input type="number" min="0" value={budgetLimit} onChange={(event) => setBudgetLimit(event.target.value)} placeholder="Monthly limit" />
                <Button className="w-full" variant="outline" onClick={addBudget}>Save Budget</Button>
                {budgets.map((budget) => {
                  const spent = categoryTotals.find(([name]) => name === budget.category)?.[1] ?? 0;
                  const percent = Math.min(100, (spent / budget.limit) * 100);
                  return <div key={budget.category} className="space-y-1"><div className="flex justify-between text-sm"><span>{budget.category}</span><span>{spent.toFixed(2)} / {budget.limit.toFixed(2)}</span></div><Progress value={percent} /></div>;
                })}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex gap-2 pt-6">
                <Button variant="outline" onClick={exportData}><Download className="mr-2 h-4 w-4" />Export</Button>
                <Button variant="outline" asChild><Label className="cursor-pointer"><Upload className="mr-2 h-4 w-4" />Import<Input type="file" accept="application/json" className="hidden" onChange={(event) => importData(event.target.files?.[0])} /></Label></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
