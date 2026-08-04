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
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  return useQuery({
    queryKey: ['ultimos-gastos', usuario?.id],
    queryFn: obtenerUltimosGastos,
    enabled: Boolean(usuario?.id),
  });
}