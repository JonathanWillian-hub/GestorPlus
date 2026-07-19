import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Category } from '../types';

export default function AddIncome() {
  const navigate = useNavigate();
  const { addTransaction } = useFinance();
  
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState<Category | ''>('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !value || !type || !date) return;

    addTransaction({
      description,
      amount: parseFloat(value),
      type: 'income',
      category: type,
      date: new Date(date).toISOString(),
    });
    
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col items-center p-6 md:p-10 w-full max-w-7xl mx-auto overflow-y-auto min-h-screen">
      <header className="w-full flex justify-between items-center mb-8 max-w-3xl">
        <h2 className="text-[28px] md:text-[32px] font-semibold text-on-surface tracking-tight">Adicionar Receita</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <section className="w-full max-w-3xl bg-surface-container rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-6 md:p-10 relative overflow-hidden border border-outline-variant/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-semibold tracking-wide text-on-surface-variant">Descrição</label>
            <input
              id="description"
              type="text"
              required
              placeholder="ex: Salário Outubro"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface text-on-surface placeholder:text-on-surface-variant/50 px-4 py-3 transition-all outline-none text-base"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="value" className="text-sm font-semibold tracking-wide text-on-surface-variant">Valor (R$)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">R$</span>
              <input
                id="value"
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface text-on-surface text-2xl font-semibold pl-12 pr-4 py-3 transition-all outline-none leading-none custom-hide-spinner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="type" className="text-sm font-semibold tracking-wide text-on-surface-variant">Tipo</label>
              <div className="relative">
                <select
                  id="type"
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value as Category)}
                  className="w-full rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface text-on-surface px-4 py-3 appearance-none transition-all outline-none text-base cursor-pointer"
                >
                  <option value="" disabled>Selecione o tipo de receita</option>
                  <option value="salario">Salário</option>
                  <option value="investimento">Investimento</option>
                  <option value="outros">Outros</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="date" className="text-sm font-semibold tracking-wide text-on-surface-variant">Data de Recebimento</label>
              <input
                id="date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface text-on-surface px-4 py-3 transition-all outline-none text-base cursor-pointer"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse md:flex-row justify-end gap-4 mt-6 pt-6 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg text-sm font-semibold bg-primary text-on-primary shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 fill-current text-primary-container bg-on-primary rounded-full border border-on-primary" />
              Salvar Receita
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
