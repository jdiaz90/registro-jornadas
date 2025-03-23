const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth'); // Importando el middleware unificado

router.get('/login', auth, authController.showLogin); // auth para evitar acceso si ya está logueado
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
