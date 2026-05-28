import { NavLink } from 'react-router-dom';
import { Home, CreditCard, DollarSign } from 'lucide-react';

function BottomNav() {
  const baseClass =
    'flex flex-col items-center text-xs transition-all duration-200';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark border-t border-pink-100 flex justify-around py-2 z-50 md:hidden">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${baseClass} ${
            isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'
          }`
        }
      >
        <Home size={20} />
        <span className="mt-1">Inicio</span>
      </NavLink>

      <NavLink
        to="/gastos"
        className={({ isActive }) =>
          `${baseClass} ${
            isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'
          }`
        }
      >
        <CreditCard size={20} />
        <span className="mt-1">Gastos</span>
      </NavLink>

      <NavLink
        to="/ingresos"
        className={({ isActive }) =>
          `${baseClass} ${
            isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'
          }`
        }
      >
        <DollarSign size={20} />
        <span className="mt-1">Ingresos</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;