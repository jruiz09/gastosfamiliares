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

  const params = new URLSearchParams();

  params.append('pagina', pagina);
  params.append('limite', limite);

  if (categoria) {
    params.append('categoria', categoria);
  }

  if (fechaDesde) {
    params.append('fechaDesde', fechaDesde);
  }

  if (fechaHasta) {
    params.append('fechaHasta', fechaHasta);
  }

  if (tipoCuenta) {
    params.append('tipoCuenta', tipoCuenta);
  }

  if (busqueda?.trim()) {
    params.append('busqueda', busqueda.trim());
  }

  const { data } =
    await clienteAxios.get(
      `/gastos?${params.toString()}`
    );

  return data;
};

export function useGastos({
  pagina = 1,
  limite = 10,
  categoria = null,
  fechaDesde = null,
  fechaHasta = null,
  tipoCuenta = null,
  busqueda = null,
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
      busqueda,
    ],

    queryFn: () =>
      obtenerGastos({
        pagina,
        limite,
        categoria,
        fechaDesde,
        fechaHasta,
        tipoCuenta,
        busqueda,
      }),

    enabled,

    staleTime: 1000 * 60 * 5,

    placeholderData: (previousData) =>
      previousData,

    refetchOnWindowFocus: false,

  });
}