import { useQuery } from '@tanstack/react-query';

import clienteAxios from '../../../api/clienteAxios';

const obtenerEvolucion = async ({ queryKey }) => {

  const [, anio, mes] = queryKey;

  const { data } =
    await clienteAxios.get(
      '/dashboard/evolucion-mensual',
      {
        params: {
          anio,
          mes,
        }
      }
    );

  return data;

};

export function useEvolucionMensual(anio, mes) {

  return useQuery({

    queryKey: ['evolucion-mensual', anio, mes],

    queryFn: obtenerEvolucion,

    enabled: Boolean(anio) && Boolean(mes),

    placeholderData: (previousData) => previousData,

  });

}
