import {
  ArrowDownCircle,
  ArrowUpCircle,
  X,
} from 'lucide-react';

import { motion } from 'framer-motion';

function FabActions({
  open,
  onClose,
  onGasto,
  onIngreso,
}) {

  if (!open) return null;

  return (

    <div
      className="
        fixed
        inset-0
        bg-slate-900/10
        backdrop-blur-sm
        z-[120]
        flex
        items-end
        justify-center
      "
    >

      <motion.div

        initial={{
          y: 300
        }}

        animate={{
          y: 0
        }}

        exit={{
          y: 300
        }}

        className="
          w-full
          bg-card
          rounded-t-[40px]
          p-6
          border-t
          border-pink-100
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
            ¿Qué querés cargar?
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        {/* ACTIONS */}

        <div className="space-y-4">

          {/* GASTO */}

          <button

            onClick={onGasto}

            className="
              w-full
              flex
              items-center
              gap-4
              bg-red-500/10
              border
              border-red-500/20
              p-5
              rounded-3xl
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-red-500/20
                flex
                items-center
                justify-center
              "
            >

              <ArrowDownCircle
                className="
                  text-red-400
                "
              />

            </div>

            <div className="text-left">

              <p
                className="
                  text-lg
                  font-bold
                "
              >
                Nuevo gasto
              </p>

              <p
                className="
                  text-sm
                  text-zinc-400
                "
              >
                Compras, servicios, etc
              </p>

            </div>

          </button>

          {/* INGRESO */}

          <button

            onClick={onIngreso}

            className="
              w-full
              flex
              items-center
              gap-4
              bg-green-500/10
              border
              border-green-500/20
              p-5
              rounded-3xl
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-green-500/20
                flex
                items-center
                justify-center
              "
            >

              <ArrowUpCircle
                className="
                  text-green-400
                "
              />

            </div>

            <div className="text-left">

              <p
                className="
                  text-lg
                  font-bold
                "
              >
                Nuevo ingreso
              </p>

              <p
                className="
                  text-sm
                  text-zinc-400
                "
              >
                Sueldo, extras, transferencias
              </p>

            </div>

          </button>

        </div>

      </motion.div>

    </div>

  );

}

export default FabActions;