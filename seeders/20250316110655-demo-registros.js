'use strict';
const { faker } = require('@faker-js/faker');

// Cambiar la localización a español
faker.locale = 'es';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const registros = [];

    // Obtener los IDs de los empleados ya insertados en la base de datos
    const empleados = await queryInterface.sequelize.query(
      'SELECT id FROM "Empleados";', // Cambia "Empleados" si tienes un nombre distinto de tabla
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    let lastFechaHora = faker.date.recent(30); // Fecha inicial aleatoria dentro de los últimos 30 días
    let tipoActual = 'entrada'; // El primer registro será de tipo "entrada"

    // Generar 1000 registros alternando entrada/salida
    for (let i = 0; i < 1000; i++) {
      // Seleccionar un empleado aleatorio
      const empleado = faker.helpers.arrayElement(empleados);

      // Si el registro es de salida, ajustar la fechaHora para que sea posterior al de entrada
      if (tipoActual === 'salida') {
        // Incrementar la fecha para simular una salida posterior (entre 1 y 10 horas después)
        lastFechaHora = new Date(lastFechaHora.getTime() + faker.number.int({ min: 1, max: 10 }) * 60 * 60 * 1000);
      }

      // Crear el registro
      registros.push({
        tipo: tipoActual,
        fechaHora: lastFechaHora,
        EmpleadoId: empleado.id, // Asociar al empleado seleccionado
        observacion: faker.lorem.sentence(), // Agregar una observación aleatoria (opcional)
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Alternar entre entrada y salida para el siguiente registro
      tipoActual = tipoActual === 'entrada' ? 'salida' : 'entrada';

      // Si es entrada, generar una nueva fecha aleatoria (al mismo día o madrugada del siguiente)
      if (tipoActual === 'entrada') {
        lastFechaHora = faker.date.recent(30); // Nueva fecha aleatoria
        lastFechaHora.setHours(faker.number.int({ min: 6, max: 22 })); // Hora entre las 6:00 AM y las 10:00 PM
      }
    }

    // Insertar todos los registros generados en la tabla "Registros"
    await queryInterface.bulkInsert('Registros', registros, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Elimina los registros generados
    await queryInterface.bulkDelete('Registros', null, {});
  }
};
