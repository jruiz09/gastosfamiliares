import { useQuery } from '@tanstack/react-query';
import clienteAxios from '../../../api/clienteAxios';

const obtenerGastos = async ({
  pagina = 1,
  limite = 10,
  categoria = null,
  fechaDesde = null,
  fechaHasta = null,
  tipoCuenta = null,
  busqueda = null,
}) => {
  const params = new URLSearchParams({
    pagina,
    limite,
    ...(categoria && { categoria }),
    ...(fechaDesde && { fechaDesde }),
    ...(fechaHasta && { fechaHasta }),
    ...(tipoCuenta && { tipoCuenta }),
  });

  const { data } = await clienteAxios.get(`/gastos?${params.toString()}`);
  return data;
};

export function useGastos({
  pagina = 1,
  limite = 10,
  categoria = null,
  fechaDesde = null,
  fechaHasta = null,
  tipoCuenta = null,
  enabled = true,
} = {}) {
  return useQuery({
    queryKey: [
      'gastos',
      pagina,
      limite,
      categoria,
      fechaDesde,
      fechaHasta,
      tipoCuenta,
    ],
    queryFn: () =>
      obtenerGastos({
        pagina,
        limite,
        categoria,
        fechaDesde,
        fechaHasta,
        tipoCuenta,
      }),
    enabled,
  });
}
