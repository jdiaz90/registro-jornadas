const express = require('express');
const router = express.Router();
const registrosController = require('../controllers/registrosController');
const descargarPdfController = require('../controllers/descargarPdfController');
const descargarXlsxController = require('../controllers/descargarXlsxController');
const auth = require('../middlewares/auth'); // Importando el middleware unificado

router.get('/', auth, registrosController.showRegistros);
router.get('/descargar/xlsx', auth, descargarXlsxController.descargarXlsx);
router.get('/descargar/pdf', auth, descargarPdfController.descargarPdf);
module.exports = router;
