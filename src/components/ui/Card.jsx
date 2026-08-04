import { motion } from 'framer-motion';

function Card({

  children,

  className = '',

  hover = true,

}) {

  return (

    <motion.div

      whileHover={
        hover
          ? {
              y: -3,
              scale: 1.01,
            }
          : {}
      }

      transition={{
        duration: 0.18,
      }}

      className={`
        relative
        overflow-hidden

        rounded-[28px]

        bg-white

        border
        border-zinc-100

        shadow-[0_12px_40px_rgba(15,23,42,0.06)]

        p-5

        ${className}
      `}
    >

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[3px]
          bg-gradient-to-r
          from-pink-500
          via-fuchsia-500
          to-violet-500
        "
      />

      {children}

    </motion.div>

  );

}

export default Card;