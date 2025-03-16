const express = require('express');
const router = express.Router();
const registrosController = require('../controllers/registrosController');
const descargarPdfController = require('../controllers/descargarPdfController');
const descargarXlsxController = require('../controllers/descargarXlsxController');
const verificarToken = require('../middlewares/verificarToken');

router.get('/', verificarToken, registrosController.showRegistros);
router.get('/descargar/xlsx', verificarToken, descargarXlsxController.descargarXlsx);
router.get('/descargar/pdf', verificarToken, descargarPdfController.descargarPdf);

module.exports = router;