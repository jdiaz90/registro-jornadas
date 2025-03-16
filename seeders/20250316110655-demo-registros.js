'use strict';
const { faker } = require('@faker-js/faker');

// Cambiar la localización a español
faker.locale = 'es';

// Función para generar una fecha aleatoria dentro de los últimos 1000 días
function getRandomDateWithinLastDays(days) {
  const today = new Date();
  const pastDate = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));
  return new Date(pastDate.getTime() + Math.random() * (today.getTime() - pastDate.getTime()));
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const registros = [];

    // Obtener los IDs de los empleados ya insertados en la base de datos
    const empleados = await queryInterface.sequelize.query(
      'SELECT id FROM "Empleados";', // Cambia "Empleados" si tienes un nombre distinto de tabla
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    let lastFechaHora = getRandomDateWithinLastDays(1000); // Fecha inicial aleatoria dentro de los últimos 1000 días
    let tipoActual = 'entrada'; // El primer registro será de tipo "entrada"
    let empleadoActual = faker.helpers.arrayElement(empleados); // Seleccionar un empleado aleatorio

    // Generar 1000 registros alternando entrada/salida
    for (let i = 0; i < 1000; i++) {
      // Si el registro es de salida, ajustar la fechaHora para que sea posterior al de entrada
      if (tipoActual === 'salida') {
        // Incrementar la fecha para simular una salida posterior (entre 1 y 10 horas después)
        lastFechaHora = new Date(lastFechaHora.getTime() + faker.number.int({ min: 1, max: 10 }) * 60 * 60 * 1000);
      }

      // Crear el registro
      registros.push({
        tipo: tipoActual,
        fechaHora: lastFechaHora,
        EmpleadoId: empleadoActual.id, // Asociar al empleado seleccionado
        observacion: faker.lorem.sentence(), // Agregar una observación aleatoria (opcional)
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Alternar entre entrada y salida para el siguiente registro
      tipoActual = tipoActual === 'entrada' ? 'salida' : 'entrada';

      // Si es entrada, generar una nueva fecha aleatoria (al mismo día o madrugada del siguiente)
      if (tipoActual === 'entrada') {
        lastFechaHora = getRandomDateWithinLastDays(1000); // Nueva fecha aleatoria
        lastFechaHora.setHours(faker.number.int({ min: 6, max: 22 })); // Hora entre las 6:00 AM y las 10:00 PM
        empleadoActual = faker.helpers.arrayElement(empleados); // Seleccionar un nuevo empleado aleatorio
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
