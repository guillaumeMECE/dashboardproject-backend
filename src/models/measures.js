
const { Schema, model } = require('mongoose');

const name = 'measures';

const attributes = {
    type: {
        type: String,
        required: true
    },
    creationDate: {
        type: String,
        required: true
    },
    sensorID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
};

const options = {};

const MeasureSchema = new Schema(attributes, options);

const MeasureModel = model(name, MeasureSchema);

module.exports = MeasureModel;
