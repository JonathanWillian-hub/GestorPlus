import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CreditCard as CardIcon, Plus, Trash2, Calendar, Landmark, CheckCircle, ChevronRight, Activity } from 'lucide-react';

export default function Cartoes() {
  const { creditCards, transactions, addCreditCard, payCardInvoice, deleteCreditCard } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [limitTotal, setLimitTotal] = useState('');
  const [closingDay, setClosingDay] = useState('');
  const [dueDay, setDueDay] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !limitTotal || !closingDay || !dueDay) return;

    addCreditCard({
      name,
      limitTotal: parseFloat(limitTotal),
      closingDay: parseInt(closingDay),
      dueDay: parseInt(dueDay)
    });

    setName('');
    setLimitTotal('');
    setClosingDay('');
    setDueDay('');
    setShowAddForm(false);
  };

  const getCardTransactions = (cardId: string) => {
    return transactions.filter(t => t.paymentMethod === 'credito' && t.creditCardId === cardId);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1280px] mx-auto w-full">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-[32px] font-semibold text-on-surface leading-tight tracking-tight">Cartões de Crédito</h2>
          <p className="text-base text-on-surface-variant mt-1">Monitore faturas, vencimentos e limite disponível de seus cartões isolados do saldo em conta corrente.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm rounded-lg px-4 py-2.5 flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Adicionar Cartão
        </button>
      </header>



      {showAddForm && (
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 mb-8 max-w-2xl shadow-xl animate-fade-in">
          <h3 className="text-xl font-semibold text-on-surface mb-4">Cadastrar Novo Cartão</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-on-surface">Nome da Instituição / Cartão</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Nubank Mastercard, Visa XP, Inter Black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">Limite Total de Crédito</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="R$ 5.000,00"
                  value={limitTotal}
                  onChange={(e) => setLimitTotal(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">Dia de Fechamento da Fatura</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  placeholder="Ex: 5"
                  value={closingDay}
                  onChange={(e) => setClosingDay(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-on-surface">Dia do Vencimento da Fatura</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  placeholder="Ex: 12"
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
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
                Cadastrar Cartão
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Credit Cards View Area */}
      <div className="flex flex-col gap-10">
        {creditCards.map((card) => {
          const cardTxList = getCardTransactions(card.id);
          const limitPercentage = (card.limitAvailable / card.limitTotal) * 100;

          return (
            <div key={card.id} className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1: Credit Card Mockup */}
              <div className="flex flex-col justify-between">
                <div className="relative w-full h-[180px] rounded-2xl p-5 overflow-hidden text-white flex flex-col justify-between shadow-2xl border border-white/10"
                     style={{
                       background: 'linear-gradient(135deg, #1b2e25 0%, #111b15 100%)',
                       boxShadow: '0 8px 32px rgba(72, 224, 137, 0.15)'
                     }}
                >
                  {/* Glowing light effect inside card */}
                  <div className="absolute top-[-50%] right-[-30%] w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold tracking-widest text-primary uppercase">GESTORPLUS</span>
                      <span className="text-sm font-semibold tracking-wide text-white/80 mt-1">{card.name}</span>
                    </div>
                    <CardIcon className="w-8 h-8 text-primary opacity-80" />
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-white/50 uppercase tracking-widest">Limite Disponível</span>
                      <span className="text-xl font-bold tracking-tight text-white">{formatCurrency(card.limitAvailable)}</span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-[9px] text-white/50 uppercase tracking-widest">Fatura Atual</span>
                      <span className="text-base font-semibold text-primary">{formatCurrency(card.currentInvoiceAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => deleteCreditCard(card.id)}
                    className="text-xs text-on-surface-variant hover:text-error flex items-center gap-1 hover:bg-surface-container/50 px-2 py-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Excluir Cartão
                  </button>
                  <div className="flex gap-4 text-xs text-on-surface-variant font-medium">
                    <span>Fechamento: Dia {card.closingDay}</span>
                    <span>Vencimento: Dia {card.dueDay}</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Limit Bar & Quick Settlements */}
              <div className="border-l border-r border-outline-variant/20 px-0 lg:px-6 flex flex-col justify-between py-2">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Utilização do Limite</h4>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs text-on-surface-variant font-semibold">Disponível: {formatCurrency(card.limitAvailable)}</span>
                    <span className="text-xs text-on-surface-variant font-semibold">Total: {formatCurrency(card.limitTotal)}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-3.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(72,224,137,0.4)] transition-all duration-500" 
                      style={{ width: `${limitPercentage}%` }} 
                    />
                  </div>
                  <span className="text-[11px] text-on-surface-variant mt-2 block">
                    Você utilizou <strong>{(100 - limitPercentage).toFixed(1)}%</strong> do limite disponível deste cartão.
                  </span>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Liquidação de Conta</h4>
                  <div className="p-4 rounded-xl bg-surface/50 border border-outline-variant/30 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-on-surface-variant block font-medium">Fatura Atual em Aberto</span>
                      <span className="text-xl font-black text-on-surface mt-1 block">{formatCurrency(card.currentInvoiceAmount)}</span>
                    </div>
                    {card.currentInvoiceAmount > 0 ? (
                      <button
                        onClick={() => payCardInvoice(card.id)}
                        className="bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" /> Pagar Fatura
                      </button>
                    ) : (
                      <span className="text-xs text-secondary font-bold uppercase bg-secondary/10 px-2 py-1 rounded-md">Quitado</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Column 3: Card Specific Recent Transactions */}
              <div className="flex flex-col justify-between py-2">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-primary" /> Lançamentos no Cartão
                  </h4>

                  {cardTxList.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-outline-variant/30 rounded-xl bg-surface/30">
                      <p className="text-xs text-on-surface-variant">Nenhuma despesa vinculada a este cartão.</p>
                      <p className="text-[10px] text-on-surface-variant/70 mt-1">Selecione este cartão ao registrar gastos na categoria "Crédito".</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                      {cardTxList.map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center p-2.5 rounded-lg bg-surface/50 border border-outline-variant/20 hover:border-outline-variant/40 transition-all text-xs">
                          <div>
                            <span className="font-bold text-on-surface block">{tx.description}</span>
                            <span className="text-[10px] text-on-surface-variant mt-0.5 block capitalize">{tx.category} • {new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <span className="font-semibold text-on-surface">
                            {formatCurrency(tx.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-on-surface-variant/80 border-t border-outline-variant/20 pt-3 mt-4">
                  *As despesas nesta aba são consolidadas em faturas isoladas e não deduzem diretamente de sua conta corrente de forma imediata até a fatura ser voluntariamente quitada.
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
