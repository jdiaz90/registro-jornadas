const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const sequelize = require('./database');

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
app.use(express.static(path.join(__dirname, 'public')));

// Monta las rutas
app.use('/', require('./routes/auth'));
app.use('/api/empleados', require('./routes/empleados'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/registros', require('./routes/registros')); // Monta la nueva ruta

// Inicia el servidor en el puerto definido o 3000 por defecto.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));