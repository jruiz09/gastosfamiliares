import test from 'node:test';
import assert from 'node:assert/strict';
import { getMonthDateRange } from './dateUtils.js';

test('getMonthDateRange devuelve el último día real del mes', () => {
  assert.deepEqual(getMonthDateRange(2024, 2), {
    fechaDesde: '2024-02-01',
    fechaHasta: '2024-02-29',
  });

  assert.deepEqual(getMonthDateRange(2023, 2), {
    fechaDesde: '2023-02-01',
    fechaHasta: '2023-02-28',
  });
});
