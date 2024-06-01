const { body, validationResult, param } = require('express-validator');
const mongodb = require('../db/connect');

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('restaurant').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving the restaurants', error });
  }
};

const getSingle = async (req, res) => {
  const restaurantName = req.params.name;
  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection('restaurant')
      .findOne({ name: restaurantName });

    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Restaurant Not Found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving the restaurant', error });
  }
};

const newRestaurant = [
  body('name').notEmpty().withMessage('Name is required'),
  body('address.street').notEmpty().withMessage('Street is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('Zip code is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('menu.burgers').isArray().withMessage('Burgers must be an array'),
  body('menu.fries').isArray().withMessage('Fries must be an array'),
  body('menu.drinks').isArray().withMessage('Drinks must be an array'),
  body('menu.desserts').isArray().withMessage('Desserts must be an array'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const restaurantInsert = {
      name: req.body.name,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        state: req.body.address.state,
        zipCode: req.body.address.zipCode
      },
      phoneNumber: req.body.phoneNumber,
      menu: {
        burgers: req.body.menu.burgers,
        fries: req.body.menu.fries,
        drinks: req.body.menu.drinks,
        desserts: req.body.menu.desserts
      }
    };

    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('restaurant')
        .insertOne(restaurantInsert);
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res.status(500).json({ message: 'An error occurred while creating the restaurant.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while creating the restaurant', error });
    }
  }
];

const updateRestaurant = [
  param('name').notEmpty().withMessage('Restaurant name is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('address.street').notEmpty().withMessage('Street is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('Zip code is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('menu.burgers').isArray().withMessage('Burgers must be an array'),
  body('menu.fries').isArray().withMessage('Fries must be an array'),
  body('menu.drinks').isArray().withMessage('Drinks must be an array'),
  body('menu.desserts').isArray().withMessage('Desserts must be an array'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const restaurantName = req.params.name;
    const restaurantInsert = {
      name: req.body.name,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        state: req.body.address.state,
        zipCode: req.body.address.zipCode
      },
      phoneNumber: req.body.phoneNumber,
      menu: {
        burgers: req.body.menu.burgers,
        fries: req.body.menu.fries,
        drinks: req.body.menu.drinks,
        desserts: req.body.menu.desserts
      }
    };

    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('restaurant')
        .replaceOne({ name: restaurantName }, restaurantInsert);
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: 'An error occurred while updating the restaurant.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the restaurant', error });
    }
  }
];

const deleteRestaurant = [
  param('name').notEmpty().withMessage('Restaurant name is required'),

  async (req, res) => {
    const deleteName = req.params.name;
    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('restaurant')
        .deleteOne({ name: deleteName });
      if (response.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: 'An error occurred while deleting the restaurant.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the restaurant', error });
    }
  }
];

module.exports = { getAll, getSingle, newRestaurant, updateRestaurant, deleteRestaurant };
