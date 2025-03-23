const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const auth = require('./middlewares/auth');
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
  secret: 'your_secret_key', // Cambia esto por una clave secreta segura y aleatoria
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Servir archivos estáticos (CSS, imágenes, JS) desde la carpeta public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public'))); // Simplificado

// Middleware para registrar los controladores ejecutados
app.use(logController);

// Middleware de autenticación (aplicado a todas las rutas excepto /auth)
app.use(auth);


// Monta las rutas
app.use('/', require('./routes/index'));

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).render('errors/404'); // Renderiza una vista de error 404
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  logger.error(`[EXCEPTION] ${err.message}\n${err.stack}`);
  res.status(500).render('errors/500'); // Renderiza una vista de error 500
});

// Manejo de promesas rechazadas
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`[UNHANDLED REJECTION] ${reason}`);
});

// Manejo de excepciones no capturadas
process.on('uncaughtException', (error) => {
  logger.error(`[UNCAUGHT EXCEPTION] ${error.message}\n${error.stack}`);
  process.exit(1);
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
