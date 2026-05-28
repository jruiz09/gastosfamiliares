import { motion } from 'framer-motion';
import { Trash2, Calendar, Tag, Wallet } from 'lucide-react';
import Card from '../../../components/ui/Card';

function GastoCard({
  id,
  descripcion,
  monto,
  fecha,
  Categoria,
  TipoCuenta,
  Usuario,
  onDelete,
  index,
}) {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(monto);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Descripción */}
          <h3 className="font-semibold text-slate-900 truncate mb-2">
            {descripcion}
          </h3>

          {/* Categoría y Cuenta */}
          <div className="flex flex-wrap gap-2 mb-3">
            {Categoria && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Tag size={12} />
                {Categoria.nombre}
              </span>
            )}
            {TipoCuenta && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                <Wallet size={12} />
                {TipoCuenta.nombre}
              </span>
            )}
          </div>

          {/* Fecha y Usuario */}
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatearFecha(fecha)}
            </span>
            {Usuario && (
              <span className="text-xs text-gray-500">
                por {Usuario.nombre}
              </span>
            )}
          </div>
        </div>

        {/* Monto y Botón */}
        <div className="flex flex-col items-end gap-2">
          <span className="text-lg font-bold text-primary">
            -{formatearMonto(monto)}
          </span>
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(id)}
              className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
              aria-label="Eliminar"
            >
              <Trash2 size={16} />
            </motion.button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default GastoCard;
