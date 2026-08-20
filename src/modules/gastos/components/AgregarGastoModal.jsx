import { useEffect } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clienteAxios from "../../../api/clienteAxios";
import { useCategorias } from "../hooks/useCategorias";
import { useTiposCuenta } from "../hooks/useTiposCuenta";

const gastoSchema = z.object({
  descripcion: z
    .string()
    .trim()
    .min(1, "Ingresá una descripción"),
  monto: z.coerce
    .number({ invalid_type_error: "Ingresá un monto" })
    .positive("El monto debe ser mayor a 0"),
  fecha: z.string().min(1, "Elegí una fecha"),
  categoria_id: z.string().optional(),
  tipo_cuenta_id: z.string().optional(),
  observaciones: z.string().optional(),
});

function getInitialForm(gastoData) {
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
}

function AgregarGastoModal({
  open,
  onClose,
  gasto = null,
}) {
  const queryClient = useQueryClient();

  const { data: categorias = [] } = useCategorias();
  const { data: tiposCuenta = [] } = useTiposCuenta();

  const esEdicion = !!gasto;

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(gastoSchema),
    mode: "onChange",
    defaultValues: getInitialForm(gasto),
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(getInitialForm(gasto));
    trigger();
  }, [gasto, open, reset, trigger]);

  const mutation = useMutation({
    mutationFn: async (form) => {
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

    onError: () => {
      // El mensaje se muestra leyendo mutation.isError / mutation.error abajo.
    },
  });

  if (!open) return null;

  const errorMessage = mutation.isError
    ? mutation.error?.response?.data?.mensaje ||
      "No pudimos guardar el gasto. Probá de nuevo."
    : null;

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

          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 mb-4 text-sm">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4"
        >
          <div>
            <input
              placeholder="Descripción"
              {...register("descripcion")}
              className="w-full bg-slate-100 border border-pink-100 rounded-2xl px-5 py-4 outline-none text-slate-900"
            />
            {errors.descripcion && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Monto"
              {...register("monto")}
              className="w-full bg-slate-100 border border-pink-100 rounded-2xl px-5 py-4 outline-none text-slate-900"
            />
            {errors.monto && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.monto.message}
              </p>
            )}
          </div>

          <input
            type="date"
            {...register("fecha")}
            className="w-full bg-slate-100 border border-pink-100 rounded-2xl px-5 py-4 outline-none text-slate-900"
          />

          <select
            {...register("categoria_id")}
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
            {...register("tipo_cuenta_id")}
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
            type="submit"
            disabled={mutation.isPending || !isValid}
            className="
              w-full
              bg-primary
              rounded-2xl
              py-4
              font-bold
              text-lg
              mt-5
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {mutation.isPending
              ? "Guardando..."
              : esEdicion
              ? "Guardar cambios"
              : "Guardar gasto"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AgregarGastoModal;
