const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurant');

router.get('/:name', restaurantController.getAll);

module.exports = router;