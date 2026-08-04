import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProgress, buildSummaryCsv } from './financeUtils.js';

test('calculateProgress devuelve porcentaje real, restante y estado de sobrepaso', () => {
  assert.deepEqual(calculateProgress(1200, 2000), {
    percent: 60,
    remaining: 800,
    isOverBudget: false,
  });

  assert.deepEqual(calculateProgress(2500, 2000), {
    percent: 100,
    remaining: -500,
    isOverBudget: true,
  });
});

test('buildSummaryCsv genera una exportación con encabezados y datos', () => {
  const csv = buildSummaryCsv({
    periodLabel: 'Marzo 2026',
    ingresos: 1000,
    gastos: 700,
    balance: 300,
    budget: 1500,
    savingsGoal: 500,
    budgetProgress: 47,
    savingsProgress: 60,
  });

  assert.match(csv, /periodo,valor/i);
  assert.match(csv, /Marzo 2026/);
  assert.match(csv, /1000/);
  assert.match(csv, /700/);
});
