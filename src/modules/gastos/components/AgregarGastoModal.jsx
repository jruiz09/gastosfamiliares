import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clienteAxios from "../../../api/clienteAxios";
import { useCategorias } from "../hooks/useCategorias";
import { useTiposCuenta } from "../hooks/useTiposCuenta";

function AgregarGastoModal({
  open,
  onClose,
  gasto = null,
}) {
  const queryClient = useQueryClient();

  const { data: categorias = [] } = useCategorias();
  const { data: tiposCuenta = [] } = useTiposCuenta();

  const esEdicion = !!gasto;

  const [form, setForm] = useState({
    descripcion: "",
    monto: "",
    fecha: new Date().toISOString().split("T")[0],
    categoria_id: "",
    tipo_cuenta_id: "",
    observaciones: "",
  });

  const getInitialForm = (gastoData) => {
    if (gastoData) {
      return {
        descripcion: gastoData.descripcion || "",
        monto: gastoData.monto || "",
        fecha: gastoData.fecha
          ? gastoData.fecha.split("T")[0]
          : new Date().toISOString().split("T")[0],
        categoria_id:
          gastoData.categoria_id ||
          gastoData.Categoria?.id ||
          "",
        tipo_cuenta_id:
          gastoData.tipo_cuenta_id ||
          gastoData.TipoCuenta?.id ||
          "",
        observaciones:
          gastoData.observaciones || "",
      };
    }

    return {
      descripcion: "",
      monto: "",
      fecha: new Date().toISOString().split("T")[0],
      categoria_id: "",
      tipo_cuenta_id: "",
      observaciones: "",
    };
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(getInitialForm(gasto));
  }, [gasto, open]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (esEdicion) {
        return clienteAxios.put(
          `/gastos/${gasto.id}`,
          form
        );
      }

      return clienteAxios.post(
        "/gastos",
        form
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ultimos-gastos"],
      });

      queryClient.invalidateQueries({
        queryKey: ["resumen-mensual"],
      });

      queryClient.invalidateQueries({
        queryKey: ["evolucion-anual"],
      });

      queryClient.invalidateQueries({
        queryKey: ["gastos"],
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
        "
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-primary">
            {esEdicion
              ? "Editar gasto ✏️"
              : "Nuevo gasto 💸"}
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
                descripcion: e.target.value,
              })
            }
            className="w-full bg-slate-100 border border-pink-100 rounded-2xl px-5 py-4 outline-none text-slate-900"
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
            className="w-full bg-slate-100 border border-pink-100 rounded-2xl px-5 py-4 outline-none text-slate-900"
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
            className="w-full bg-slate-100 border border-pink-100 rounded-2xl px-5 py-4 outline-none text-slate-900"
          />

          <select
            value={form.categoria_id}
            onChange={(e) =>
              setForm({
                ...form,
                categoria_id: e.target.value,
              })
            }
            className="w-full bg-slate-100 border border-pink-100 rounded-2xl px-5 py-4 outline-none text-slate-900"
          >
            <option value="">Categoría</option>

            {categorias
              .filter((c) => c.tipo === "GASTO")
              .map((categoria) => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                  className="text-black"
                >
                  {categoria.nombre}
                </option>
              ))}
          </select>

          <select
            value={form.tipo_cuenta_id}
            onChange={(e) =>
              setForm({
                ...form,
                tipo_cuenta_id: e.target.value,
              })
            }
            className="w-full bg-slate-100 border border-pink-100 rounded-2xl px-5 py-4 outline-none text-slate-900"
          >
            <option value="">Cuenta</option>

            {tiposCuenta.map((tipo) => (
              <option
                key={tipo.id}
                value={tipo.id}
                className="text-black"
              >
                {tipo.nombre}
              </option>
            ))}
          </select>

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
            {mutation.isPending
              ? "Guardando..."
              : esEdicion
              ? "Guardar cambios"
              : "Guardar gasto"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgregarGastoModal;