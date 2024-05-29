const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurant');

router.get('/', restaurantController.getAll);

router.get('/:name', restaurantController.getSingle);

router.post('/', restaurantController.newRestaurant);

router.put('/:name', restaurantController.updateRestaurant);

router.delete('/:name', restaurantController.deleteRestaurant);

module.exports = router;
