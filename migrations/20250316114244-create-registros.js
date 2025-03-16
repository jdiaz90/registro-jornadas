'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Registros', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM('entrada', 'salida'),
        allowNull: false,
      },
      fechaHora: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      observacion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      EmpleadoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Empleados', // Referencia a la tabla "Empleados"
          key: 'id',
        },
        onUpdate: 'CASCADE', // Actualizar registros si el empleado cambia
        onDelete: 'CASCADE', // Borrar registros si el empleado es eliminado
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Registros');
  },
};
