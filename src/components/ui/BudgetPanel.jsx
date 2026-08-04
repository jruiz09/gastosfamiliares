import { useMemo, useState } from 'react';
import { getBudgets, saveBudgets, getBudgetAlerts } from '../../utils/financeStorage';
import Card from './Card';

function BudgetPanel({ gastos = [] }) {
  const [budgets, setBudgets] = useState(getBudgets());
  const [draft, setDraft] = useState('');

  const alerts = useMemo(() => getBudgetAlerts(budgets, gastos), [budgets, gastos]);

  const addBudget = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const next = [...budgets, { id: Date.now(), category: trimmed, amount: 1000 }];
    setBudgets(next);
    saveBudgets(next);
    setDraft('');
  };

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-zinc-400 text-sm">Presupuestos</p>
          <h2 className="text-xl font-black mt-1">Categorías y límites</h2>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Categoría" className="flex-1 rounded-2xl border border-pink-100 bg-white px-3 py-3 text-sm text-slate-900" />
        <button type="button" onClick={addBudget} className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white">Agregar</button>
      </div>

      <div className="mt-4 space-y-3">
        {budgets.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-zinc-500">Agrega un presupuesto para recibir alertas inteligentes.</div>
        ) : (
          budgets.map((budget) => (
            <div key={budget.id} className="rounded-2xl border border-pink-100 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{budget.category}</span>
                <span className="text-sm text-zinc-500">${Number(budget.amount).toLocaleString()}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-pink-100">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(100, alerts.find((item) => item.id === budget.id)?.progress || 0)}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export default BudgetPanel;
