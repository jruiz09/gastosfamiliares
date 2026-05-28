import axios from 'axios';

const clienteAxios = axios.create({

  baseURL: 'http://149.50.138.198:4000/api',

});

clienteAxios.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem('token');

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  }

);

export default clienteAxios;