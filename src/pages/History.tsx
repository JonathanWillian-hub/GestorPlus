import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, ChevronDown, ArrowDown, ArrowUp, Landmark, Filter, ShoppingCart, Briefcase, Car, Utensils, Zap, CreditCard, ChevronRight, Download, Calendar, Trash2 } from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function History() {
  const { transactions, getTotalIncome, getTotalExpense, getBalance, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof transactions> = {};
    
    filteredTransactions.forEach(t => {
      const date = parseISO(t.date);
      let dateKey = '';
      if (isToday(date)) {
        dateKey = `Hoje, ${format(date, "d 'de' MMM", { locale: ptBR })}`;
      } else if (isYesterday(date)) {
        dateKey = `Ontem, ${format(date, "d 'de' MMM", { locale: ptBR })}`;
      } else {
        dateKey = format(date, "EEEE, d 'de' MMM", { locale: ptBR });
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(t);
    });
    
    return groups;
  }, [filteredTransactions]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatTime = (dateStr: string) => {
    return format(parseISO(dateStr), 'HH:mm');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'alimentacao': case 'dining': return <Utensils className="w-6 h-6 text-tertiary" />;
      case 'compras': case 'groceries': return <ShoppingCart className="w-6 h-6 text-tertiary" />;
      case 'transporte': return <Car className="w-6 h-6 text-on-surface-variant" />;
      case 'salario': return <Briefcase className="w-6 h-6 text-secondary" />;
      default: return <ShoppingCart className="w-6 h-6 text-tertiary" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'alimentacao': case 'dining': return 'bg-tertiary-container/20';
      case 'compras': case 'groceries': return 'bg-tertiary-container/20';
      case 'transporte': return 'bg-surface-container-highest border border-outline-variant/30';
      case 'salario': return 'bg-secondary-container/20';
      default: return 'bg-tertiary-container/20';
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-6 md:py-10 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-semibold text-on-surface tracking-tight mb-1">Histórico de Transações</h2>
          <p className="text-base text-on-surface-variant">Revise e gerencie suas atividades financeiras passadas.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors bg-surface-container shadow-sm">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Controls: Search & Filters */}
      <div className="bg-surface-container rounded-xl p-4 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row gap-4 border border-outline-variant/20">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
          <input
            type="text"
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-on-surface placeholder:text-outline-variant"
          />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface hover:border-primary transition-colors bg-background">
            <Calendar className="w-4 h-4 text-on-surface-variant" />
            Hoje
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface hover:border-primary transition-colors bg-background">
            <Filter className="w-4 h-4 text-on-surface-variant" />
            Todas as Categorias
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-surface-container rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-outline-variant/20">
          <div className="flex items-center gap-2 text-on-surface-variant mb-2">
            <ArrowDown className="w-5 h-5 text-error" />
            <span className="text-xs font-semibold tracking-wide">Total de Despesas</span>
          </div>
          <div className="text-[32px] font-semibold text-on-surface">{formatCurrency(getTotalExpense())}</div>
        </div>
        <div className="bg-surface-container rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-outline-variant/20">
          <div className="flex items-center gap-2 text-on-surface-variant mb-2">
            <ArrowUp className="w-5 h-5 text-secondary" />
            <span className="text-xs font-semibold tracking-wide">Total de Receitas</span>
          </div>
          <div className="text-[32px] font-semibold text-on-surface">{formatCurrency(getTotalIncome())}</div>
        </div>
        <div className="bg-surface-container rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-outline-variant/20">
          <div className="flex items-center gap-2 text-on-surface-variant mb-2">
            <Landmark className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold tracking-wide">Fluxo Líquido</span>
          </div>
          <div className="text-[32px] font-semibold text-on-surface">+{formatCurrency(getBalance())}</div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-surface-container rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden border border-outline-variant/20">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-high/50">
          <h3 className="text-2xl font-semibold text-on-surface">Transações Recentes</h3>
          <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            Filtrar
            <Filter className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex flex-col">
          {Object.entries(groupedTransactions).map(([dateLabel, transactionsArray], groupIndex) => {
            const dayTransactions = transactionsArray as typeof transactions;
            return (
            <React.Fragment key={dateLabel}>
              {/* Date Header */}
              <div className={`px-6 py-3 bg-surface text-on-surface-variant text-[12px] font-semibold uppercase tracking-wider ${groupIndex > 0 ? 'border-t border-outline-variant/10' : ''}`}>
                {dateLabel.toUpperCase()}
              </div>
              
              {/* Items */}
              {dayTransactions.map((tx) => (
                <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-highest transition-colors border-b border-outline-variant/10 group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${getCategoryColor(tx.category)} flex items-center justify-center shrink-0`}>
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{tx.description}</div>
                      <div className="text-sm text-on-surface-variant flex items-center gap-2 mt-0.5 capitalize">
                        <span>{tx.category}</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant" />
                        <span>{formatTime(tx.date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex">
                      {tx.paymentMethod === 'credito' || tx.paymentMethod === 'credit' ? (
                        <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-tertiary-container/20 text-tertiary flex items-center gap-1 border border-tertiary/20">
                          <CreditCard className="w-3.5 h-3.5" /> Crédito
                        </span>
                      ) : tx.paymentMethod === 'pix' ? (
                        <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-primary-container/20 text-primary flex items-center gap-1 border border-primary/20">
                          <Zap className="w-3.5 h-3.5 fill-current" /> Pix
                        </span>
                      ) : tx.paymentMethod === 'debito' || tx.paymentMethod === 'debit' ? (
                        <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-surface-container-highest text-on-surface-variant flex items-center gap-1 border border-outline-variant/30">
                          <Landmark className="w-3.5 h-3.5" /> Débito
                        </span>
                      ) : null}
                    </div>
                    
                    <div className={`text-sm font-semibold text-right min-w-[80px] ${tx.type === 'income' ? 'text-secondary' : 'text-on-surface'}`}>
                      {tx.type === 'income' ? '+ ' : '- '}{formatCurrency(tx.amount)}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTransaction(tx.id);
                      }}
                      title="Excluir lançamento"
                      className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all flex items-center justify-center shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </React.Fragment>
            );
          })}
        </div>
        
        <div className="px-6 py-4 border-t border-outline-variant/30 flex justify-center bg-surface-container-high/30">
          <button className="text-primary text-sm font-semibold hover:underline">Carregar Mais Transações</button>
        </div>
      </div>
    </div>
  );
}
