function Card({ children, className = '' }) {

  return (

    <div
      className={`
        bg-card
        rounded-3xl
        p-5
        shadow-pink
        border
        border-pink-100
        backdrop-blur-xl
        ${className}
      `}
    >

      {children}

    </div>

  );

}

export default Card;