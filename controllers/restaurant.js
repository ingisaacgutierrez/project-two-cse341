const mongodb = require('../db/connect');

const getAll = async (req, res) => {
  const result = await mongodb.getDb().db().collection('restaurant').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  const restaurantName = req.params.name;
  const result = await mongodb
    .getDb()
    .db()
    .collection('restaurant')
    .findOne({ name: restaurantName });

  if (result) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: 'User Not Found' });
  }
};

const newRestaurant = async (req, res) => {
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
  const response = await mongodb.getDb().db().collection('restaurant').insertOne(restaurantInsert);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the user.');
  }
};

const updateRestaurant = async (req, res) => {
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
  const response = await mongodb
    .getDb()
    .db()
    .collection('restaurant')
    .replaceOne({ name: restaurantName }, restaurantInsert);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the contact.');
  }
};

const deleteRestaurant = async (req, res) => {
  const deleteName = req.params.name;
  const response = await mongodb
    .getDb()
    .db()
    .collection('restaurant')
    .deleteOne({ name: deleteName }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
  }
};

module.exports = { getAll, getSingle, newRestaurant, updateRestaurant, deleteRestaurant };