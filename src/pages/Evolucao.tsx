import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Award, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Evolucao() {
  const { transactions } = useFinance();

  // Dynamic Calculation Logic mimicking database query for cumulative ending balances:
  // 1. Identify the last 6 calendar months.
  // 2. Map all transactions into their respective months.
  // 3. For each month, calculate cumulative sum up to that point.
  const chartData = useMemo(() => {
    const today = new Date();
    const months: { label: string; yearMonth: string; endOfTime: Date }[] = [];

    // Generate last 6 months chronologically (from oldest to newest)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      
      // End of this specific month
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      months.push({ label, yearMonth, endOfTime: lastDay });
    }

    // Sort transactions by date ascending
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate cumulative balances at each month end
    return months.map(m => {
      let cumulativeBalance = 0;
      
      sortedTx.forEach(tx => {
        const txDate = new Date(tx.date);
        // If transaction occurred on or before this month's end date
        if (txDate.getTime() <= m.endOfTime.getTime()) {
          if (tx.type === 'income') {
            cumulativeBalance += tx.amount;
          } else {
            cumulativeBalance -= tx.amount;
          }
        }
      });

      return {
        name: m.label,
        Balance: Math.round(cumulativeBalance * 100) / 100,
        formatted: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cumulativeBalance)
      };
    });
  }, [transactions]);

  const currentNetWorth = chartData[chartData.length - 1]?.Balance || 0;
  const previousNetWorth = chartData[chartData.length - 2]?.Balance || 0;
  const growthPercent = previousNetWorth > 0 
    ? ((currentNetWorth - previousNetWorth) / previousNetWorth) * 100 
    : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1280px] mx-auto w-full">
      <header className="mb-8">
        <h2 className="text-[32px] font-semibold text-on-surface leading-tight tracking-tight">Evolução Patrimonial</h2>
        <p className="text-base text-on-surface-variant mt-1">Acompanhe seu progresso de patrimônio líquido acumulado mês a mês.</p>
      </header>



      {/* Net Worth Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-md">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Patrimônio Líquido Atual</span>
          <p className="text-4xl font-black text-on-surface mt-2">{formatCurrency(currentNetWorth)}</p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-secondary font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>+{growthPercent.toFixed(1)}% de crescimento vs mês anterior</span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Médias Mensais</span>
            <p className="text-lg font-bold text-on-surface mt-2">Construção Patrimonial Ativa</p>
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            Baseado nos últimos 6 meses, seu patrimônio cresceu à média de <strong>{formatCurrency(currentNetWorth / 6)}</strong> ao mês.
          </p>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-md flex items-center gap-4">
          <div className="p-3 bg-secondary/15 text-secondary rounded-xl">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Pontuação de Saúde</h4>
            <p className="text-xs text-on-surface-variant mt-1">Sua evolução patrimonial está com nota máxima (Excelente). Você está poupando ativamente parte relevante de suas entradas.</p>
          </div>
        </div>
      </section>

      {/* Recharts Cumulative Balance Line Graph */}
      <div className="bg-surface-container rounded-2xl p-6 md:p-8 border border-outline-variant/30 shadow-xl mb-8">
        <h3 className="text-xl font-semibold text-on-surface mb-6">Gráfico Histórico de Evolução</h3>
        
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#48e089" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#48e089" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3a31" />
              <XAxis dataKey="name" stroke="#a3b899" fontSize={11} tickLine={false} />
              <YAxis stroke="#a3b899" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111b15', border: '1px solid #48e089', borderRadius: '8px' }} 
                labelStyle={{ color: '#48e089', fontWeight: 'bold' }}
                itemStyle={{ color: '#e0f5ea' }}
              />
              <Area type="monotone" dataKey="Balance" stroke="#48e089" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
