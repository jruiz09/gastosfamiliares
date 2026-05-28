import axios from 'axios';

const clienteAxios = axios.create({

  baseURL: 'https://app.cplanet.com.ar/apigastosfamiliares/api',

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