import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, CheckCircle2, CreditCard, QrCode, Landmark } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Category, PaymentMethod } from '../types';

export default function AddExpense() {
  const navigate = useNavigate();
  const { addTransaction, creditCards } = useFinance();
  
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [creditCardId, setCreditCardId] = useState('');

  useEffect(() => {
    // Set today as default
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !value || !category || !date || !paymentMethod) return;
    if (paymentMethod === 'credito' && !creditCardId && creditCards.length > 0) return;

    addTransaction({
      description,
      amount: parseFloat(value),
      type: 'expense',
      category,
      paymentMethod,
      date: new Date(date).toISOString(),
      creditCardId: paymentMethod === 'credito' ? creditCardId : undefined
    });
    
    navigate('/');
  };

  return (
    <div className="flex-1 p-8 md:p-10 w-full max-w-[1280px] mx-auto flex justify-center items-start pt-12 md:pt-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[28px] md:text-[32px] font-semibold text-on-surface tracking-tight">Registrar uma Despesa</h1>
          <p className="text-base text-on-surface-variant mt-2">Registre uma nova saída para manter seu orçamento equilibrado.</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-6 md:p-8 border border-outline-variant/20">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Value Input (Prominent) */}
            <div className="flex flex-col items-center justify-center py-6 border-b border-outline-variant/30">
              <label htmlFor="value" className="text-[12px] font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Valor</label>
              <div className="flex items-baseline gap-2 text-on-surface">
                <span className="text-2xl font-semibold text-outline">R$</span>
                <input
                  id="value"
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="bg-transparent border-none p-0 m-0 text-[48px] font-bold text-center w-full max-w-[250px] focus:ring-0 placeholder:text-outline-variant text-error outline-none custom-hide-spinner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div className="flex flex-col gap-1 w-full md:col-span-2">
                <label htmlFor="description" className="text-sm font-semibold text-on-surface">Descrição</label>
                <input
                  id="description"
                  type="text"
                  required
                  placeholder="Para que foi essa despesa?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="category" className="text-sm font-semibold text-on-surface">Categoria</label>
                <div className="relative">
                  <select
                    id="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 pr-10 text-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Selecionar Categoria</option>
                    <option value="alimentacao">Alimentação</option>
                    <option value="transporte">Transporte</option>
                    <option value="lazer">Lazer</option>
                    <option value="mercado">Mercado</option>
                    <option value="compras">Compras</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="date" className="text-sm font-semibold text-on-surface">Data</label>
                <input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Payment Method Visual Selector */}
            <div className="flex flex-col gap-1 w-full mt-2">
              <label className="text-sm font-semibold text-on-surface mb-2">Método de Pagamento</label>
              <div className="grid grid-cols-3 gap-4">
                
                {/* Débito */}
                <label className="relative cursor-pointer group">
                  <input type="radio" name="payment_method" value="debito" required className="peer sr-only" onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} />
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant bg-surface transition-all duration-200 group-hover:bg-surface-container-high h-full gap-2 peer-checked:border-primary peer-checked:bg-surface-container peer-checked:ring-2 peer-checked:ring-primary/50">
                    <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-on-surface">
                      <Landmark className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-sm font-semibold text-on-surface mt-1">Débito</span>
                  </div>
                </label>

                {/* Crédito */}
                <label className="relative cursor-pointer group">
                  <input type="radio" name="payment_method" value="credito" className="peer sr-only" onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} />
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant bg-surface transition-all duration-200 group-hover:bg-surface-container-high h-full gap-2 peer-checked:border-primary peer-checked:bg-surface-container peer-checked:ring-2 peer-checked:ring-primary/50">
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                       <CreditCard className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-sm font-semibold text-on-surface mt-1">Crédito</span>
                  </div>
                </label>

                {/* Pix */}
                <label className="relative cursor-pointer group">
                  <input type="radio" name="payment_method" value="pix" className="peer sr-only" onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} />
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant bg-surface transition-all duration-200 group-hover:bg-surface-container-high h-full gap-2 peer-checked:border-primary peer-checked:bg-surface-container peer-checked:ring-2 peer-checked:ring-primary/50">
                    <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary">
                      <QrCode className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-sm font-semibold text-on-surface mt-1">Pix</span>
                  </div>
                </label>
                
              </div>
            </div>

            {/* Conditional Credit Card Dropdown */}
            {paymentMethod === 'credito' && creditCards.length > 0 && (
              <div className="flex flex-col gap-1 w-full animate-fade-in">
                <label htmlFor="creditCardId" className="text-sm font-semibold text-on-surface">Vincular ao Cartão de Crédito</label>
                <div className="relative">
                  <select
                    id="creditCardId"
                    required
                    value={creditCardId}
                    onChange={(e) => setCreditCardId(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 pr-10 text-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Selecionar Cartão de Crédito</option>
                    {creditCards.map(card => (
                      <option key={card.id} value={card.id}>
                        {card.name} (Lim. Disp: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.limitAvailable)})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 fill-current text-primary-container bg-on-primary rounded-full border border-on-primary" />
                Salvar Despesa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
