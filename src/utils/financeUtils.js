export function calculateProgress(currentValue, targetValue) {
  const safeTarget = Number(targetValue || 0);
  const safeCurrent = Number(currentValue || 0);

  if (safeTarget <= 0) {
    return {
      percent: 0,
      remaining: 0,
      isOverBudget: safeCurrent > 0,
    };
  }

  const percent = Math.min(100, Math.round((safeCurrent / safeTarget) * 100));

  return {
    percent,
    remaining: safeTarget - safeCurrent,
    isOverBudget: safeCurrent > safeTarget,
  };
}

export function buildSummaryCsv(summary) {
  const rows = [
    ['periodo', 'valor'],
    ['rango', summary.periodLabel || ''],
    ['ingresos', summary.ingresos ?? 0],
    ['gastos', summary.gastos ?? 0],
    ['balance', summary.balance ?? 0],
    ['presupuesto', summary.budget ?? 0],
    ['meta_ahorro', summary.savingsGoal ?? 0],
    ['progreso_presupuesto', summary.budgetProgress ?? 0],
    ['progreso_meta', summary.savingsProgress ?? 0],
  ];

  return rows.map((row) => row.join(',')).join('\n');
}
