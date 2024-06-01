const { body, validationResult, param } = require('express-validator');
const mongodb = require('../db/connect');
const passwordUtil = require('../utils/passwordComplexityCheck');

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('user').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving the users', error });
  }
};

const getSingle = [
  param('username').notEmpty().withMessage('Username is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const username = req.params.username;
    try {
      const result = await mongodb.getDb().db().collection('user').findOne({ username: username });

      if (result) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'User Not Found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while retrieving the user', error });
    }
  }
];

const validatePassword = (password) => {
  const { error } = passwordUtil.passwordPass(password);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

const newUser = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .custom((value) => {
      const passwordError = validatePassword(value);
      if (passwordError) {
        throw new Error(passwordError);
      }
      return true;
    }),
  body('email').isEmail().withMessage('Email is required and must be valid'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('deliveryAddress.street').notEmpty().withMessage('Street is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.state').notEmpty().withMessage('State is required'),
  body('deliveryAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('restaurant.name').notEmpty().withMessage('Restaurant name is required'),
  body('order.burgers').notEmpty().withMessage('Burgers must be an array'),
  body('order.fries').notEmpty().withMessage('Fries must be an array'),
  body('order.drinks').notEmpty().withMessage('Drinks must be an array'),
  body('order.dessert').notEmpty().withMessage('Dessert must be an array'),
  body('paymentMethod.cash').isBoolean().withMessage('Cash must be a boolean'),
  body('paymentMethod.creditCard').isBoolean().withMessage('Credit card must be a boolean'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userInsert = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      deliveryAddress: {
        street: req.body.deliveryAddress.street,
        city: req.body.deliveryAddress.city,
        state: req.body.deliveryAddress.state,
        zipCode: req.body.deliveryAddress.zipCode
      },
      restaurant: {
        name: req.body.restaurant.name
      },
      order: {
        burgers: req.body.order.burgers,
        fries: req.body.order.fries,
        drinks: req.body.order.drinks,
        dessert: req.body.order.dessert
      },
      paymentMethod: {
        cash: req.body.paymentMethod.cash,
        creditCard: req.body.paymentMethod.creditCard
      }
    };

    try {
      const response = await mongodb.getDb().db().collection('user').insertOne(userInsert);
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res.status(500).json({ message: 'An error occurred while creating the user.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while creating the user', error });
    }
  }
];

const updateUser = [
  param('username').notEmpty().withMessage('Username is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .custom((value) => {
      const passwordError = validatePassword(value);
      if (passwordError) {
        throw new Error(passwordError);
      }
      return true;
    }),
  body('password').notEmpty().withMessage('Password is required'),
  body('email').isEmail().withMessage('Email is required and must be valid'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('deliveryAddress.street').notEmpty().withMessage('Street is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.state').notEmpty().withMessage('State is required'),
  body('deliveryAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('restaurant.name').notEmpty().withMessage('Restaurant name is required'),
  body('order.burgers').notEmpty().withMessage('Burgers must be an array'),
  body('order.fries').notEmpty().withMessage('Fries must be an array'),
  body('order.drinks').notEmpty().withMessage('Drinks must be an array'),
  body('order.dessert').notEmpty().withMessage('Dessert must be an array'),
  body('paymentMethod.cash').isBoolean().withMessage('Cash must be a boolean'),
  body('paymentMethod.creditCard').isBoolean().withMessage('Credit card must be a boolean'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userName = req.params.username;
    const userInsert = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      deliveryAddress: {
        street: req.body.deliveryAddress.street,
        city: req.body.deliveryAddress.city,
        state: req.body.deliveryAddress.state,
        zipCode: req.body.deliveryAddress.zipCode
      },
      restaurant: {
        name: req.body.restaurant.name
      },
      order: {
        burgers: req.body.order.burgers,
        fries: req.body.order.fries,
        drinks: req.body.order.drinks,
        dessert: req.body.order.dessert
      },
      paymentMethod: {
        cash: req.body.paymentMethod.cash,
        creditCard: req.body.paymentMethod.creditCard
      }
    };

    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('user')
        .replaceOne({ username: userName }, userInsert);
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: 'An error occurred while updating the user.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the user', error });
    }
  }
];

const deleteUser = [
  param('username').notEmpty().withMessage('Username is required'),

  async (req, res) => {
    const userName = req.params.username;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('user')
        .deleteOne({ username: userName });
      if (response.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: 'An error occurred while deleting the user.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the user', error });
    }
  }
];

module.exports = { getAll, getSingle, newUser, updateUser, deleteUser };
