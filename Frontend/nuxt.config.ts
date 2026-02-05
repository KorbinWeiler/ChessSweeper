// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='48'>💣</text></svg>`
        }
      ]
    }
  },
  vite: {
    server: {
      fs: {
        // Allow Vite to serve files from project's node_modules, workspace root,
        // and the user's global node_modules (common on Windows installs).
        allow: [
          resolve(process.cwd(), 'node_modules'),
          resolve(process.cwd(), '.'),
          // fallback to user-level node_modules (USERPROFILE on Windows or HOME on *nix)
          resolve(process.env.USERPROFILE || process.env.HOME || process.cwd(), 'node_modules')
        ]
      }
    }
  },
  build: {
        transpile: ['vuetify'],
    },
    modules: ["vuetify-nuxt-module"],
    vuetify: {
      vuetifyOptions: {
        theme: {
          defaultTheme: 'light',
          themes: {
            light: {
              dark: false,
              colors: {
                primary: '#1565C0',
                secondary: '#546E7A',
                background: '#FAFAFA',
                surface: '#FFFFFF',
              },
            },
            dark: {
              dark: true,
              colors: {
                primary: '#42A5F5',
                secondary: '#78909C',
                background: '#121212',
                surface: '#1E1E1E',
              },
            },
          },
        },
      },
    },
  runtimeConfig: {
    public: {
      SERVER_URL: 'https://chesssweeperserver-gnhgh5htaqh2ewd8.westus3-01.azurewebsites.net/'
    }
  }
})
