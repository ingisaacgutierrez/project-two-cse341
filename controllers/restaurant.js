const mongodb = require('../db/connect');


const getAll = async (req, res) => {
const result = await mongodb.getDb().db().collection('restaurant').find();
result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
});
};

const getSingle = async (req, res) => {
    const restaurantId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDb()
        .db()
        .collection('user')
        .find({ _id: restaurantId });
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
    };

module.exports = { getAll, getSingle };