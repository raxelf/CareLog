const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();

router.get('/', Controller.getHome);
router.get('/login', Controller.getLogin);
router.get('/register', Controller.getRegister);

module.exports = router;