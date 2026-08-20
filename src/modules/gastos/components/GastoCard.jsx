import { motion } from 'framer-motion';
import {
  Trash2,
  Calendar,
  Tag,
  Wallet,
  Pencil
} from 'lucide-react';

import Card from '../../../components/ui/Card';

function GastoCard({
  id,
  descripcion,
  monto,
  fecha,
  categoria,
  tipo_cuenta,
  Usuario,
  onDelete,
  onEdit,
  index,
}) {

  const formatearFecha = (fecha) => {

    if (!fecha) return '-';

    const partes =
      fecha
        .split('T')[0]
        .split('-');

    if (partes.length !== 3) {
      return fecha;
    }

    const [anio, mes, dia] = partes;

    const fechaLocal = new Date(
      Number(anio),
      Number(mes) - 1,
      Number(dia)
    );

    return fechaLocal.toLocaleDateString(
      'es-AR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  const formatearMonto = (monto) =>
    new Intl.NumberFormat(
      'es-AR',
      {
        style: 'currency',
        currency: 'ARS',
      }
    ).format(Number(monto));

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        delay: index * 0.05
      }}
    >
      <Card className="hover:shadow-lg transition-all duration-200">

        <div className="flex justify-between items-start gap-4">

          <div className="flex-1 min-w-0">

            <h3 className="font-semibold text-slate-900 truncate mb-2">
              {descripcion || 'Sin descripción'}
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">

              {categoria && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Tag size={12} />
                  {categoria.nombre}
                </span>
              )}

              {tipo_cuenta && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                  <Wallet size={12} />
                  {tipo_cuenta.nombre}
                </span>
              )}

            </div>

            <div className="flex justify-between items-center text-xs text-gray-400">

              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatearFecha(fecha)}
              </span>

              {Usuario && (
                <span className="text-xs text-gray-500">
                  {Usuario.nombre}
                </span>
              )}

            </div>

          </div>

          <div className="flex flex-col items-end gap-2">

            <span className="text-lg font-bold text-primary whitespace-nowrap">
              -{formatearMonto(monto)}
            </span>

            <div className="flex gap-1">

              {onEdit && (
                <motion.button
                  whileHover={{
                    scale: 1.1
                  }}
                  whileTap={{
                    scale: 0.95
                  }}
                  onClick={onEdit}
                  className="p-2 rounded-full hover:bg-blue-500/10 text-blue-500 transition-colors"
                >
                  <Pencil size={16} />
                </motion.button>
              )}

              {onDelete && (
                <motion.button
                  whileHover={{
                    scale: 1.1
                  }}
                  whileTap={{
                    scale: 0.95
                  }}
                  onClick={() => onDelete(id)}
                  className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </motion.button>
              )}

            </div>

          </div>

        </div>

      </Card>
    </motion.div>
  );
}

export default GastoCard;