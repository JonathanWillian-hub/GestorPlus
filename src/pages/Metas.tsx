import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Target, Calendar, Plus, Trash2, ArrowUpRight, CheckCircle, Percent } from 'lucide-react';
import { Goal } from '../types';

export default function Metas() {
  const { goals, addGoal, updateGoalAmount, deleteGoal } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  
  const [showSaveModal, setShowSaveModal] = useState<string | null>(null);
  const [saveValue, setSaveValue] = useState('');

  const calculateMonthsRemaining = (deadline: string) => {
    const today = new Date();
    const end = new Date(deadline);
    const yearDiff = end.getFullYear() - today.getFullYear();
    const monthDiff = end.getMonth() - today.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff;
    return Math.max(1, totalMonths);
  };

  const calculateMonthlySavings = (goal: Goal) => {
    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
    if (remainingAmount <= 0) return 0;
    const months = calculateMonthsRemaining(goal.deadlineDate);
    return remainingAmount / months;
  };

  const calculateProgress = (goal: Goal) => {
    if (goal.targetAmount <= 0) return 0;
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    return Math.min(100, Math.round(percentage));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadlineDate) return;

    addGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      deadlineDate
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadlineDate('');
    setShowAddForm(false);
  };

  const handleSaveAmount = (e: React.FormEvent, goalId: string, current: number) => {
    e.preventDefault();
    if (!saveValue) return;
    const newVal = current + parseFloat(saveValue);
    updateGoalAmount(goalId, newVal);
    setSaveValue('');
    setShowSaveModal(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1280px] mx-auto w-full">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-[32px] font-semibold text-on-surface leading-tight tracking-tight">Metas de Economia</h2>
          <p className="text-base text-on-surface-variant mt-1">Planeje e acompanhe seus objetivos financeiros de médio e longo prazo.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm rounded-lg px-4 py-2.5 flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Nova Meta
        </button>
      </header>



      {showAddForm && (
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 mb-8 max-w-2xl shadow-xl">
          <h3 className="text-xl font-semibold text-on-surface mb-4">Adicionar Novo Objetivo Financeiro</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-on-surface">Nome do Objetivo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Viagem de Férias, Reserva de Emergência"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">Valor Objetivo (Alvo)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="R$ 10.000,00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">Valor Já Poupado (Opcional)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="R$ 1.500,00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-on-surface">Data Limite / Prazo</label>
                <input
                  type="date"
                  required
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-2">
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
                Salvar Objetivo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          const monthlyRequired = calculateMonthlySavings(goal);
          const monthsLeft = calculateMonthsRemaining(goal.deadlineDate);
          const isCompleted = progress >= 100;

          return (
            <div 
              key={goal.id} 
              className={`bg-surface-container-low border ${isCompleted ? 'border-secondary/40 shadow-[0_0_15px_rgba(72,224,137,0.15)]' : 'border-outline-variant/30'} rounded-2xl p-6 shadow-lg flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-on-surface">{goal.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Prazo: {new Date(goal.deadlineDate).toLocaleDateString('pt-BR')} • {monthsLeft} {monthsLeft === 1 ? 'mês restante' : 'meses restantes'}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-surface-container-high transition-colors"
                    title="Excluir meta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar & Percentages */}
                <div className="mb-6 mt-4">
                  <div className="flex justify-between items-end text-sm mb-2">
                    <span className="font-semibold text-on-surface">{formatCurrency(goal.currentAmount)} <span className="text-xs text-on-surface-variant">de {formatCurrency(goal.targetAmount)}</span></span>
                    <span className={`font-bold ${isCompleted ? 'text-secondary' : 'text-primary'}`}>{progress}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-3.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${isCompleted ? 'bg-secondary shadow-[0_0_8px_rgba(72,224,137,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(105,254,163,0.5)]'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Monthly Required Card Section */}
              <div className="mt-4 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-semibold tracking-wider">Aporte mensal necessário</p>
                  <p className="text-xl font-extrabold text-on-surface mt-1">
                    {isCompleted ? (
                      <span className="text-secondary flex items-center gap-1.5 text-base">
                        <CheckCircle className="w-5 h-5 fill-current text-surface bg-secondary rounded-full" /> Meta Concluída!
                      </span>
                    ) : (
                      formatCurrency(monthlyRequired)
                    )}
                  </p>
                </div>
                {!isCompleted && (
                  <button
                    onClick={() => {
                      setShowSaveModal(goal.id);
                      setSaveValue('');
                    }}
                    className="px-3.5 py-1.5 bg-surface-container-high hover:bg-primary hover:text-on-primary border border-outline-variant/30 text-on-surface text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" /> Poupar
                  </button>
                )}
              </div>

              {/* Small modal to add savings in-place */}
              {showSaveModal === goal.id && (
                <div className="mt-4 p-4 rounded-xl bg-surface-container border border-primary/20">
                  <form onSubmit={(e) => handleSaveAmount(e, goal.id, goal.currentAmount)} className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Adicionar Valor Poupado</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        placeholder="R$ 500,00"
                        value={saveValue}
                        onChange={(e) => setSaveValue(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded px-2.5 py-1 text-sm text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex gap-1.5 self-end">
                      <button 
                        type="button" 
                        onClick={() => setShowSaveModal(null)}
                        className="px-2.5 py-1 text-xs text-on-surface-variant hover:bg-surface-container-high rounded"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="px-3 py-1 bg-primary text-on-primary font-semibold text-xs rounded hover:bg-primary/90"
                      >
                        Confirmar
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
