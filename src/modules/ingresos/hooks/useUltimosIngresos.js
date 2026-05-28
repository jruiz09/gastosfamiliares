import { useQuery } from '@tanstack/react-query';

import clienteAxios from '../../../api/clienteAxios';

const obtenerUltimosIngresos =
  async () => {

    const { data } =
      await clienteAxios.get(
        '/dashboard/ultimos-ingresos'
      );

    return data;

  };

export function useUltimosIngresos() {

  return useQuery({

    queryKey: ['ultimos-ingresos'],

    queryFn: obtenerUltimosIngresos,

  });

}