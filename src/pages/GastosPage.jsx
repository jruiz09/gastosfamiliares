import { useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useGastos } from '../modules/gastos/hooks/useGastos';
import { useCategorias } from '../modules/gastos/hooks/useCategorias';
import { useTiposCuenta } from '../modules/gastos/hooks/useTiposCuenta';
import GastoCard from '../modules/gastos/components/GastoCard';
import Card from '../components/ui/Card';
import AgregarGastoModal from '../modules/gastos/components/AgregarGastoModal';
import FabActions from '../components/ui/FabActions';

function GastosPage() {
  const location = useLocation();
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [openFab, setOpenFab] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [gastoSeleccionado, setGastoSeleccionado] = useState(null);

  // Filtros
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [tipoCuentaSeleccionado, setTipoCuentaSeleccionado] = useState(null);
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [viewMode, setViewMode] = useState(location.state?.viewMode || 'year');
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(location.state?.selectedYear || currentYear);
  const [selectedMonth, setSelectedMonth] = useState(location.state?.selectedMonth || currentMonth);
  const [fechaInicio, setFechaInicio] = useState(location.state?.fechaInicio || null);
  const [fechaFin, setFechaFin] = useState(location.state?.fechaFin || null);



  const handleEditarGasto = (gasto) => {
  setGastoSeleccionado(gasto);
  setOpenModal(true);
};
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

  // Queries
  const { data: gastos, isLoading } = useGastos({
    pagina,
    limite: 15,
    categoria: categoriaSeleccionada,
    tipoCuenta: tipoCuentaSeleccionado,
    fechaDesde: fechaFiltro.fechaDesde,
    fechaHasta: fechaFiltro.fechaHasta,
  });

  const { data: categorias = [] } = useCategorias();
  const { data: tiposCuenta = [] } = useTiposCuenta();

  // Filtrar gastos localmente por búsqueda
  const gastosFiltrados = gastos?.resultados?.filter((gasto) =>
    gasto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  ) || [];

  const handleLimpiarFiltros = useCallback(() => {
    setBusqueda('');
    setCategoriaSeleccionada(null);
    setTipoCuentaSeleccionado(null);
    setFechaDesde(null);
    setFechaHasta(null);
    setViewMode('year');
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setPagina(1);
  }, [currentMonth, currentYear]);

  const tieneFiltrosActivos =
    busqueda ||
    categoriaSeleccionada ||
    tipoCuentaSeleccionado ||
    fechaDesde ||
    fechaHasta;

  // Skeleton Loading
  const SkeletonCard = () => (
    <div className="animate-pulse">
      <Card>
        <div className="flex justify-between gap-3">
          <div className="flex-1">
            <div className="h-4 bg-white/10 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-white/5 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-white/5 rounded w-2/3"></div>
          </div>
          <div className="h-6 bg-white/10 rounded w-20"></div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-dark/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="p-4 max-w-md mx-auto">
          {/* Título */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-slate-900 mb-0">Gastos</h1>
            <button
              onClick={() => {
  setGastoSeleccionado(null);
  setOpenModal(true);
}}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-white shadow-pink hover:bg-pink-500 transition-colors text-sm font-semibold"
            >
              + Nuevo gasto
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

          {/* Búsqueda */}
          <div className="relative mt-4 mb-3">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Buscar gastos..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-card border border-pink-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Botón Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium"
          >
            <Filter size={16} />
            Filtros
            {tieneFiltrosActivos && (
              <span className="ml-auto bg-primary text-white text-xs px-2 py-1 rounded-full">
                {[
                  busqueda,
                  categoriaSeleccionada,
                  tipoCuentaSeleccionado,
                  fechaDesde,
                  fechaHasta,
                ].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Panel de Filtros */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card/50 backdrop-blur border-b border-white/5"
        >
          <div className="p-4 max-w-md mx-auto space-y-3">
            {/* Categoría */}
            {categorias.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Categoría
                </label>
                <div className="flex flex-wrap gap-2">
                  {categorias.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoriaSeleccionada(
                          categoriaSeleccionada === cat.id ? null : cat.id
                        );
                        setPagina(1);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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
            )}

            {/* Tipo de Cuenta */}
            {tiposCuenta.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Cuenta
                </label>
                <div className="flex flex-wrap gap-2">
                  {tiposCuenta.map((tipo) => (
                    <button
                      key={tipo.id}
                      onClick={() => {
                        setTipoCuentaSeleccionado(
                          tipoCuentaSeleccionado === tipo.id ? null : tipo.id
                        );
                        setPagina(1);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        tipoCuentaSeleccionado === tipo.id
                          ? 'bg-secondary text-slate-900'
                          : 'bg-slate-100 text-slate-600 hover:bg-pink-50'
                      }`}
                    >
                      {tipo.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaDesde || ''}
                  onChange={(e) => {
                    setFechaDesde(e.target.value || null);
                    setPagina(1);
                  }}
                  className="w-full px-3 py-2 bg-card border border-pink-100 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaHasta || ''}
                  onChange={(e) => {
                    setFechaHasta(e.target.value || null);
                    setPagina(1);
                  }}
                  className="w-full px-3 py-2 bg-card border border-pink-100 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Botón Limpiar */}
            {tieneFiltrosActivos && (
              <button
                onClick={handleLimpiarFiltros}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors"
              >
                <X size={14} />
                Limpiar filtros
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Contenido Principal */}
      <div className="p-4 max-w-md mx-auto">
        {isLoading ? (
          // Loading State
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : gastosFiltrados.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-20 text-center"
          >
            <div className="text-6xl mb-4">💸</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {busqueda ? 'No hay gastos que coincidan' : 'Sin gastos registrados'}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {busqueda
                ? `Intenta cambiar tu búsqueda: "${busqueda}"`
                : 'Comienza a registrar tus gastos'}
            </p>
            {tieneFiltrosActivos && (
              <button
                onClick={handleLimpiarFiltros}
                className="px-6 py-2.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </motion.div>
        ) : (
          <>
            {/* Lista de Gastos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
             {gastosFiltrados.map((gasto, index) => (
  <GastoCard
    key={gasto.id}
    {...gasto}
    Usuario={gasto.usuario}
    index={index}
    onEdit={() => handleEditarGasto(gasto)}
  />
))}
            </motion.div>

            {/* Información de Paginación */}
            {gastos?.totalPaginas > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-between"
              >
                <button
                  onClick={() => setPagina(Math.max(1, pagina - 1))}
                  disabled={pagina === 1}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-pink-50 text-slate-500 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="text-sm text-slate-500">
                  Página{' '}
                  <span className="text-slate-900 font-semibold">{pagina}</span> de{' '}
                  <span className="text-slate-900 font-semibold">
                    {gastos?.totalPaginas || 1}
                  </span>
                </span>

                <button
                  onClick={() =>
                    setPagina(
                      Math.min(gastos?.totalPaginas, pagina + 1)
                    )
                  }
                  disabled={pagina >= gastos?.totalPaginas}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-pink-50 text-slate-500 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {/* Resumen */}
            {gastosFiltrados.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
              >
                <Card className="bg-primary/5 border-primary/20">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Total mostrado</p>
                    <p className="text-2xl font-bold text-primary">
                      -{new Intl.NumberFormat('es-AR', {
                        style: 'currency',
                        currency: 'ARS',
                      }).format(
                        gastosFiltrados.reduce((sum, g) => sum + Number(g.monto), 0)
                      )}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* FAB - Botón Agregar */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpenFab(true)}
        className="fixed bottom-28 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-pink flex items-center justify-center z-50 hover:shadow-lg transition-shadow md:bottom-24"
      >
        <Plus size={24} />
      </motion.button>

      {/* FAB Menu */}
      <FabActions
        open={openFab}
        onClose={() => setOpenFab(false)}
        onGasto={() => {
          setOpenFab(false);
          setOpenModal(true);
        }}
        onIngreso={() => {
          setOpenFab(false);
          // TODO: Agregar modal de ingresos
        }}
      />

      {/* Modal Agregar Gasto */}
  <AgregarGastoModal
  open={openModal}
  gasto={gastoSeleccionado}
  onClose={() => {
    setOpenModal(false);
    setGastoSeleccionado(null);
  }}
/>
    </div>
  );
}

export default GastosPage;
