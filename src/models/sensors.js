
const { Schema, model } = require('mongoose');

const name = 'sensors';

const attributes = {
    location: {
        type: String,
        required: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    creationDate: {
        type: String,
        required: true
    },
};

const options = {};

const SensorSchema = new Schema(attributes, options);

const SensorModel = model(name, SensorSchema);

module.exports = SensorModel;
