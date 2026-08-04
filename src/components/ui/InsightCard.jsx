import { motion } from 'framer-motion';

function InsightCard({
  title,
  value,
  hint,
  icon,
  accent = 'primary',
  onClick,
}) {

  const colors = {
    primary: {
      bg: 'from-pink-500 to-fuchsia-500',
      icon: 'bg-pink-100 text-pink-600',
    },
    success: {
      bg: 'from-emerald-500 to-green-500',
      icon: 'bg-emerald-100 text-emerald-600',
    },
    danger: {
      bg: 'from-red-500 to-rose-500',
      icon: 'bg-red-100 text-red-600',
    },
  };

  const color =
    colors[accent] ||
    colors.primary;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      transition={{
        duration: 0.15,
      }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          bg-white
          border
          border-pink-100
          shadow-lg
          p-6
        "
      >

        <div
          className={`
            absolute
            top-0
            left-0
            right-0
            h-1.5
            bg-gradient-to-r
            ${color.bg}
          `}
        />

        <div className="flex justify-between items-start">

          <div>

            <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
              {title}
            </p>

            <h2 className="text-4xl font-black mt-3 leading-none">
              {value}
            </h2>

            {hint && (
              <p className="text-sm text-zinc-500 mt-4">
                {hint}
              </p>
            )}

          </div>

          <div
            className={`
              w-14
              h-14
              rounded-2xl
              flex
              items-center
              justify-center
              ${color.icon}
            `}
          >
            {icon}
          </div>

        </div>

      </div>
    </motion.div>
  );

}

export default InsightCard;