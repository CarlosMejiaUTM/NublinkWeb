// FileName: tailwind.config.js
// Path: tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Revisa el HTML principal
    "./src/**/*.{js,ts,jsx,tsx}", // Revisa TODOS los archivos de React
  ],
  theme: {
    extend: {
      // Tu paleta de colores (asegúrate que los HEX sean correctos)
      colors: {
        'primary': '#4B43B3', // Ajusta si es necesario
        'primary-dark': '#3A318A', // Ajusta si es necesario
        'primary-light': '#E0E7FF', // Ajusta si es necesario
        'secondary': '#F4F6F8', // Ajusta si es necesario
        'secondary-light': '#EAEFFB', // Ajusta si es necesario
        'text-main': '#1A1A1A', // Ajusta si es necesario
        'text-muted': '#6B7281', // Ajusta si es necesario
        'bg-base': '#F4F6F8', // Ajusta si es necesario
        'line-light': '#E5E7EB', // Ajusta si es necesario
        'surface': '#FFFFFF',
      },
      // Tu tipografía
      fontFamily: {
        sans: ['Public Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}