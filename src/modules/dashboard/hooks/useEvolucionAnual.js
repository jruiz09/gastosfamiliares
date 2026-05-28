import { useQuery } from '@tanstack/react-query';

import clienteAxios from '../../../api/clienteAxios';

const obtenerEvolucion = async ({ queryKey }) => {

  const [, anio] = queryKey;

  const { data } =
    await clienteAxios.get(
      '/dashboard/evolucion-anual',
      {
        params: {
          anio,
        }
      }
    );

  return data;

};

export function useEvolucionAnual(anio) {

  return useQuery({

    queryKey: ['evolucion-anual', anio],

    queryFn: obtenerEvolucion,

    enabled: Boolean(anio),

  });

}