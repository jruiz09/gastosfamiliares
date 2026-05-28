import { useState } from 'react';

import { X } from 'lucide-react';

import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

import clienteAxios from '../../../api/clienteAxios';

import {
  useCategorias
} from '../../gastos/hooks/useCategorias';

import {
  useTiposCuenta
} from '../../gastos/hooks/useTiposCuenta';

function AgregarIngresoModal({
  open,
  onClose
}) {

  const queryClient =
    useQueryClient();

  const {
    data: categorias = []
  } = useCategorias();

  const {
    data: tiposCuenta = []
  } = useTiposCuenta();

  const [form, setForm] =
    useState({

      descripcion: '',

      monto: '',

      fecha:
        new Date()
          .toISOString()
          .split('T')[0],

      categoria_id: '',

      tipo_cuenta_id: '',

      observaciones: '',

    });

  const mutation = useMutation({

    mutationFn: async () => {

      await clienteAxios.post(
        '/ingresos',
        form
      );

    },

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ['resumen-mensual']
      });

      queryClient.invalidateQueries({
        queryKey: ['evolucion-anual']
      });

      queryClient.invalidateQueries({
        queryKey: ['ultimos-ingresos']
      });

      onClose();

    }

  });

  if (!open) return null;

  return (

    <div
      className="
        fixed
        inset-0
        bg-slate-900/10
        backdrop-blur-sm
        z-[100]
        flex
        items-end
        md:items-center
        justify-center
      "
    >

      <div
        className="
          w-full
          md:max-w-lg
          bg-card
          rounded-t-[40px]
          md:rounded-[40px]
          p-6
          border
          border-pink-100
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <h2
            className="
              text-2xl
              font-black
              text-green-400
            "
          >
            Nuevo ingreso 💚
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="space-y-4">

          <input
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) =>
              setForm({
                ...form,
                descripcion:
                  e.target.value
              })
            }
            className="
              w-full
              bg-slate-100
              border
              border-pink-100
              rounded-2xl
              px-5
              py-4
              outline-none
              text-slate-900
              placeholder-slate-400
            "
          />

          <input
            type="number"
            placeholder="Monto"
            value={form.monto}
            onChange={(e) =>
              setForm({
                ...form,
                monto:
                  e.target.value
              })
            }
            className="
              w-full
              bg-slate-100
              border
              border-pink-100
              rounded-2xl
              px-5
              py-4
              outline-none
              text-slate-900
              placeholder-slate-400
            "
          />

          <input
            type="date"
            value={form.fecha}
            onChange={(e) =>
              setForm({
                ...form,
                fecha:
                  e.target.value
              })
            }
            className="
              w-full
              bg-slate-100
              border
              border-pink-100
              rounded-2xl
              px-5
              py-4
              outline-none
              text-slate-900
            "
          />

          {/* CATEGORIA */}

          <select
            value={form.categoria_id}
            onChange={(e) =>
              setForm({
                ...form,
                categoria_id:
                  e.target.value
              })
            }
            className="
              w-full
              bg-slate-100
              border
              border-pink-100
              rounded-2xl
              px-5
              py-4
              outline-none
              text-slate-900
            "
          >

            <option value="">
              Categoría
            </option>

            {
              categorias
                .filter(
                  (c) =>
                    c.tipo === 'INGRESO'
                )
                .map((categoria) => (

                  <option
                    key={categoria.id}
                    value={categoria.id}
                    className="text-black"
                  >
                    {categoria.nombre}
                  </option>

                ))
            }

          </select>

          {/* CUENTA */}

          <select
            value={form.tipo_cuenta_id}
            onChange={(e) =>
              setForm({
                ...form,
                tipo_cuenta_id:
                  e.target.value
              })
            }
            className="
              w-full
              bg-slate-100
              border
              border-pink-100
              rounded-2xl
              px-5
              py-4
              outline-none
              text-slate-900
            "
          >

            <option value="">
              Cuenta
            </option>

            {
              tiposCuenta.map((tipo) => (

                <option
                  key={tipo.id}
                  value={tipo.id}
                  className="text-black"
                >
                  {tipo.nombre}
                </option>

              ))
            }

          </select>

          <button
            onClick={() =>
              mutation.mutate()
            }
            disabled={mutation.isPending}
            className="
              w-full
              bg-green-500
              rounded-2xl
              py-4
              font-bold
              text-lg
              mt-5
            "
          >

            {
              mutation.isPending
                ? 'Guardando...'
                : 'Guardar ingreso'
            }

          </button>

        </div>

      </div>

    </div>

  );

}

export default AgregarIngresoModal;