import { useState } from "react";

import { X } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import clienteAxios from "../../../api/clienteAxios";

import { useCategorias } from "../hooks/useCategorias";

import { useTiposCuenta } from "../hooks/useTiposCuenta";

function AgregarGastoModal({ open, onClose }) {
  const queryClient = useQueryClient();

  const { data: categorias = [] } = useCategorias();

  const { data: tiposCuenta = [] } = useTiposCuenta();

  const [form, setForm] = useState({
    descripcion: "",

    monto: "",

    fecha: new Date().toISOString().split("T")[0],

    categoria_id: "",

    tipo_cuenta_id: "",

    observaciones: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      await clienteAxios.post("/gastos", form);
    },

    onSuccess: () => {

        queryClient.invalidateQueries({
  queryKey: ['ultimos-gastos']
});
      queryClient.invalidateQueries({
        queryKey: ["resumen-mensual"],
      });

      queryClient.invalidateQueries({
        queryKey: ["evolucion-anual"],
      });

      onClose();
    },
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
          animate-in
        "
      >
        {/* HEADER */}

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
              text-primary
            "
          >
            Nuevo gasto 💸
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* FORM */}

        <div className="space-y-4">
          <input
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) =>
              setForm({
                ...form,
                descripcion: e.target.value,
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
                monto: e.target.value,
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
                fecha: e.target.value,
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
                categoria_id: e.target.value,
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
            <option value="">Categoría</option>

            {categorias
              .filter((c) => c.tipo === "GASTO")
              .map((categoria) => (
                <option key={categoria.id} value={categoria.id} 
  className="text-black">
                  {categoria.nombre}
                </option>
              ))}
          </select>

          {/* TIPO CUENTA */}

          <select
            value={form.tipo_cuenta_id}
            onChange={(e) =>
              setForm({
                ...form,
                tipo_cuenta_id: e.target.value,
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
          >
            <option value="">Cuenta</option>

            {tiposCuenta.map((tipo) => (
              <option key={tipo.id} value={tipo.id} 
  className="text-black">
                {tipo.nombre}
              </option>
            ))}
          </select>

          {/* BOTON */}

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="
              w-full
              bg-primary
              rounded-2xl
              py-4
              font-bold
              text-lg
              mt-5
            "
          >
            {mutation.isPending ? "Guardando..." : "Guardar gasto"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgregarGastoModal;
