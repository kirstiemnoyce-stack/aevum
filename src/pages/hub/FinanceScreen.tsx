import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, TrendingUp, TrendingDown, Receipt, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useApp } from '@/contexts/AppContext';

const expenseColors: Record<string, string> = { Housing: 'var(--app-primary, #6366F1)', Food: '#10B981', Transport: '#A855F7', Entertainment: '#64748B', Utilities: '#64748B', Other: '#334155' };

export default function FinanceScreen() {
  const navigate = useNavigate();
  const { incomes, expenses, bills, addIncome, addExpense, toggleBill } = useApp();
  const [tab, setTab] = useState<'overview' | 'bills'>('overview');
  const [incSource, setIncSource] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [expCat, setExpCat] = useState('Food');
  const [expAmount, setExpAmount] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netWorth = totalIncome - totalExpenses;
  const expenseByCat = Object.entries(expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {} as Record<string, number>))
    .map(([name, value]) => ({ name, value, color: expenseColors[name] || '#334155' }));

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Finance</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        {/* Overview card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal rounded-2xl p-6">
          <p className="text-caption text-white/50 mb-1">Net Position (AUD)</p>
          <p className={`text-display-md ${netWorth >= 0 ? 'text-sage' : 'text-red-400'}`}>${netWorth.toLocaleString()}</p>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2"><TrendingUp size={14} className="text-sage" /><span className="text-caption text-white/70">${totalIncome.toLocaleString()} in</span></div>
            <div className="flex items-center gap-2"><TrendingDown size={14} className="text-red-400" /><span className="text-caption text-white/70">${totalExpenses.toLocaleString()} out</span></div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[{ id: 'overview' as const, label: 'Overview' }, { id: 'bills' as const, label: `Bills (${bills.filter(b => !b.paid).length})` }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-body-sm font-medium transition-colors ${tab === t.id ? 'bg-primary text-white' : 'bg-cream-soft dark:bg-white/5 text-clay'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Expense chart */}
            {expenseByCat.length > 0 && (
              <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
                <h3 className="text-body-sm font-medium text-charcoal dark:text-cream-soft mb-4">Expenses by Category</h3>
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%"><PieChart>
                    <Pie data={expenseByCat} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" strokeWidth={0}>
                      {expenseByCat.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart></ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {expenseByCat.map(c => (
                    <span key={c.name} className="text-caption px-2 py-1 rounded-full bg-parchment dark:bg-white/5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}: ${c.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add income */}
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card space-y-3">
              <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Add Income</p>
              <div className="flex gap-2">
                <input value={incSource} onChange={e => setIncSource(e.target.value)} placeholder="Source"
                  className="flex-1 h-[44px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none" />
                <input value={incAmount} onChange={e => setIncAmount(e.target.value)} placeholder="$" type="number"
                  className="w-24 h-[44px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none" />
              </div>
              <button onClick={() => { if (incSource && incAmount) { addIncome({ id: Date.now().toString(), source: incSource, amount: Number(incAmount), date: today }); setIncSource(''); setIncAmount(''); }}}
                className="w-full h-[40px] rounded-full bg-sage text-white font-medium text-body-sm">Add Income</button>
            </div>

            {/* Add expense */}
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card space-y-3">
              <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Add Expense</p>
              <select value={expCat} onChange={e => setExpCat(e.target.value)}
                className="w-full h-[44px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft focus:outline-none">
                {Object.keys(expenseColors).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input value={expAmount} onChange={e => setExpAmount(e.target.value)} placeholder="Amount (AUD)" type="number"
                className="w-full h-[44px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none" />
              <button onClick={() => { if (expAmount) { addExpense({ id: Date.now().toString(), category: expCat, amount: Number(expAmount), date: today }); setExpAmount(''); }}}
                className="w-full h-[40px] rounded-full bg-primary text-white font-medium text-body-sm">Add Expense</button>
            </div>
          </motion.div>
        )}

        {tab === 'bills' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {bills.map(b => (
              <div key={b.id} className={`p-4 rounded-xl ${b.paid ? 'bg-sage/10 dark:bg-sage/5' : 'bg-cream-soft dark:bg-white/5'} shadow-card`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleBill(b.id)}>
                      {b.paid ? <CheckCircle2 size={20} className="text-sage" /> : <Receipt size={20} className="text-clay" />}
                    </button>
                    <div>
                      <p className={`text-body-sm font-medium ${b.paid ? 'text-charcoal/50 dark:text-cream-soft/50 line-through' : 'text-charcoal dark:text-cream-soft'}`}>{b.name}</p>
                      <p className="text-caption text-clay">Due: {b.dueDate}</p>
                    </div>
                  </div>
                  <span className={`text-body-sm font-medium ${b.paid ? 'text-charcoal/50' : 'text-primary'}`}>${b.amount}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
