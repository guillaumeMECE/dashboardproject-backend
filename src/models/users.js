const { Schema, model } = require('mongoose');

const name = 'users';

const attributes = {
    houseSize: {
        type: String,
        required: true
    },
    personInHouse: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
};

const options = {};

const UserSchema = new Schema(attributes, options);

const UserModel = model(name, UserSchema);

module.exports = UserModel;
