import { useQuery } from '@tanstack/react-query';

import clienteAxios from '../../../api/clienteAxios';

const obtenerResumenCuentas = async ({ queryKey }) => {
  const [, fechaInicio, fechaFin] = queryKey;

  const { data } = await clienteAxios.get(
    '/dashboard/resumen-cuentas',
    {
      params: {
        fechaInicio,
        fechaFin,
      },
    }
  );

  return data;
};

export function useResumenCuentas(fechaInicio, fechaFin) {
  return useQuery({
    queryKey: ['resumen-cuentas', fechaInicio, fechaFin],
    queryFn: obtenerResumenCuentas,
    enabled: Boolean(fechaInicio) && Boolean(fechaFin),
  });
}
