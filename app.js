const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const sequelize = require('./database');
const verificarToken = require('./middlewares/verificarToken');
const requireAuth = require('./middlewares/requireAuth');
const logController = require('./middlewares/logController');
const logger = require('./utils/logger');

const app = express();

// Configura EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para parsear formularios, JSON y cookies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key', // Cambia esto por una clave secreta segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Servir archivos estáticos (CSS, imágenes, JS) desde la carpeta public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));

// Middleware para verificar el token y establecer req.empleado
app.use(verificarToken);

// Middleware para redirigir a login si no está autenticado
app.use(requireAuth);

// Middleware para registrar los controladores ejecutados
app.use(logController);

// Monta las rutas
app.use('/', require('./routes/index')); // Monta el archivo de rutas principal

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  if (!req.empleado) {
    // Si el usuario no está autenticado, redirigir al login
    return res.redirect('/auth/login');
  }

  // Si el usuario está autenticado, redirigir al dashboard
  res.redirect('/dashboard');
});

// Middleware para manejar errores globales
app.use((err, req, res, next) => {
  const now = new Date();
  const localTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // Ajuste de +1 hora

  logger.error(`[EXCEPTION] [${localTime}] ${err.message}`);
  logger.error(`[STACK TRACE] ${err.stack}`);

  res.status(500).send('Ocurrió un error inesperado. Por favor, inténtalo más tarde.');
});

process.on('unhandledRejection', (reason, promise) => {
  const now = new Date();
  const localTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // Ajuste de +1 hora

  logger.error(`[UNHANDLED REJECTION] [${localTime}] ${reason}`);
});

process.on('uncaughtException', (error) => {
  const now = new Date();
  const localTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // Ajuste de +1 hora

  logger.error(`[UNCAUGHT EXCEPTION] [${localTime}] ${error.message}`);
  logger.error(`[STACK TRACE] ${error.stack}`);
  process.exit(1); // Salir del proceso después de registrar la excepción
});

// Inicia el servidor en el puerto definido o 3000 por defecto.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));