import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({

  plugins: [

    react(),

    VitePWA({

      // TODO(UX-offline): sin `workbox.runtimeCaching` las llamadas a la API
      // (clienteAxios) no quedan cacheadas -- sin conexion la app abre pero
      // las pantallas se quedan en loading/error. Pendiente de decision
      // aparte (estrategia network-first vs stale-while-revalidate, que
      // endpoints cachear, invalidacion tras mutations).

      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png'
      ],

      devOptions: {
        enabled: true
      },

      manifest: {

        id: '/',

        name: 'Control de Gastos',

        short_name: 'Gastos',

        description:
          'Aplicación de gestión de gastos e ingresos',

        theme_color: '#0f172a',

        background_color: '#ffffff',

        display: 'standalone',

        orientation: 'portrait',

        start_url: '/',

        scope: '/',

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]

      }

    })

  ]

  
})