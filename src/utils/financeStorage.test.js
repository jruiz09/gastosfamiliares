import test from 'node:test';
import assert from 'node:assert/strict';
import { getBudgetAlerts } from './financeStorage.js';

test('getBudgetAlerts marca presupuestos que ya superaron el límite', () => {
  const alerts = getBudgetAlerts(
    [{ category: 'Comida', amount: 1000 }],
    [{ monto: 1200, categoria: { nombre: 'Comida' } }]
  );

  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].isOver, true);
  assert.equal(alerts[0].progress, 100);
});
