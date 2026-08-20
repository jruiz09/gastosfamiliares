import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
} from 'lucide-react';
import { useGastos } from '../modules/gastos/hooks/useGastos';
import { useIngresos } from '../modules/ingresos/hooks/useIngresos';
import { useCategorias } from '../modules/gastos/hooks/useCategorias';
import { useTiposCuenta } from '../modules/gastos/hooks/useTiposCuenta';
import Card from '../components/ui/Card';
import AgregarGastoModal from '../modules/gastos/components/AgregarGastoModal';
import AgregarIngresoModal from '../modules/ingresos/components/AgregarIngresoModal';
import FabActions from '../components/ui/FabActions';

function MovimientosPage() {
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [openFab, setOpenFab] = useState(false);
  const [openGastoModal, setOpenGastoModal] = useState(false);
  const [openIngresoModal, setOpenIngresoModal] = useState(false);

  const [viewMode, setViewMode] = useState('year');
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().toISOString().slice(0, 10);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [fechaDesde, setFechaDesde] = useState(currentDate);
  const [fechaHasta, setFechaHasta] = useState(currentDate);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [tipoCuentaSeleccionado, setTipoCuentaSeleccionado] = useState(null);

  const { data: categorias = [] } = useCategorias();
  const { data: tiposCuenta = [] } = useTiposCuenta();

  const fechaFiltro = useMemo(() => {
    if (viewMode === 'year') {
      return {
        fechaDesde: `${selectedYear}-01-01`,
        fechaHasta: `${selectedYear}-12-31`,
      };
    }
    if (viewMode === 'month') {
      const mesFormateado = String(selectedMonth).padStart(2, '0');
      return {
        fechaDesde: `${selectedYear}-${mesFormateado}-01`,
        fechaHasta: `${selectedYear}-${mesFormateado}-31`,
      };
    }
    return {
      fechaDesde: fechaDesde || null,
      fechaHasta: fechaHasta || null,
    };
  }, [viewMode, selectedYear, selectedMonth, fechaDesde, fechaHasta]);

  const { data: gastosData, isLoading: isLoadingGastos } = useGastos({
    pagina,
    limite: 15,
    categoria: categoriaSeleccionada,
    tipoCuenta: tipoCuentaSeleccionado,
    fechaDesde: fechaFiltro.fechaDesde,
    fechaHasta: fechaFiltro.fechaHasta,
  });

  const { data: ingresosData, isLoading: isLoadingIngresos } = useIngresos({
    pagina,
    limite: 15,
    categoria: categoriaSeleccionada,
    tipoCuenta: tipoCuentaSeleccionado,
    fechaDesde: fechaFiltro.fechaDesde,
    fechaHasta: fechaFiltro.fechaHasta,
  });

  const gastos = useMemo(() => gastosData?.resultados || [], [gastosData?.resultados]);
  const ingresos = useMemo(() => ingresosData?.resultados || [], [ingresosData?.resultados]);
  const isLoading = isLoadingGastos || isLoadingIngresos;

  const movimientosFiltrados = useMemo(() => {
    const all = [
      ...gastos.map((gasto) => ({
        ...gasto,
        tipo: 'gasto',
      })),
      ...ingresos.map((ingreso) => ({
        ...ingreso,
        tipo: 'ingreso',
      })),
    ];

    return all
      .filter((item) =>
        item.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      )
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [gastos, ingresos, busqueda]);

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
      : `${fechaDesde} - ${fechaHasta}`;

  return (
    <div className="min-h-screen bg-dark pb-28 md:pb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-dark/80 backdrop-blur-xl border-b border-pink-100"
      >
        <div className="p-4 max-w-md mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Movimientos</h1>
              <p className="text-slate-500">Revisa ingresos y gastos en un solo lugar.</p>
            </div>
            <button
              onClick={() => setOpenFab(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-white shadow-pink hover:bg-pink-500 transition-colors"
            >
              <Plus size={18} />
              Nuevo movimiento
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {['year', 'month', 'day'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                  viewMode === mode
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-slate-600 hover:bg-primary/10'
                }`}
              >
                {mode === 'year' ? 'Año' : mode === 'month' ? 'Mes' : 'Día'}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-4">
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
                    value={fechaDesde}
                    onChange={(event) => setFechaDesde(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/5 px-4 py-3 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Hasta</label>
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(event) => setFechaHasta(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/5 px-4 py-3 text-sm text-slate-900"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm text-zinc-500">Filtro rápido</p>
              <h2 className="text-xl font-semibold text-slate-900">{selectedTitle}</h2>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-pink-100 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-pink-50 transition-colors"
            >
              <Filter size={16} />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Categoría</label>
                  <div className="flex flex-wrap gap-2">
                    {categorias.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategoriaSeleccionada(
                            categoriaSeleccionada === cat.id ? null : cat.id
                          );
                          setPagina(1);
                        }}
                        className={`inline-flex items-center justify-center min-h-[44px] px-4 rounded-full text-xs transition ${
                          categoriaSeleccionada === cat.id
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-pink-50'
                        }`}
                      >
                        {cat.nombre}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Cuenta</label>
                  <div className="flex flex-wrap gap-2">
                    {tiposCuenta.map((tipo) => (
                      <button
                        key={tipo.id}
                        type="button"
                        onClick={() => {
                          setTipoCuentaSeleccionado(
                            tipoCuentaSeleccionado === tipo.id ? null : tipo.id
                          );
                          setPagina(1);
                        }}
                        className={`inline-flex items-center justify-center min-h-[44px] px-4 rounded-full text-xs transition ${
                          tipoCuentaSeleccionado === tipo.id
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-pink-50'
                        }`}
                      >
                        {tipo.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs font-semibold text-slate-500">Desde</label>
                <label className="block text-xs font-semibold text-slate-500">Hasta</label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-full rounded-2xl border border-pink-100 bg-white/95 px-3 py-2 text-sm text-slate-900"
                />
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-full rounded-2xl border border-pink-100 bg-white/95 px-3 py-2 text-sm text-slate-900"
                />
              </div>
            </div>
          )}
        </Card>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar movimientos..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
            className="w-full pl-11 pr-4 py-3 bg-card border border-pink-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <div className="flex justify-between gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-white/10 rounded w-3/4"></div>
                      <div className="h-3 bg-white/5 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-white/10 rounded w-20"></div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : movimientosFiltrados.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <p className="text-2xl font-semibold text-slate-900">No hay movimientos</p>
              <p className="text-slate-500 mt-2">Cambia el filtro o agrega un movimiento para comenzar.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {movimientosFiltrados.map((item) => (
              <Card key={`${item.tipo}-${item.id}`} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{item.descripcion}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.categoria?.nombre || 'Sin categoría'}</p>
                  <p className="text-xs text-slate-500">{item.tipo_cuenta?.nombre || item.tipoCuenta?.nombre || 'Cuenta'}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${item.tipo === 'gasto' ? 'text-red-500' : 'text-green-500'}`}>
                    {item.tipo === 'gasto' ? '-' : '+'}
                    {Number(item.monto || item.total || 0).toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(item.fecha).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpenFab(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-pink flex items-center justify-center z-50 hover:shadow-lg transition-shadow md:bottom-24"
      >
        <Plus size={24} />
      </motion.button>

      <FabActions
        open={openFab}
        onClose={() => setOpenFab(false)}
        onGasto={() => {
          setOpenFab(false);
          setOpenGastoModal(true);
        }}
        onIngreso={() => {
          setOpenFab(false);
          setOpenIngresoModal(true);
        }}
      />

      <AgregarGastoModal open={openGastoModal} onClose={() => setOpenGastoModal(false)} />
      <AgregarIngresoModal open={openIngresoModal} onClose={() => setOpenIngresoModal(false)} />
    </div>
  );
}

export default MovimientosPage;
