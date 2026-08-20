import { useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import useAuthStore from '../../store/authStore';
import { LogOut } from 'lucide-react';

function AppLayout({ children }) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (

    <div
      className="
        min-h-screen
        bg-dark
        text-slate-900
      "
    >

      {/* Desktop */}

      <div className="hidden md:block">

        <Sidebar />

      </div>

      {/* Mobile */}

      <div className="md:hidden fixed inset-x-0 top-0 z-50 bg-dark/95 backdrop-blur-xl border-b border-pink-100">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-pink-500 font-semibold">
                Gastos Familiares
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-slate-900 shadow-sm shadow-slate-200 transition hover:bg-slate-100 active:scale-95"
              aria-label="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}

      <main
        className="
          md:ml-[260px]
          px-4
          py-4
          pt-[128px]
          pb-28
          md:px-5
          md:pt-5
        "
      >

        {children}

      </main>

      <BottomNav />

    </div>

  );

}

export default AppLayout;