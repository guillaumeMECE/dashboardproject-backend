const { UserModel, SensorModel } = require('@models');

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

    return inputs;
};

/**
 * PROCESS :
 */
const process = async (param) => {

    try {
        const res = await UserModel.find({}).select({ 'location': true }).lean().exec();

        for (let index = 0; index < res.length; index++) {
            // eslint-disable-next-line no-await-in-loop
            res[index].sensors = await SensorModel.find({ 'userID': res[index]._id }).count().exec();
        }

        return res;
    } catch (error) {
        throw new Error('sensorsByLocation can\'t be get'.concat(' > ', error.message));
    }

};

/**
 * LOGIC :
 */
const sensorsByLocation = async (req, res) => {
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
module.exports = sensorsByLocation;
