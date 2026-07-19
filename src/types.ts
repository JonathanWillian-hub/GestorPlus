export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'pix' | 'credito' | 'debito' | 'credit' | 'debit';
export type Category = 
  | 'alimentacao' 
  | 'transporte' 
  | 'lazer' 
  | 'mercado' 
  | 'compras' 
  | 'salario' 
  | 'investimento' 
  | 'outros'
  | 'groceries'
  | 'dining';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO string
  paymentMethod?: PaymentMethod;
  creditCardId?: string; // Linked card if paymentMethod === 'credito'
}

export interface User {
  id?: string;
  name: string;
  email: string;
  plan: string;
  avatarUrl: string;
  emailVerified?: boolean;
  role?: 'admin' | 'user';
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadlineDate: string; // YYYY-MM-DD
}

export interface Bill {
  id: string;
  description: string;
  amount: number;
  dueDate: number; // Day of the month (1-31)
  status: 'paid' | 'pending';
  type: TransactionType;
  isRecurring: boolean;
}

export interface CreditCard {
  id: string;
  name: string;
  limitTotal: number;
  limitAvailable: number;
  closingDay: number; // Day of month (e.g. 10)
  dueDay: number; // Day of month (e.g. 17)
  currentInvoiceAmount: number;
}

export interface MonthlyHistory {
  month: string; // YYYY-MM
  balance: number; // Acumulado final
}
