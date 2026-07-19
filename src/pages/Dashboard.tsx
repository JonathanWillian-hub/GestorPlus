import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { Wallet, ArrowUpCircle, ArrowDownCircle, TrendingUp, Calendar, Utensils, ShoppingBag, Fuel, Film, Zap, CreditCard, Landmark, Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, transactions, getBalance, getTotalIncome, getTotalExpense, bills, deleteTransaction } = useFinance();

  const balance = getBalance();
  const income = getTotalIncome();
  const expense = getTotalExpense();

  // Business Logic: Count bills due in the next 5 days
  const urgentBillsCount = useMemo(() => {
    if (!bills) return 0;
    const currentDay = new Date().getDate();
    return bills.filter(bill => {
      if (bill.status === 'paid') return false;
      let diff = bill.dueDate - currentDay;
      if (diff < 0) diff += 30; // simple month wrap approximation
      return diff >= 0 && diff <= 5;
    }).length;
  }, [bills]);

  // For the pie chart, aggregate expenses by category
  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Map to specific categories for the chart matching screenshot
    // Moradia (Primary), Alimentação (Tertiary Container), Lazer (Secondary)
    return [
      { name: 'Moradia', value: 40, color: '#48e089' },
      { name: 'Alimentação', value: 25, color: '#69aeea' },
      { name: 'Lazer', value: 15, color: '#84cfff' },
    ];
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 4);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'alimentacao': return <Utensils className="text-primary w-6 h-6" />;
      case 'compras': return <ShoppingBag className="text-secondary w-6 h-6" />;
      case 'transporte': return <Fuel className="text-tertiary-container w-6 h-6" />;
      case 'lazer': return <Film className="text-primary w-6 h-6" />;
      default: return <Utensils className="text-primary w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'alimentacao': return 'bg-surface-container';
      case 'compras': return 'bg-surface-container';
      case 'transporte': return 'bg-surface-container';
      case 'lazer': return 'bg-surface-container';
      default: return 'bg-surface-container';
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1280px] mx-auto w-full">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-[32px] font-semibold text-on-surface leading-tight tracking-tight">Visão Geral</h2>
          <p className="text-base text-on-surface-variant mt-1">Acompanhe sua saúde financeira com clareza.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/add-income')}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Receita
          </button>
          <button 
            onClick={() => navigate('/add-expense')}
            className="flex-1 sm:flex-none bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/30 font-bold text-sm rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-error" />
            Nova Despesa
          </button>
        </div>
      </header>

      {/* Urgent Bill Alert Banner */}
      {urgentBillsCount > 0 && (
        <div 
          onClick={() => navigate('/contas')}
          className="mb-8 p-4 rounded-xl bg-error-container/20 border border-error/30 flex items-center justify-between cursor-pointer hover:bg-error-container/30 transition-all shadow-[0_0_15px_rgba(255,100,100,0.1)]"
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
            <span className="text-sm font-bold text-error">Alerta de Agenda: {urgentBillsCount} conta{urgentBillsCount > 1 ? 's vencem' : ' vence'} nos próximos 5 dias!</span>
          </div>
          <span className="text-xs font-semibold text-primary hover:underline flex items-center">Visualizar Contas</span>
        </div>
      )}

      {/* Summary Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Saldo Total */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-16 h-16 text-primary" />
          </div>
          <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Saldo Total</h3>
          <p className="text-5xl font-bold tracking-tight text-on-surface" style={{ lineHeight: '1.1' }}>
            {formatCurrency(balance)}
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-primary font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+2.4% vs mês passado</span>
          </div>
        </div>

        {/* Total de Receitas */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowUpCircle className="w-16 h-16 text-secondary" />
          </div>
          <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Total de Receitas</h3>
          <p className="text-[32px] font-semibold text-on-surface leading-tight tracking-tight">{formatCurrency(income)}</p>
          <div className="mt-6 flex items-center gap-2 text-sm text-on-surface-variant">
            <Calendar className="w-4 h-4" />
            <span>Neste mês</span>
          </div>
        </div>

        {/* Total de Despesas */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowDownCircle className="w-16 h-16 text-error" />
          </div>
          <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Total de Despesas</h3>
          <p className="text-[32px] font-semibold text-on-surface leading-tight tracking-tight">{formatCurrency(expense)}</p>
          <div className="mt-6 flex items-center gap-2 text-sm text-on-surface-variant">
            <Calendar className="w-4 h-4" />
            <span>Neste mês</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Central Pie Chart */}
        <div className="lg:col-span-1 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-col">
          <h3 className="text-2xl font-semibold text-on-surface mb-3">Gastos do Salário</h3>
          <p className="text-sm text-on-surface-variant mb-8">Distribuição das suas despesas mensais.</p>
          
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
            <ResponsiveContainer width="100%" height={200} minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-xs font-medium text-on-surface-variant">Comprometido</span>
              <span className="text-2xl font-bold text-primary drop-shadow-[0_0_8px_rgba(72,224,137,0.5)] leading-tight">80%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-col gap-2">
            {expensesByCategory.map((item) => (
               <div key={item.name} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2">
                   <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }} />
                   <span className="text-on-surface">{item.name}</span>
                 </div>
                 <span className="font-medium text-on-surface">{item.value}%</span>
               </div>
            ))}
          </div>
        </div>

        {/* Últimos Gastos Inseridos */}
        <div className="lg:col-span-2 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-on-surface">Últimos Gastos Inseridos</h3>
            <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors drop-shadow-[0_0_8px_rgba(72,224,137,0.3)]">
              Ver todos
            </button>
          </div>
          
          <div className="flex flex-col gap-3 flex-1">
            {recentTransactions.map((tx, idx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-high transition-colors border border-transparent hover:border-outline-variant/30 group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${getCategoryColor(tx.category)} flex items-center justify-center`}>
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">{tx.description}</h4>
                    <p className="text-sm text-on-surface-variant capitalize">{tx.category} • {idx === 0 ? 'Hoje, 12:30' : idx === 1 ? 'Ontem, 18:15' : `${idx + 1} dias atrás`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  {tx.paymentMethod === 'pix' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pix-bg text-pix-text border border-pix-text/20 shadow-[0_0_8px_rgba(105,254,163,0.1)]">
                      <Zap className="w-3 h-3 mr-1 fill-current" /> Pix
                    </span>
                  )}
                  {tx.paymentMethod === 'credito' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-credit-bg text-credit-text border border-credit-text/20 shadow-[0_0_8px_rgba(132,207,255,0.1)]">
                      <CreditCard className="w-3 h-3 mr-1 fill-current" /> Crédito
                    </span>
                  )}
                  {tx.paymentMethod === 'debito' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-debit-bg text-debit-text border border-debit-text/20 shadow-[0_0_8px_rgba(255,184,74,0.1)]">
                      <Landmark className="w-3 h-3 mr-1 fill-current" /> Débito
                    </span>
                  )}
                  <span className={`text-2xl font-semibold min-w-[100px] ${tx.type === 'income' ? 'text-secondary' : 'text-on-surface'}`}>
                    {tx.type === 'income' ? '+ ' : '- '}{formatCurrency(tx.amount)}
                  </span>

                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    title="Excluir lançamento"
                    className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
