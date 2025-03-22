const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const descargarPdfController = require('../controllers/descargarPdfController');
const descargarXlsxController = require('../controllers/descargarXlsxController');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');

router.get('/empleados', verificarToken, verificarAdmin, adminController.verEmpleados);
router.get('/empleados/:id/registros', verificarToken, verificarAdmin, adminController.verRegistrosEmpleado);

// Ruta para mostrar el formulario de alta de usuarios
router.get('/empleados/nuevo', verificarToken, verificarAdmin, adminController.mostrarFormularioAlta);

// Ruta para procesar el alta de usuarios
router.post('/empleados/nuevo', verificarToken, verificarAdmin, adminController.crearEmpleado);

// Ruta para mostrar el formulario de edición de usuario
router.get('/empleados/:id/editar', verificarToken, verificarAdmin, adminController.mostrarFormularioEdicion);

// Ruta para procesar la edición de usuario
router.post('/empleados/:id/editar', verificarToken, verificarAdmin, adminController.editarEmpleado);

// Ruta para que un administrador descargue registros en PDF
router.get('/empleados/:id/registros/descargar/pdf', verificarToken, verificarAdmin, descargarPdfController.descargarPdfAdmin);

// Descargar registros en Excel (Administrador)
router.get('/empleados/:id/registros/descargar/xlsx', verificarToken, verificarAdmin, descargarXlsxController.descargarXlsxAdmin);

module.exports = router;