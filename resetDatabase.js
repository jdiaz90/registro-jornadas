const { exec } = require('child_process');

async function resetDatabase() {
  console.log('Vaciando la base de datos y reiniciándola con semillas...');

  // Paso 1: Revertir todas las migraciones (elimina las tablas)
  exec('npx sequelize-cli db:migrate:undo:all', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al revertir migraciones: ${error.message}`);
      return;
    }
    console.log(`Migraciones revertidas:\n${stdout}`);

    // Paso 2: Aplicar todas las migraciones (recrear las tablas)
    exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al aplicar migraciones: ${error.message}`);
        return;
      }
      console.log(`Migraciones aplicadas:\n${stdout}`);

      // Paso 3: Insertar todas las semillas
      exec('npx sequelize-cli db:seed:all', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar semillas: ${error.message}`);
          return;
        }
        console.log(`Semillas ejecutadas correctamente:\n${stdout}`);
      });
    });
  });
}

resetDatabase();
