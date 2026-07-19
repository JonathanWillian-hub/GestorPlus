import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Calendar, AlertCircle, Plus, Trash2, CheckCircle2, Circle, Clock, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import { Bill } from '../types';

export default function Contas() {
  const { bills, addBill, toggleBillStatus, deleteBill } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [isRecurring, setIsRecurring] = useState(true);

  // Business Logic: Identify bills due in the next 5 days that are still pending
  const urgentBills = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDate();
    
    return bills.filter(bill => {
      if (bill.status === 'paid') return false;
      
      // Calculate day difference
      // Simple logic: if bill.dueDate is between currentDay and currentDay + 5
      // Handling month wrap-around roughly
      let diff = bill.dueDate - currentDay;
      if (diff < 0) {
        // Assume it is due next month
        diff += 30; // rough month approximation for visual alert
      }
      return diff >= 0 && diff <= 5;
    });
  }, [bills]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !dueDate) return;

    addBill({
      description,
      amount: parseFloat(amount),
      dueDate: parseInt(dueDate),
      status: 'pending',
      type,
      isRecurring
    });

    setDescription('');
    setAmount('');
    setDueDate('');
    setType('expense');
    setIsRecurring(true);
    setShowAddForm(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1280px] mx-auto w-full">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-[32px] font-semibold text-on-surface leading-tight tracking-tight">Agenda de Contas</h2>
          <p className="text-base text-on-surface-variant mt-1">Gerencie suas contas fixas e agendamentos recorrentes.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm rounded-lg px-4 py-2.5 flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Agendar Conta
        </button>
      </header>



      {/* Urgent Warning Banner */}
      {urgentBills.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-error-container/30 border border-error/30 flex items-start gap-3 shadow-md animate-pulse">
          <AlertCircle className="text-error w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-error">Alertas Urgentes de Vencimento (Próximos 5 Dias)</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              Você possui <strong>{urgentBills.length}</strong> conta(s) pendente(s) que vencem nos próximos 5 dias. Efetue o pagamento para evitar multas.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {urgentBills.map(bill => (
                <div key={bill.id} className="bg-surface/50 border border-error/20 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                  <span className="font-semibold text-on-surface">{bill.description}</span>
                  <span className="text-on-surface-variant">• Dia {bill.dueDate} •</span>
                  <span className="font-semibold text-error">{formatCurrency(bill.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 mb-8 max-w-2xl shadow-xl animate-fade-in">
          <h3 className="text-xl font-semibold text-on-surface mb-4">Novo Agendamento / Conta Fixa</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-on-surface">Descrição</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aluguel, Assinatura de Streaming, Conta de Água"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="R$ 150,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">Dia do Vencimento (1 a 31)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  placeholder="Ex: 10"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">Tipo de Conta</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                >
                  <option value="expense">Despesa (Contas a Pagar)</option>
                  <option value="income">Receita (Agendamento de Entrada)</option>
                </select>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input
                  id="is_recurring"
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-5 h-5 rounded bg-surface border-outline-variant text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <label htmlFor="is_recurring" className="text-sm font-medium text-on-surface cursor-pointer select-none">Recorrência Mensal Fixa</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Confirmar Agendamento
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bills Layout Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scheduled List */}
        <div className="lg:col-span-2 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-xl font-semibold text-on-surface mb-6 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Relação de Contas Fixas
          </h3>

          <div className="flex flex-col gap-3">
            {bills.map((bill) => {
              const isPaid = bill.status === 'paid';
              const isIncome = bill.type === 'income';

              return (
                <div 
                  key={bill.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isPaid 
                      ? 'bg-surface/40 border-outline-variant/20 opacity-60' 
                      : 'bg-surface hover:bg-surface-container-high border-outline-variant/30 hover:border-primary/30 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleBillStatus(bill.id)}
                      className={`transition-colors p-1 rounded-full ${isPaid ? 'text-secondary' : 'text-on-surface-variant hover:text-primary'}`}
                      title={isPaid ? "Marcar como pendente" : "Marcar como pago (registrará transação!)"}
                    >
                      {isPaid ? (
                        <CheckCircle2 className="w-6 h-6 fill-current text-surface bg-secondary rounded-full" />
                      ) : (
                        <Circle className="w-6 h-6 text-outline" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-sm font-bold text-on-surface ${isPaid ? 'line-through text-on-surface-variant' : ''}`}>{bill.description}</h4>
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Vence todo dia {bill.dueDate}</span>
                        {bill.isRecurring && (
                          <span className="bg-primary/10 text-primary border border-primary/20 rounded px-1 text-[10px] uppercase font-bold">Recorrente</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className={`text-base font-semibold block ${isIncome ? 'text-secondary' : 'text-on-surface'}`}>
                        {isIncome ? '+ ' : '- '}{formatCurrency(bill.amount)}
                      </span>
                      <span className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 inline-block mt-1 ${isPaid ? 'bg-secondary/10 text-secondary' : 'bg-amber-500/10 text-amber-500'}`}>
                        {isPaid ? 'PAGO' : 'PENDENTE'}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteBill(bill.id)}
                      className="text-on-surface-variant hover:text-error p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                      title="Excluir agendamento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-lg h-fit">
          <h3 className="text-xl font-semibold text-on-surface mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Resumo do Mês
          </h3>

          <div className="flex flex-col gap-4">
            <div className="bg-surface/50 border border-outline-variant/30 p-4 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant uppercase font-semibold">Total a Pagar</span>
                <span className="text-lg font-bold text-on-surface block mt-1">
                  {formatCurrency(bills.filter(b => b.type === 'expense').reduce((a, c) => a + c.amount, 0))}
                </span>
              </div>
              <TrendingDown className="w-8 h-8 text-error bg-error/10 p-1.5 rounded-xl border border-error/10" />
            </div>

            <div className="bg-surface/50 border border-outline-variant/30 p-4 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant uppercase font-semibold">Previsão de Entrada</span>
                <span className="text-lg font-bold text-on-surface block mt-1">
                  {formatCurrency(bills.filter(b => b.type === 'income').reduce((a, c) => a + c.amount, 0))}
                </span>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary bg-secondary/10 p-1.5 rounded-xl border border-secondary/10" />
            </div>

            <div className="border-t border-outline-variant/20 pt-4 mt-2">
              <span className="text-xs text-on-surface-variant block font-semibold mb-2">Comprometimento das Contas Pendentes</span>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-primary h-full rounded-full"
                  style={{ 
                    width: `${Math.round(
                      (bills.filter(b => b.status === 'paid').length / Math.max(1, bills.length)) * 100
                    )}%` 
                  }}
                />
              </div>
              <span className="text-xs text-on-surface-variant">
                {bills.filter(b => b.status === 'paid').length} de {bills.length} contas marcadas como quitadas.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
