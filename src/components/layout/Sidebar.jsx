import { NavLink, useNavigate } from 'react-router-dom';
import { Home, CreditCard, DollarSign, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';

function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors ${
      isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 hover:bg-pink-50 hover:text-primary'
    }`;

  return (

    <aside
      className="
        fixed
        left-0
        top-0
        w-[260px]
        h-screen
        bg-card
        border-r
        border-pink-100
        p-5
        flex
        flex-col
        justify-between
      "
    >

      <div>
        <h1
          className="
            text-3xl
            font-black
            text-primary
            mb-10
          "
        >
          Gastos Familiares
        </h1>

        <nav className="space-y-2">
          <NavLink to="/" end className={linkClass}>
            <Home size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/gastos" className={linkClass}>
            <CreditCard size={18} />
            Gastos
          </NavLink>
          <NavLink to="/ingresos" className={linkClass}>
            <DollarSign size={18} />
            Ingresos
          </NavLink>
        </nav>
      </div>

      <div>
        <button
          type="button"
          className="w-full rounded-2xl border border-pink-100 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white inline-flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>

    </aside>

  );

}

export default Sidebar;