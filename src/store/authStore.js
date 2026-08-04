import { create } from 'zustand';

const readStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { usuario: null, token: null };
  }

  try {
    return {
      usuario: JSON.parse(localStorage.getItem('usuario') || 'null'),
      token: localStorage.getItem('token') || null,
    };
  } catch {
    return { usuario: null, token: null };
  }
};

const useAuthStore = create((set) => ({
  ...readStoredAuth(),

  login: (usuario, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    set({ usuario, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    set({ usuario: null, token: null });
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'token' || event.key === 'usuario') {
      const { usuario, token } = readStoredAuth();
      useAuthStore.setState({ usuario, token });
    }
  });
}

export default useAuthStore;