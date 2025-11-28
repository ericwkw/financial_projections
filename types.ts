export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  subscribers: number;
}

export interface Employee {
  id: string;
  role: string;
  salary: number; // Annual salary
  count: number;
}

export interface Financials {
  mrr: number;
  arr: number;
  monthlyExpenses: number;
  annualExpenses: number;
  netMonthly: number;
  profitMargin: number;
}

export interface SimulationState {
  plans: Plan[];
  employees: Employee[];
}

export type Currency = 'USD' | 'EUR' | 'GBP';