import { useQuery } from '@tanstack/react-query';

import clienteAxios from '../../../api/clienteAxios';

const obtenerEvolucion = async ({ queryKey }) => {

  const [, fechaInicio, fechaFin] = queryKey;

  const { data } =
    await clienteAxios.get(
      '/dashboard/evolucion-rango',
      {
        params: {
          fechaInicio,
          fechaFin,
        }
      }
    );

  return data;

};

export function useEvolucionRango(fechaInicio, fechaFin) {

  return useQuery({

    queryKey: ['evolucion-rango', fechaInicio, fechaFin],

    queryFn: obtenerEvolucion,

    enabled: Boolean(fechaInicio) && Boolean(fechaFin),

    placeholderData: (previousData) => previousData,

  });

}
