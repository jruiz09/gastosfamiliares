import { useMemo } from 'react';
import { formatCurrency } from '../utils/dateUtils';

export function useFinancialInsights({ gastos = [], ingresos = [] }) {
  const insights = useMemo(() => {
    const totalGastos = gastos.reduce((sum, item) => sum + Number(item.monto || 0), 0);
    const totalIngresos = ingresos.reduce((sum, item) => sum + Number(item.monto || 0), 0);
    const balance = totalIngresos - totalGastos;

    const avgDaily = gastos.length ? totalGastos / Math.max(gastos.length, 1) : 0;
    const avgWeekly = totalGastos / 4;
    const avgMonthly = totalGastos;

    const highestExpense = [...gastos].sort((a, b) => Number(b.monto || 0) - Number(a.monto || 0))[0] || null;
    const highestIncome = [...ingresos].sort((a, b) => Number(b.monto || 0) - Number(a.monto || 0))[0] || null;

    const categoryExpenseTotals = gastos.reduce((acc, item) => {
      const category = item.categoria?.nombre || item.Categoria?.nombre || 'Sin categoría';
      acc[category] = (acc[category] || 0) + Number(item.monto || 0);
      return acc;
    }, {});

    const categoryIncomeTotals = ingresos.reduce((acc, item) => {
      const category = item.categoria?.nombre || item.Categoria?.nombre || 'Sin categoría';
      acc[category] = (acc[category] || 0) + Number(item.monto || 0);
      return acc;
    }, {});

    const topExpenseCategory = Object.entries(categoryExpenseTotals).sort((a, b) => b[1] - a[1])[0] || null;
    const topIncomeCategory = Object.entries(categoryIncomeTotals).sort((a, b) => b[1] - a[1])[0] || null;

    return {
      totalGastos,
      totalIngresos,
      balance,
      avgDaily,
      avgWeekly,
      avgMonthly,
      highestExpense,
      highestIncome,
      topExpenseCategory,
      topIncomeCategory,
      formatted: {
        totalGastos: formatCurrency(totalGastos),
        totalIngresos: formatCurrency(totalIngresos),
        balance: formatCurrency(balance),
        avgDaily: formatCurrency(avgDaily),
        avgWeekly: formatCurrency(avgWeekly),
        avgMonthly: formatCurrency(avgMonthly),
      },
    };
  }, [gastos, ingresos]);

  return insights;
}
