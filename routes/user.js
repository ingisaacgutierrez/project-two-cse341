const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/', userController.getAll);

router.get('/:username', userController.getSingle);

router.post('/', userController.newUser);

router.put('/:username', userController.updateUser);

router.delete('/:username', userController.deleteUser);

module.exports = router;
