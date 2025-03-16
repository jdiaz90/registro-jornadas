// database/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const sequelize = new Sequelize(
  process.env.DB_NAME,         // Nombre de la base de datos
  process.env.DB_USER,         // Usuario de la base de datos
  process.env.DB_PASSWORD,     // Contraseña de la base de datos
  {
    host: process.env.DB_HOST, // Host donde se encuentra la BD
    port: process.env.DB_PORT, // Puerto en el que escucha PostgreSQL
    dialect: 'postgres',       // Dialecto de la base de datos a usar
    logging: false,            // Desactiva los logs de SQL en producción (puedes activarlos para desarrollo)
    // Configuración para trabajar en la zona horaria de Madrid
    timezone: 'Europe/Madrid', // Todas las fechas se gestionarán en esta zona horaria
    dialectOptions: {
      useUTC: false,           // Evita la conversión automática a UTC
    },
  }
);

module.exports = sequelize;
