const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const verificarToken = require('../middlewares/verificarToken');

router.get('/', verificarToken, perfilController.verPerfil);
router.post('/cambiar-contrasena', verificarToken, perfilController.cambiarContrasena);

module.exports = router;