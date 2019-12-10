const { formatChecker } = require('@core');
const { SensorModel } = require('@models');

/**
 * Request structure
 * req = { body: {location:{xx,xx}, userID:string, questionID:string, } }
 * res = { json: { } }
 */

/**
 * SECURE : Params and Body
 */
const secure = async (req) => {

    const inputs = {};

    if (req.body.location === undefined || req.body.location === null) {
        throw new Error('location undefined/null');
    } else if (!formatChecker.isLocation(req.body.location)) {
        throw new Error('location not valid');
    }
    inputs.location = req.body.location;

    if (req.body.userID === undefined || req.body.userID === null) {
        throw new Error('userID undefined/null');
    }
    inputs.userID = req.body.userID;

    return inputs;
};

/**
 * PROCESS :
 */
const process = async (param) => {
    const inputs = param;

    inputs.creationDate = Date();

    console.log('inputs: ', inputs);

    try {
        const result = await SensorModel.create(inputs);

        return result;
    } catch (error) {
        throw new Error('Sensor can\'t be create'.concat(' > ', error.message));
    }

};

/**
 * LOGIC :
 */
const createSensor = async (req, res) => {
    try {
        const inputs = await secure(req);

        const data = await process(inputs);

        res.status(200).json({ data });

    } catch (error) {
        console.log('ERROR MESSAGE :', error.message);
        console.log('ERROR :', error);
        res.status(400).json({ 'message': error.message });
    }
};
module.exports = createSensor;
