const { SensorModel } = require('@models');
const { formatChecker } = require('@core');

// const { AshtrayServices } = require('@services');
/**
 * Request structure
 * req = { body: { } }
 * res = { json: { } }
 */

/**
 * SECURE : Params and Body
 */
const secure = async (req) => {
    const inputs = {};

    if (req.params.id === undefined || req.params.id === null) {
        throw new Error('ID undefined/null');
    }
    inputs.id = req.params.id;

    if (req.body.location === undefined || req.body.location === null) {
        throw new Error('Location undefined/null');
    } else if (!formatChecker.isLocation(req.body.location)) {
        throw new Error('location not valid');
    }
    inputs.location = req.body.location;

    return inputs;
};

/**
 * PROCESS :
 */
const process = async (params) => {
    const inputs = params;

    try {
        const data = await SensorModel.findByIdAndUpdate(inputs.id, inputs).exec();

        return data;
    } catch (error) {
        throw new Error('Sensor can\'t be Update'.concat(' > ', error.message));
    }
};

/**
 * LOGIC :
 */
const updateSensor = async (req, res) => {
    try {
        const inputs = await secure(req);

        const data = await process(inputs);

        res.status(200).json(data);
    } catch (error) {
        console.log('ERROR MESSAGE :', error.message);
        console.log('ERROR :', error);
        res.status(400).json({ 'message': error.message });
    }
};
module.exports = updateSensor;
