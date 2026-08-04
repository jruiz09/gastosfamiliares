import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import clienteAxios from '../api/clienteAxios';

import useAuthStore from '../store/authStore';

function LoginPage() {
const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loginStore = useAuthStore(
    (state) => state.login
  );

  const [usuario, setUsuario] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      setError('');

      const { data } =
        await clienteAxios.post(
          '/auth/login',
          {
            usuario,
            password,
          }
        );

      loginStore(
        data.usuario,
        data.token
      );

      queryClient.clear();
      navigate('/');
    } catch (error) {

      setError(
        error?.response?.data?.mensaje
        || 'Error login'
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      className="
        min-h-screen
        bg-dark
        flex
        items-center
        justify-center
        p-5
        relative
        overflow-hidden
      "
    >

      {/* Glow fondo */}

      <div
        className="
          absolute
          w-[500px]
          h-[500px]
          bg-primary/20
          blur-[120px]
          rounded-full
          top-[-150px]
          right-[-100px]
        "
      />

      {/* Card */}

      <div
        className="
          w-full
          max-w-md
          bg-card/80
          backdrop-blur-xl
          rounded-[40px]
          p-8
          border
          border-pink-100
          shadow-pink
          relative
          z-10
        "
      >

        {/* Animal print sutil */}

        <div
          className="
            absolute
            inset-0
            opacity-5
            bg-[radial-gradient(#ec4899_1px,transparent_1px)]
            [background-size:16px_16px]
            rounded-[40px]
          "
        />

        <div className="relative z-10">

          <h1
            className="
              text-4xl
              font-black
              text-primary
              mb-2
            "
          >
            Gastos Familiares 
          </h1>

          <p className="text-zinc-400 mb-8">
            Tus gastos familiares 💸 
          </p>

          {/* ERROR */}

          {
            error && (

              <div
                className="
                  bg-red-500/20
                  border
                  border-red-500/30
                  text-red-300
                  p-3
                  rounded-2xl
                  mb-5
                "
              >
                {error}
              </div>

            )
          }

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) =>
                setUsuario(e.target.value)
              }
              className="
                w-full
                bg-slate-100
                border
                border-pink-100
                rounded-2xl
                px-5
                py-4
                outline-none
                text-slate-900
                placeholder-slate-400
                focus:border-primary
                transition-all
              "
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full
                bg-slate-100
                border
                border-pink-100
                rounded-2xl
                px-5
                py-4
                outline-none
                text-slate-900
                placeholder-slate-400
                focus:border-primary
                transition-all
              "
            />

            <button
              disabled={loading}
              className="
                w-full
                bg-primary
                hover:bg-pink-500
                transition-all
                rounded-2xl
                py-4
                font-bold
                text-lg
                shadow-pink
              "
            >

              {
                loading
                  ? 'Ingresando...'
                  : 'Ingresar'
              }

            </button>

          </form>

        </div>

      </div>

    </div>

  );

}

export default LoginPage;