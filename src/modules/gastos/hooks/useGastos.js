import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  return useQuery({

    queryKey: [
      'gastos',
      usuario?.id,
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

    enabled: enabled && Boolean(usuario?.id),

    staleTime: 1000 * 60 * 5,

    placeholderData: (previousData) =>
      previousData,

    refetchOnWindowFocus: false,

  });
}

export function useEliminarGasto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => clienteAxios.delete(`/gastos/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['ultimos-gastos'] });
      queryClient.invalidateQueries({ queryKey: ['resumen-mensual'] });
      queryClient.invalidateQueries({ queryKey: ['evolucion-anual'] });
    },
  });
}