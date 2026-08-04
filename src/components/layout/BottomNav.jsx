import { NavLink } from 'react-router-dom';
import { Home, CreditCard, DollarSign, BarChart3 } from 'lucide-react';

function BottomNav() {
  const baseClass =
    'flex min-w-[72px] flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium transition-all duration-200 active:scale-95';

  return (
    <nav className="fixed bottom-2 left-2 right-2 rounded-[24px] border border-pink-100/70 bg-dark/95 px-2 py-2 z-50 md:hidden shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${baseClass} ${
            isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-primary'
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
            isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-primary'
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
            isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-primary'
          }`
        }
      >
        <DollarSign size={20} />
        <span className="mt-1">Ingresos</span>
      </NavLink>

      <NavLink
        to="/reportes"
        className={({ isActive }) =>
          `${baseClass} ${
            isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-primary'
          }`
        }
      >
        <BarChart3 size={20} />
        <span className="mt-1">Informes</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;