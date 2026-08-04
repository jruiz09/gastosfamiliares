import { useQuery } from '@tanstack/react-query';
import clienteAxios from '../../../api/clienteAxios';

const obtenerIngresos = async ({
  pagina = 1,
  limite = 10,
  categoria = null,
  fechaDesde = null,
  fechaHasta = null,
  tipoCuenta = null,
} = {}) => {
  const params = new URLSearchParams({
    pagina,
    limite,
    ...(categoria && { categoria }),
    ...(fechaDesde && { fechaDesde }),
    ...(fechaHasta && { fechaHasta }),
    ...(tipoCuenta && { tipoCuenta }),
  });

  const { data } = await clienteAxios.get(`/ingresos?${params.toString()}`);
  return data;
};

export function useIngresos({
  pagina = 1,
  limite = 10,
  categoria = null,
  fechaDesde = null,
  fechaHasta = null,
  tipoCuenta = null,
  enabled = true,
} = {}) {
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  return useQuery({
    queryKey: [
      'ingresos',
      usuario?.id,
      pagina,
      limite,
      categoria,
      fechaDesde,
      fechaHasta,
      tipoCuenta,
    ],
    queryFn: () =>
      obtenerIngresos({
        pagina,
        limite,
        categoria,
        fechaDesde,
        fechaHasta,
        tipoCuenta,
      }),
    enabled: enabled && Boolean(usuario?.id),
  });
}
