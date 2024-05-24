const mongodb = require('../db/connect');


const getAll = async (req, res) => {
const result = await mongodb.getDb().db().collection('restaurant').find();
result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
});
};

module.exports = { getAll };