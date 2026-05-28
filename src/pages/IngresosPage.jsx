import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, Filter } from 'lucide-react';

import Card from '../components/ui/Card';
import AgregarIngresoModal from '../modules/ingresos/components/AgregarIngresoModal';
import { useIngresos } from '../modules/ingresos/hooks/useIngresos';
import { useCategorias } from '../modules/gastos/hooks/useCategorias';
import { useTiposCuenta } from '../modules/gastos/hooks/useTiposCuenta';

function IngresosPage() {
  const location = useLocation();
  const [busqueda, setBusqueda] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState(location.state?.viewMode || 'year');
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(location.state?.selectedYear || currentYear);
  const [selectedMonth, setSelectedMonth] = useState(location.state?.selectedMonth || currentMonth);
  const [fechaInicio, setFechaInicio] = useState(location.state?.fechaInicio || null);
  const [fechaFin, setFechaFin] = useState(location.state?.fechaFin || null);
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
      fechaDesde: fechaInicio,
      fechaHasta: fechaFin,
    };
  }, [viewMode, selectedYear, selectedMonth, fechaInicio, fechaFin]);

  const { data: ingresosData = { resultados: [] }, isLoading } = useIngresos({
    pagina: 1,
    limite: 50,
    categoria: categoriaSeleccionada,
    tipoCuenta: tipoCuentaSeleccionado,
    fechaDesde: fechaFiltro.fechaDesde,
    fechaHasta: fechaFiltro.fechaHasta,
  });

  const ingresosFiltrados = ingresosData.resultados?.filter((ingreso) =>
    ingreso.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  ) || [];

  const SkeletonItem = () => (
    <div className="animate-pulse">
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="h-4 rounded bg-slate-200 w-3/4" />
            <div className="h-3 rounded bg-slate-200 w-1/2" />
          </div>
          <div className="h-6 w-20 rounded bg-slate-200" />
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark pb-20">
      <AgregarIngresoModal open={openModal} onClose={() => setOpenModal(false)} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-dark/80 backdrop-blur-xl border-b border-pink-100"
      >
        <div className="p-4 max-w-md mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Ingresos</h1>
              <p className="text-slate-500">Registra y revisa tus ingresos recientes.</p>
            </div>

            <button
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-white shadow-pink hover:bg-pink-500 transition-colors"
            >
              <Plus size={18} />
              Nuevo ingreso
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
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full rounded-2xl border border-zinc-200 bg-white/5 px-4 py-3 text-sm text-slate-900"
              >
                {Array.from({ length: 5 }, (_, index) => currentYear - index).map((year) => (
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
                  {[
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
                  ].map((mes) => (
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
                    value={fechaInicio || ''}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/5 px-4 py-3 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Hasta</label>
                  <input
                    type="date"
                    value={fechaFin || ''}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white/5 px-4 py-3 text-sm text-slate-900"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar ingresos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-pink-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-2xl border border-pink-100 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-pink-50 transition-colors"
            >
              <Filter size={16} />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 rounded-3xl border border-pink-100 bg-white/10 p-4">
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
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs transition ${
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
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs transition ${
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
            </div>
          )}
        </div>
      </motion.div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </div>
        ) : ingresosFiltrados.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <p className="text-2xl font-semibold text-slate-900">No hay ingresos aún</p>
              <p className="text-slate-500 mt-2">Agrega tu primer ingreso para comenzar a ver tu historial.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {ingresosFiltrados.map((ingreso) => (
              <Card key={ingreso.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{ingreso.descripcion}</p>
                  <p className="text-xs text-slate-500 mt-1">{ingreso.categoria?.nombre || 'Sin categoría'}</p>
                  <p className="text-xs text-slate-500">{ingreso.tipo_cuenta?.nombre || 'Cuenta'}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-green-500">
                    +{Number(ingreso.monto).toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(ingreso.fecha).toLocaleDateString('es-AR', {
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
    </div>
  );
}

export default IngresosPage;
