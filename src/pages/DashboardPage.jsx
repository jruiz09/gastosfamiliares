
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

    <div className="space-y-5 pb-28">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-black leading-none">
            Dashboard
          </h1>

          <p className="text-sm text-zinc-500 mt-2">
            {selectedTitle}
          </p>

        </div>

        <button

          onClick={() => setOpenFab(true)}

          className="
            w-14
            h-14

            rounded-2xl

            bg-primary

            text-white

            flex

            items-center

            justify-center

            shadow-lg

            active:scale-95

            transition
          "

        >

          <Plus size={26} />

        </button>

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

      <Card className="p-3">

        <div className="space-y-3">

          <div className="flex gap-2 overflow-x-auto no-scrollbar">

            {['year', 'month', 'day'].map((mode) => (

              <button

                key={mode}

                type="button"

                onClick={() => setViewMode(mode)}

                className={`

                  whitespace-nowrap

                  rounded-lg

                  px-4

                  py-2

                  text-sm

                  font-semibold

                  transition

                  ${
                    viewMode === mode
                      ? 'bg-primary text-white'
                      : 'bg-zinc-100 text-zinc-600'
                  }

                `}

              >

                {mode === 'year'
                  ? 'Año'
                  : mode === 'month'
                  ? 'Mes'
                  : 'Rango'}

              </button>

            ))}

          </div>

          <div className="space-y-3">

            <select

              value={selectedYear}

              onChange={(e) =>
                setSelectedYear(Number(e.target.value))
              }

              className="
                w-full

                rounded-lg

                border

                border-zinc-200

                px-4

                py-3

                bg-white
              "

            >

              {years.map((year) => (

                <option
                  key={year}
                  value={year}
                >

                  {year}

                </option>

              ))}

            </select>

            {

              viewMode === 'month' && (

                <select

                  value={selectedMonth}

                  onChange={(e) =>
                    setSelectedMonth(Number(e.target.value))
                  }

                  className="
                    w-full

                    rounded-lg

                    border

                    border-zinc-200

                    px-4

                    py-3

                    bg-white
                  "

                >

                  {

                    months.map(mes => (

                      <option

                        key={mes.value}

                        value={mes.value}

                      >

                        {mes.label}

                      </option>

                    ))

                  }

                </select>

              )

            }

            {

              viewMode === 'day' && (

                <div className="grid grid-cols-2 gap-3">

                  <input

                    type="date"

                    value={fechaInicio}

                    onChange={(e) =>
                      setFechaInicio(e.target.value)
                    }

                    className="
                      rounded-lg

                      border

                      border-zinc-200

                      px-3

                      py-3
                    "

                  />

                  <input

                    type="date"

                    value={fechaFin}

                    onChange={(e) =>
                      setFechaFin(e.target.value)
                    }

                    className="
                      rounded-lg

                      border

                      border-zinc-200

                      px-3

                      py-3
                    "

                  />

                </div>

              )

            }

          </div>

        </div>

      </Card>

      {/* RESUMEN */}

      <div className="space-y-3">

        <div

          onClick={() =>
            navigate('/movimientos', {
              state: {
                viewMode,
                selectedYear,
                selectedMonth,
                fechaInicio,
                fechaFin,
              },
            })
          }

        >

          <InsightCard

            title="Balance"

            value={`$${totalBalance.toLocaleString()}`}

            hint="Disponible"

            accent="primary"

            icon={<Wallet size={22} />}

          />

        </div>

        <div className="grid grid-cols-2 gap-3">

          <div

            onClick={() =>
              navigate('/ingresos', {
                state: {
                  viewMode,
                  selectedYear,
                  selectedMonth,
                  fechaInicio,
                  fechaFin,
                },
              })
            }

          >

            <InsightCard

              title="Ingresos"

              value={`$${totalIngresos.toLocaleString()}`}

              hint="Período"

              accent="success"

              icon={<TrendingUp size={20} />}

            />

          </div>

          <div

            onClick={() =>
              navigate('/gastos', {
                state: {
                  viewMode,
                  selectedYear,
                  selectedMonth,
                  fechaInicio,
                  fechaFin,
                },
              })
            }

          >

            <InsightCard

              title="Gastos"

              value={`$${totalGastos.toLocaleString()}`}

              hint="Período"

              accent="danger"

              icon={<TrendingDown size={20} />}

            />

          </div>

        </div>

      </div>{/* ULTIMOS GASTOS */}

