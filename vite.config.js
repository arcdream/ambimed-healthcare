import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Optional: uncomment to run dev server over HTTPS (removes "Not secure" on localhost)
// import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    // basicSsl(), // enable with: npm i -D @vitejs/plugin-basic-ssl
  ],
  // server: { https: true }, // enable with basicSsl above for https://localhost:5173
})
