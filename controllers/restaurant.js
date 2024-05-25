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

module.exports = { getAll, getSingle };
