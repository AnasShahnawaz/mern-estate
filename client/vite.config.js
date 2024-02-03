import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://mern-estate-server-phi.vercel.app',
        secure: true,
      },
    },
  },
  plugins: [react()],
});
