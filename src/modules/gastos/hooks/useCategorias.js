import { useQuery } from '@tanstack/react-query';

import clienteAxios from '../../../api/clienteAxios';

const obtenerCategorias = async () => {

  const { data } =
    await clienteAxios.get(
      '/categorias'
    );

  return data;

};

export function useCategorias() {

  return useQuery({

    queryKey: ['categorias'],

    queryFn: obtenerCategorias,

  });

}