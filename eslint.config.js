import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Esta regla marca como error cualquier "pedir datos al montar y guardar
      // el resultado en estado", que es exactamente como carga datos toda la
      // app (tienda, panel, pedidos). Evitarla exigiría una librería de data
      // fetching. Con la regla activa, lint devolvía 13 errores de este tipo y
      // los problemas de verdad quedaban enterrados entre el ruido.
      'react-hooks/set-state-in-effect': 'off',

      // Exportar un hook o una constante junto al componente solo degrada el
      // fast refresh en desarrollo; no es un error que deba frenar un build.
      'react-refresh/only-export-components': 'warn',
    },
  },
])
