const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const auth = require('../middlewares/auth'); // Importando el middleware unificado

router.get('/', auth, perfilController.verPerfil);
router.post('/cambiar-contrasena', auth, perfilController.cambiarContrasena);

module.exports = router;
