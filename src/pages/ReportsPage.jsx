import { useMemo, useState } from 'react';
import { BarChart3, PieChart as PieChartIcon, CalendarDays, Download } from 'lucide-react';
import { useGastos } from '../modules/gastos/hooks/useGastos';
import { useIngresos } from '../modules/ingresos/hooks/useIngresos';
import Card from '../components/ui/Card';
import { buildSummaryCsv } from '../utils/financeUtils';

function ReportsPage() {
  const [viewMode, setViewMode] = useState('month');
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear] = useState(currentYear);
  const [selectedMonth] = useState(currentMonth);

  const fechaDesde = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
  const fechaHasta = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-31`;

  const { data: gastosData } = useGastos({ pagina: 1, limite: 100, fechaDesde, fechaHasta });
  const { data: ingresosData } = useIngresos({ pagina: 1, limite: 100, fechaDesde, fechaHasta });

  const gastos = useMemo(() => gastosData?.resultados || [], [gastosData?.resultados]);
  const ingresos = useMemo(() => ingresosData?.resultados || [], [ingresosData?.resultados]);

  const chartData = useMemo(() => {
    const categories = new Map();
    gastos.forEach((item) => {
      const name = item.categoria?.nombre || item.Categoria?.nombre || 'Sin categoría';
      categories.set(name, (categories.get(name) || 0) + Number(item.monto || 0));
    });

    return Array.from(categories.entries()).map(([name, value]) => ({ name, value }));
  }, [gastos]);

  const exportCsv = () => {
    const csv = buildSummaryCsv({
      periodLabel: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`,
      ingresos: ingresos.reduce((sum, item) => sum + Number(item.monto || 0), 0),
      gastos: gastos.reduce((sum, item) => sum + Number(item.monto || 0), 0),
      balance: ingresos.reduce((sum, item) => sum + Number(item.monto || 0), 0) - gastos.reduce((sum, item) => sum + Number(item.monto || 0), 0),
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reportes.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-dark pb-24">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-primary">Informes</h1>
            <p className="text-sm text-zinc-500">Tu actividad financiera en un vistazo profesional.</p>
          </div>
          <button type="button" onClick={exportCsv} className="rounded-2xl border border-pink-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
            <span className="inline-flex items-center gap-2"><Download size={16} />CSV</span>
          </button>
        </div>

        <Card className="p-4">
          <div className="flex gap-2">
            {['month', 'year'].map((mode) => (
              <button key={mode} type="button" onClick={() => setViewMode(mode)} className={`rounded-2xl px-3 py-2 text-sm font-semibold ${viewMode === mode ? 'bg-primary text-white' : 'bg-white/5 text-slate-600'}`}>
                {mode === 'month' ? 'Mensual' : 'Anual'}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-primary font-semibold mb-3"><BarChart3 size={18} />Evolución mensual</div>
            <div className="space-y-3">
              {chartData.slice(0, 5).map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-600">{item.name}</span>
                  <span className="font-semibold text-slate-900">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-primary font-semibold mb-3"><PieChartIcon size={18} />Distribución por categoría</div>
            <div className="space-y-3">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-600">{item.name}</span>
                  <span className="font-semibold text-slate-900">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-primary font-semibold mb-3"><CalendarDays size={18} />Calendario financiero</div>
          <div className="rounded-2xl border border-pink-100 bg-slate-50 p-4 text-sm text-slate-600">
            Se integrará con los movimientos para mostrar una vista mensual de ingresos, gastos y vencimientos.
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ReportsPage;
