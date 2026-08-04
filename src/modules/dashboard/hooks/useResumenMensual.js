import { useQuery } from '@tanstack/react-query';

import clienteAxios from '../../../api/clienteAxios';

const obtenerResumen = async () => {

  const fecha = new Date();

  const anio = fecha.getFullYear();

  const mes = fecha.getMonth() + 1;

  const { data } =
    await clienteAxios.get(
      '/dashboard/resumen-mensual',
      {
        params: {
          anio,
          mes,
        }
      }
    );

  return data;

};

export function useResumenMensual() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  return useQuery({
    queryKey: ['resumen-mensual', usuario?.id],
    queryFn: obtenerResumen,
    enabled: Boolean(usuario?.id),
  });
}