// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
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

    },
})
