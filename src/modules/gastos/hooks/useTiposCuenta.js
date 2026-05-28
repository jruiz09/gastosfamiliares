import { useQuery } from '@tanstack/react-query';

import clienteAxios from '../../../api/clienteAxios';

const obtenerTiposCuenta = async () => {

  const { data } =
    await clienteAxios.get(
      '/tipos-cuenta'
    );

  return data;

};

export function useTiposCuenta() {

  return useQuery({

    queryKey: ['tipos-cuenta'],

    queryFn: obtenerTiposCuenta,

  });

}