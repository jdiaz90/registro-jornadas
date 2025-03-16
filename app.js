const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
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

// Servir archivos estáticos (CSS, imágenes, JS) desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Monta las rutas
app.use('/', require('./routes/auth'));
app.use('/api/empleados', require('./routes/empleados'));
app.use('/dashboard', require('./routes/dashboard'));

// Inicia el servidor en el puerto definido o 3000 por defecto.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));