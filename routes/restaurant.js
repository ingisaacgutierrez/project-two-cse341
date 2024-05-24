const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurant');

router.get('/', restaurantController.getAll);

router.get('/:name', restaurantController.getSingle);

module.exports = router;
