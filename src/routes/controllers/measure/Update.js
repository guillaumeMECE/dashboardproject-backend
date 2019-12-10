const { MeasureModel } = require('@models');
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

    if (req.body.value === undefined || req.body.value === null) {
        throw new Error('buttNumber undefined/null');
    }
    inputs.value = req.body.value;

    return inputs;
};

/**
 * PROCESS :
 */
const process = async (params) => {
    const inputs = params;
    try {
        const data = await MeasureModel.findByIdAndUpdate(inputs.id, inputs).exec();

        return data;
    } catch (error) {
        throw new Error('Measure can\'t be Update'.concat(' > ', error.message));
    }
};

/**
 * LOGIC :
 */
const updateMeasure = async (req, res) => {
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
module.exports = updateMeasure;
