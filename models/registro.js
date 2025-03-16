// models/registro.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Registro = sequelize.define('Registro', {
  tipo: {
    type: DataTypes.ENUM('entrada', 'salida'),
    allowNull: false,
  },
  fechaHora: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  observacion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Clave foránea explícita para asociar el registro con un empleado
  EmpleadoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Empleados', // Nombre de la tabla que Sequelize genera para empleados
      key: 'id', // La columna "id" de la tabla "Empleados"
    },
    onUpdate: 'CASCADE', // Asegura consistencia en actualizaciones
    onDelete: 'CASCADE', // Borra los registros asociados si se elimina el empleado
  },
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['fechaHora'],
    },
  ],
});

module.exports = Registro;
