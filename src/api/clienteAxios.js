import axios from 'axios';
import useAuthStore from '../store/authStore';

const clienteAxios = axios.create({
  baseURL: 'https://app.cplanet.com.ar/apigastosfamiliares/api',
});

clienteAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

clienteAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      window.location.replace('/login');
    }

    return Promise.reject(error);
  }
);

export default clienteAxios;