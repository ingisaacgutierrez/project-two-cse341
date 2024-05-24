const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/', userController.getAll);

router.get('/:username', userController.getSingle);

router.post('/', userController.newContact);

module.exports = router;