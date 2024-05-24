const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
const result = await mongodb.getDb().db().collection('user').find();
result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
});
};

const getSingle = async (req, res) => {
const userName = req.params.username;
const result = await mongodb
    .getDb()
    .db()
    .collection('user')
    .findOne({ 'user.username': userName });
result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
});
};

const newUser = async (req, res) => {
    const user = {
        username: req.body.user.username,
        password: req.body.user.password,
        email: req.body.user.email,
        phoneNumber: req.body.user.phoneNumber,
        deliveryAddress: {
            street: req.body.user.deliveryAddress.street,
            city: req.body.user.deliveryAddress.city,
            state: req.body.user.deliveryAddress.state,
            zipCode: req.body.user.deliveryAddress.zipCode
        },
        order: {
            burgers: req.body.user.order.burgers,
            fries: req.body.user.order.fries,
            drinks: req.body.user.order.drinks,
            dessert: req.body.user.order.dessert
        },
        paymentMethod: {
            cash: req.body.user.paymentMethod.cash,
            creditCard: {
                cardNumber: req.body.user.paymentMethod.creditCard.cardNumber,
                expiryDate: req.body.user.paymentMethod.creditCard.expiryDate,
                cvv: req.body.user.paymentMethod.creditCard.cvv
            }
        }
    };
    const response = await mongodb.getDb().db().collection('user').insertOne(user);
    if (response.acknowledged) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the user.');
    }
};

module.exports = { getAll, getSingle, newUser};