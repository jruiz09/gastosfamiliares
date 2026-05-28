import { useQuery } from '@tanstack/react-query';

import clienteAxios from '../../../api/clienteAxios';

const obtenerUltimosGastos =
  async () => {

    const { data } =
      await clienteAxios.get(
        '/dashboard/ultimos-gastos'
      );

    return data;

  };

export function useUltimosGastos() {

  return useQuery({

    queryKey: ['ultimos-gastos'],

    queryFn: obtenerUltimosGastos,

  });

}