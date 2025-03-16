'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const generateDNIorNIE = require('../utils/generateDNIorNIE');


// Cambiar la localización a español
faker.locale = 'es';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Pre-hash la contraseña "12345678" para todos los empleados.
    const hashedPassword = await bcrypt.hash('12345678', 10);

    // Definición de los dos empleados fijos.
    const fixedEmployees = [
      {
        dni: "12345678A",
        nombre: 'Juan',
        apellidos: 'Pérez',
        email: 'juan@example.com',
        password: hashedPassword,
        isAdmin: false,
        puesto: 'Desarrollador',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        dni: "87654321B",
        nombre: 'María',
        apellidos: 'Gómez',
        email: 'maria@example.com',
        password: hashedPassword,
        isAdmin: true,
        puesto: 'Administradora',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Genera 50 empleados aleatorios utilizando Faker.
    const randomEmployees = [];
    for (let i = 0; i < 50; i++) {
      randomEmployees.push({
        dni: generateDNIorNIE(),
        nombre: faker.person.firstName(),
        apellidos: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashedPassword,
        isAdmin: faker.datatype.boolean(),
        puesto: faker.person.jobTitle(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Combina ambos arreglos para obtener la lista final de empleados.
    const employees = [...fixedEmployees, ...randomEmployees];

    // Inserta todos los empleados en la tabla 'Empleados'.
    await queryInterface.bulkInsert('Empleados', employees, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Elimina todos los registros de la tabla 'Empleados'.
    await queryInterface.bulkDelete('Empleados', null, {});
  }
};
