
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FabActions from '../components/ui/FabActions';

import AgregarIngresoModal from '../modules/ingresos/components/AgregarIngresoModal';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus
} from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from 'recharts';

import { motion } from 'framer-motion';

import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import BudgetPanel from '../components/ui/BudgetPanel';
import InsightCard from '../components/ui/InsightCard';
import ActionStrip from '../components/ui/ActionStrip';
import RecommendationCard from '../components/ui/RecommendationCard';
import { getMonthDateRange } from '../utils/dateUtils';
import { calculateProgress, buildSummaryCsv } from '../utils/financeUtils';

import {
  useEvolucionAnual
} from '../modules/dashboard/hooks/useEvolucionAnual';

import {
  useEvolucionMensual
} from '../modules/dashboard/hooks/useEvolucionMensual';

import {
  useEvolucionRango
} from '../modules/dashboard/hooks/useEvolucionRango';

import {
  useResumenCuentas
} from '../modules/dashboard/hooks/useResumenCuentas';

import {
  useUltimosGastos
} from '../modules/dashboard/hooks/useUltimosGastos';

import AgregarGastoModal from '../modules/gastos/components/AgregarGastoModal';

function DashboardPage() {

  const [openFab, setOpenFab] = useState(false);
  const [openIngreso, setOpenIngreso] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().toISOString().slice(0, 10);

  const [viewMode, setViewMode] = useState('year');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [fechaInicio, setFechaInicio] = useState(currentDate);
  const [fechaFin, setFechaFin] = useState(currentDate);

  const {
    data: evolucionAnual,
    isLoading: isLoadingAnual,
  } = useEvolucionAnual(selectedYear);

  const {
    data: evolucionMensual,
    isLoading: isLoadingMensual,
  } = useEvolucionMensual(selectedYear, selectedMonth);

  const {
    data: evolucionRango,
    isLoading: isLoadingRango,
  } = useEvolucionRango(fechaInicio, fechaFin);

  const {
    data: ultimosGastos = []
  } = useUltimosGastos();

  const isLoading = isLoadingAnual || isLoadingMensual || isLoadingRango;

  const fechaFiltro = useMemo(() => {
    if (viewMode === 'year') {
      return {
        fechaInicio: `${selectedYear}-01-01`,
        fechaFin: `${selectedYear}-12-31`,
      };
    }

    if (viewMode === 'month') {
      const { fechaDesde, fechaHasta } = getMonthDateRange(selectedYear, selectedMonth);
      return {
        fechaInicio: fechaDesde,
        fechaFin: fechaHasta,
      };
    }

    return {
      fechaInicio,
      fechaFin,
    };
  }, [viewMode, selectedYear, selectedMonth, fechaInicio, fechaFin]);

  const {
    data: resumenCuentas = {
      ingresos: [],
      gastos: [],
    },
  } = useResumenCuentas(
    fechaFiltro.fechaInicio,
    fechaFiltro.fechaFin
  );

  const selectedData = useMemo(() => {
    if (viewMode === 'year') return evolucionAnual;
    if (viewMode === 'month') return evolucionMensual;
    return evolucionRango;
  }, [viewMode, evolucionAnual, evolucionMensual, evolucionRango]);

  const chartData = useMemo(() => {
    if (!selectedData) return [];

    const merged = new Map();

    const addRow = (item, key) => {
      const label = item.label ?? item.mes ?? item.dia ?? '';
      const existing = merged.get(label) || {
        label,
        gastos: 0,
        ingresos: 0,
      };

      existing[key] = Number(item.total || 0);
      merged.set(label, existing);
    };

    selectedData.gastos?.forEach((item) => addRow(item, 'gastos'));
    selectedData.ingresos?.forEach((item) => addRow(item, 'ingresos'));

    const rows = Array.from(merged.values());

    if (viewMode === 'year') {
      return rows.sort((a, b) => Number(a.label) - Number(b.label));
    }

    return rows.sort((a, b) => String(a.label).localeCompare(String(b.label)));
  }, [selectedData, viewMode]);

  const totals = useMemo(() => {
    if (!selectedData) return { gastos: 0, ingresos: 0, balance: 0 };

    const gastos = selectedData.gastos?.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    ) || 0;

    const ingresos = selectedData.ingresos?.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    ) || 0;

    return {
      gastos,
      ingresos,
      balance: ingresos - gastos,
    };
  }, [selectedData]);

  
  const totalBalance = totals.balance;
  const totalIngresos = totals.ingresos;
  const totalGastos = totals.gastos;

  const cuentasPorTipo = useMemo(() => {
    const cuentas = new Map();

    resumenCuentas.ingresos?.forEach((item) => {
      cuentas.set(item.cuenta, {
        cuenta: item.cuenta,
        ingresos: Number(item.total || 0),
        gastos: 0,
      });
    });

    resumenCuentas.gastos?.forEach((item) => {
      const existing = cuentas.get(item.cuenta) || {
        cuenta: item.cuenta,
        ingresos: 0,
        gastos: 0,
      };
      existing.gastos = Number(item.total || 0);
      cuentas.set(item.cuenta, existing);
    });

    const knownAccounts = ['Efectivo', 'Banco', 'Mercado Pago'];
    return knownAccounts.map((nombre) => {
      const cuenta = cuentas.get(nombre);
      return cuenta || {
        cuenta: nombre,
        ingresos: 0,
        gastos: 0,
      };
    });
  }, [resumenCuentas]);

  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);
  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  const selectedTitle =
    viewMode === 'year'
      ? `Año ${selectedYear}`
      : viewMode === 'month'
      ? `${months.find((m) => m.value === Number(selectedMonth))?.label} ${selectedYear}`
      : `${fechaInicio} - ${fechaFin}`;

  const budget = 2000;
  const savingsGoal = 1500;
  const budgetProgress = calculateProgress(totalGastos, budget);
  const savingsProgress = calculateProgress(totalBalance, savingsGoal);

  const exportSummary = () => {
    const csv = buildSummaryCsv({
      periodLabel: selectedTitle,
      ingresos: totalIngresos,
      gastos: totalGastos,
      balance: totalBalance,
      budget,
      savingsGoal,
      budgetProgress: budgetProgress.percent,
      savingsProgress: savingsProgress.percent,
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resumen-${selectedYear}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }


  return (

    <>

      <AgregarGastoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

      <AgregarIngresoModal
        open={openIngreso}
        onClose={() => setOpenIngreso(false)}
      />

      <FabActions
        open={openFab}
        onClose={() => setOpenFab(false)}
        onGasto={() => {
          setOpenFab(false);
          setOpenModal(true);
        }}
        onIngreso={() => {
          setOpenFab(false);
          setOpenIngreso(true);
        }}
      />

      <div className="space-y-6">

        {/* HEADER */}

        <div className="space-y-1">

          <h1 className="text-3xl font-black text-primary">
            Dashboard
          </h1>

          <p className="text-sm text-zinc-500">
            Resumen financiero por {viewMode === 'year' ? 'año' : viewMode === 'month' ? 'mes' : 'día'}
          </p>

        </div>

        <ActionStrip
          onAddExpense={() => {
            setOpenFab(false);
            setOpenModal(true);
          }}
          onAddIncome={() => {
            setOpenFab(false);
            setOpenIngreso(true);
          }}
          onOpenReports={() => navigate('/reportes')}
        />

        {/* FILTROS */}

        <Card className="p-4 sm:p-5">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['year', 'month', 'day'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                    viewMode === mode ? 'bg-primary text-white' : 'bg-white/5 text-slate-600 hover:bg-primary/10'
                  }`}
                >
                  {mode === 'year' ? 'Año' : mode === 'month' ? 'Mes' : 'Día'}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Año</label>
                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(Number(event.target.value))}
                  className="w-full rounded-2xl border border-zinc-200 bg-white/5 px-4 py-3 text-sm text-slate-900"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {viewMode === 'month' && (
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Mes</label>
                  <select
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(Number(event.target.value))}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/5 px-4 py-3 text-sm text-slate-900"
                  >
                    {months.map((mes) => (
                      <option key={mes.value} value={mes.value}>
                        {mes.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {viewMode === 'day' && (
                <>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Desde</label>
                    <input
                      type="date"
                      value={fechaInicio}
                      onChange={(event) => setFechaInicio(event.target.value)}
                      className="w-full rounded-2xl border border-zinc-200 bg-white/5 px-4 py-3 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Hasta</label>
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={(event) => setFechaFin(event.target.value)}
                      className="w-full rounded-2xl border border-zinc-200 bg-white/5 px-4 py-3 text-sm text-slate-900"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* KPIs */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div onClick={() => navigate('/movimientos', { state: { viewMode, selectedYear, selectedMonth, fechaInicio, fechaFin } })}>
            <InsightCard title="Balance" value={`$${totalBalance.toLocaleString()}`} hint="Saldo actual del período" accent="primary" icon={<Wallet size={18} />} />
          </div>
          <div onClick={() => navigate('/ingresos', { state: { viewMode, selectedYear, selectedMonth, fechaInicio, fechaFin } })}>
            <InsightCard title="Ingresos" value={`$${totalIngresos.toLocaleString()}`} hint="Total registrado" accent="success" icon={<TrendingUp size={18} />} />
          </div>
          <div onClick={() => navigate('/gastos', { state: { viewMode, selectedYear, selectedMonth, fechaInicio, fechaFin } })}>
            <InsightCard title="Gastos" value={`$${totalGastos.toLocaleString()}`} hint="Total registrado" accent="danger" icon={<TrendingDown size={18} />} />
          </div>
        </div>

        {/* SALDOS POR CUENTA */}

        <Card className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-zinc-400 text-sm">Resumen ejecutivo</p>
              <h2 className="text-xl font-black mt-1">Presupuesto y ahorro</h2>
            </div>
            <button
              type="button"
              onClick={exportSummary}
              className="rounded-2xl border border-pink-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Exportar CSV
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-pink-50 p-4">
              <p className="text-sm text-zinc-500">Presupuesto</p>
              <p className="text-xl font-black mt-1">${budget.toLocaleString()}</p>
              <p className="text-sm text-zinc-500 mt-2">{budgetProgress.percent}% usado</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm text-zinc-500">Meta de ahorro</p>
              <p className="text-xl font-black mt-1">${savingsGoal.toLocaleString()}</p>
              <p className="text-sm text-zinc-500 mt-2">{savingsProgress.percent}% alcanzado</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-zinc-500">Restante</p>
              <p className="text-xl font-black mt-1">${Math.max(budgetProgress.remaining, 0).toLocaleString()}</p>
              <p className="text-sm text-zinc-500 mt-2">{budgetProgress.isOverBudget ? 'Superaste el presupuesto' : 'Dentro del plan'}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cuentasPorTipo.map((cuenta) => (
            <motion.div key={cuenta.cuenta} whileHover={{ scale: 1.02 }}>
              <Card className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-zinc-400 text-sm">{cuenta.cuenta}</p>
                    <p className="text-2xl font-black mt-3">
                      ${Math.max(cuenta.ingresos - cuenta.gastos, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-zinc-500 mt-2">
                      {cuenta.ingresos.toLocaleString()} ingreso · {cuenta.gastos.toLocaleString()} egreso
                    </p>
                  </div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        cuenta.cuenta === 'Efectivo'
                          ? 'rgba(34,197,94,0.12)'
                          : cuenta.cuenta === 'Banco'
                          ? 'rgba(59,130,246,0.12)'
                          : 'rgba(236,72,153,0.12)',
                    }}
                  >
                    <span className="text-sm font-black text-slate-900">{cuenta.cuenta[0]}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <BudgetPanel gastos={ultimosGastos} />

        <RecommendationCard
          title="Recomendación básica"
          description={totalBalance > 0 ? 'Tu flujo sigue positivo. Mantener un fondo de reserva mensual puede ayudarte a reducir estrés financiero.' : 'El balance está bajo. Prioriza controlar los gastos variables esta semana para estabilizar el flujo.'}
          action="Ver más"
        />

        {/* GRAFICO */}

        <Card>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold">Evolución</h2>
              <p className="text-zinc-400 text-sm">{selectedTitle}</p>
            </div>
            <div className="text-sm text-zinc-500">
              Selecciona rango para ver ingresos y gastos por {viewMode === 'year' ? 'mes' : 'día'}.
            </div>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#fbcfe8" stopOpacity={0.5} />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} stroke="#f9d7e7" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(244, 114, 182, 0.12)' }}
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid rgba(236, 72, 153, 0.15)',
                    borderRadius: 16,
                    boxShadow: '0 10px 30px rgba(219, 39, 119, 0.1)',
                    color: '#111827',
                  }}
                  labelStyle={{ color: '#6b7280' }}
                />

                <Bar dataKey="gastos" fill="url(#barGradient)" radius={[12, 12, 0, 0]} barSize={26} background={{ fill: '#fff0f6' }}>
                  <LabelList dataKey="gastos" position="top" formatter={(value) => `$${Number(value).toLocaleString()}`} style={{ fill: '#9d174d', fontSize: 12, fontWeight: 700 }} />
                </Bar>
                <Bar dataKey="ingresos" fill="#34d399" radius={[12, 12, 0, 0]} barSize={26} background={{ fill: '#ecfdf5' }}>
                  <LabelList dataKey="ingresos" position="top" formatter={(value) => `$${Number(value).toLocaleString()}`} style={{ fill: '#166534', fontSize: 12, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ULTIMOS GASTOS */}

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Últimos gastos</h2>
          </div>

          <div className="space-y-4">
            {ultimosGastos.length === 0 ? (
              <EmptyState
                title="Aún no hay gastos"
                description="Registra tu primer movimiento para ver tu historial y comenzar a analizar tus finanzas."
              />
            ) : (
              ultimosGastos.map((gasto) => (
                <motion.div
                  key={gasto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between bg-white/5 rounded-2xl p-4"
                >
                  <div>
                    <p className="font-semibold">{gasto.descripcion}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {gasto.categoria?.nombre}
                      </span>
                      <span className="text-xs text-zinc-400">{gasto.tipo_cuenta?.nombre}</span>
                    </div>
                  </div>
                  <p className="text-red-400 font-bold text-lg">
                    ${Number(gasto.monto).toLocaleString()}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </Card>

        {/* FAB */}

        <button
          onClick={() => setOpenFab(true)}
          className="fixed bottom-24 right-5 w-16 h-16 rounded-full bg-primary shadow-pink flex items-center justify-center z-50"
        >
          <Plus size={30} />
        </button>
      </div>
    </>
  );
}

export default DashboardPage;