<Card className="p-3.5">

  <div className="flex items-center justify-between mb-5">

    <div>

      <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
        Actividad reciente
      </p>

      <h2 className="text-xl font-black mt-1">
        Últimos gastos
      </h2>

    </div>

    <button

      onClick={() => navigate('/gastos')}

      className="text-primary text-sm font-semibold"

    >

      Ver todos

    </button>

  </div>

  <div className="space-y-3">

    {

      ultimosGastos.length === 0

        ? (

          <EmptyState

            title="Todavía no hay gastos"

            description="Registrá un gasto para comenzar."

          />

        )

        : (

          ultimosGastos.slice(0,5).map(gasto => (

            <motion.div

              key={gasto.id}

              whileTap={{ scale: .98 }}

              className="

                flex

                items-center

                justify-between

                rounded-2xl

                border

                border-zinc-100

                bg-white

                p-3.5

              "

            >

              <div className="flex items-center gap-3">

                <div

                  className="

                    w-10

                    h-10

                    rounded-lg

                    bg-pink-100

                    flex

                    items-center

                    justify-center

                    text-primary

                    font-black

                    shrink-0

                  "

                >

                  {gasto.categoria?.nombre?.charAt(0) || 'G'}

                </div>

                <div>

                  <p className="font-semibold leading-none">

                    {gasto.descripcion}

                  </p>

                  <p className="text-xs text-zinc-400 mt-2">

                    {gasto.categoria?.nombre}

                    {' • '}

                    {gasto.tipo_cuenta?.nombre}

                  </p>

                </div>

              </div>

              <p className="font-black text-red-500">

                -${Number(gasto.monto).toLocaleString()}

              </p>

            </motion.div>

          ))

        )

    }

  </div>

</Card>

{/* CUENTAS */}

<Card className="p-3.5">

  <div className="mb-5">

    <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
      Disponibilidad
    </p>

    <h2 className="text-xl font-black mt-1">
      Tus cuentas
    </h2>

  </div>

  <div className="space-y-3">

    {

      cuentasPorTipo.map(cuenta => {

        const saldo =
          cuenta.ingresos -
          cuenta.gastos;

        const color =

          cuenta.cuenta === 'Banco'

            ? 'bg-blue-100 text-blue-600'

            : cuenta.cuenta === 'Efectivo'

            ? 'bg-emerald-100 text-emerald-600'

            : 'bg-pink-100 text-primary';

        return (

          <motion.div

            key={cuenta.cuenta}

            whileTap={{ scale:.98 }}

            className="

              flex

              items-center

              justify-between

              rounded-2xl

              border

              border-zinc-100

              p-3.5

            "

          >

            <div className="flex items-center gap-3">

              <div

                className={`

                  w-10

                  h-10

                  rounded-lg

                  flex

                  items-center

                  justify-center

                  font-black

                  ${color}

                `}

              >

                {cuenta.cuenta[0]}

              </div>

              <div>

                <p className="font-semibold">

                  {cuenta.cuenta}

                </p>

                <p className="text-xs text-zinc-400 mt-1">

                  +${cuenta.ingresos.toLocaleString()}

                  {' / '}

                  -${cuenta.gastos.toLocaleString()}

                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-xs text-zinc-400">

                Disponible

              </p>

              <p className="font-black text-lg">

                ${saldo.toLocaleString()}

              </p>

            </div>

          </motion.div>

        );

      })

    }

  </div>

</Card>

{/* GRAFICO */}

<Card className="p-3.5">

  <div className="flex items-center justify-between mb-5">

    <div>

      <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
        Tendencia
      </p>

      <h2 className="text-xl font-black mt-1">
        Evolución
      </h2>

    </div>

    <span className="text-xs text-zinc-400">

      {selectedTitle}

    </span>

  </div>

  <div className="h-[280px]">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart

        data={chartData}

        margin={{

          top: 10,

          left: -20,

          right: 5,

          bottom: 0,

        }}

      >

        <defs>

          <linearGradient

            id="barGradient"

            x1="0"

            y1="0"

            x2="0"

            y2="1"

          >

            <stop

              offset="0%"

              stopColor="#ec4899"

            />

            <stop

              offset="100%"

              stopColor="#f9a8d4"

            />

          </linearGradient>

        </defs>

        <CartesianGrid

          vertical={false}

          stroke="#f3f4f6"

          strokeDasharray="3 3"

        />

        <XAxis

          dataKey="label"

          tickLine={false}

          axisLine={false}

          tick={{

            fontSize: 11,

            fill: '#71717a',

          }}

        />

        <Tooltip

          cursor={{

            fill:'rgba(236,72,153,.08)'

          }}

          contentStyle={{

            borderRadius:16,

            border:'none',

            boxShadow:'0 10px 30px rgba(0,0,0,.08)',

            background:'#fff'

          }}

        />

        <Bar

          dataKey="ingresos"

          name="Ingresos"

          fill="#22c55e"

          radius={[10,10,0,0]}

          barSize={18}

          animationDuration={700}

        />

        <Bar

          dataKey="gastos"

          name="Gastos"

          fill="url(#barGradient)"

          radius={[10,10,0,0]}

          barSize={18}

          animationDuration={700}

        />

      </BarChart>

    </ResponsiveContainer>

  </div>

  <div className="flex justify-center gap-6 mt-4">

    <div className="flex items-center gap-2 text-xs text-zinc-500">

      <span className="w-3 h-3 rounded-full bg-emerald-500" />

      Ingresos

    </div>

    <div className="flex items-center gap-2 text-xs text-zinc-500">

      <span className="w-3 h-3 rounded-full bg-pink-500" />

      Gastos

    </div>

  </div>

</Card>
      </div>
    </>
  );
}

export default DashboardPage;
