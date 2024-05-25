const mongodb = require('../db/connect');

const getAll = async (req, res) => {
  const result = await mongodb.getDb().db().collection('user').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  const username = req.params.username;
  const result = await mongodb.getDb().db().collection('user').findOne({ username: username });

  if (result) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: 'User Not Found' });
  }
};

const newUser = async (req, res) => {
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
  const response = await mongodb.getDb().db().collection('user').insertOne(userInsert);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the user.');
  }
};

module.exports = { getAll, getSingle, newUser };
