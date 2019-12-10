const { formatChecker } = require('@core');
const { MeasureModel } = require('@models');

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

    if (req.body.type === undefined || req.body.type === null) {
        throw new Error('type undefined/null');
    } else if (!formatChecker.isType(req.body.type)) {
        throw new Error('type not valid');
    }
    inputs.type = req.body.type;

    if (req.body.sensorID === undefined || req.body.sensorID === null) {
        throw new Error('sensorID undefined/null');
    }
    inputs.sensorID = req.body.sensorID;

    if (req.body.value === undefined || req.body.value === null) {
        throw new Error('value undefined/null');
    }
    inputs.value = req.body.value;

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
        const result = await MeasureModel.create(inputs);
        console.log('result: ', result);

        return result;
    } catch (error) {
        throw new Error('Measure can\'t be create'.concat(' > ', error.message));
    }

};

/**
 * LOGIC :
 */
const createMeasure = async (req, res) => {
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
module.exports = createMeasure;
