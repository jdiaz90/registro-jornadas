// models/empleado.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Empleado = sequelize.define('Empleado', {
  // Campo ID: definido explícitamente aunque Sequelize lo genera por defecto
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Campo para DNI, NIF o NIE, obligatorio y único
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Campo para el nombre del empleado
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Campo para los apellidos
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Puesto del empleado (opcional)
  puesto: {
    type: DataTypes.STRING,
  },
  // Indicador para saber si el empleado es administrador
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  // Contraseña (almacenar hasheada usando bcrypt u otro algoritmo)
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Email del empleado, obligatorio, único y validado
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
}, {
  // Activa 'createdAt' y 'updatedAt' para llevar un registro temporal de cada registro
  timestamps: true,
});

module.exports = Empleado;
