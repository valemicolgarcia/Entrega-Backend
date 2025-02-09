/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.handlebars",  // Escanea todas las vistas Handlebars
    "./src/public/**/*.js",        // Opcional, para escanear JavaScript
  ],
  theme: {
    extend: {}, // Aquí puedes personalizar el tema
  },
  plugins: [],
};
