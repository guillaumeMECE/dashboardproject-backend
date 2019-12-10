const { UserModel, SensorModel, MeasureModel } = require('@models');

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
    inputs.id = req.params.id;
    console.log('inputs: ', inputs);

    return inputs;
};


const sortByDate = (array) => {

};

/**
 * PROCESS :
 */
const process = async (params) => {

    try {
        let res;
        if (params.id === 'null' || params.id === undefined) {
            // Get the first one in the list
            res = await UserModel.findOne().select({ 'location': true }).lean().exec();
        } else {
            // Get according to the id in params
            res = await UserModel.findById(params.id).select({ 'location': true }).lean().exec();
        }

        res.name = res.location;

        let temp = [];

        res.sensors = await SensorModel.find({ 'userID': res._id }).select({ 'userID': true }).lean().exec();

        for (let sensor = 0; sensor < res.sensors.length; sensor++) {
            // eslint-disable-next-line no-await-in-loop
            res.sensors[sensor].measures = await MeasureModel.find({ 'sensorID': res.sensors[sensor]._id, 'type': 'temperature' }).select({ 'creationDate': true, 'value': true, '_id': false }).lean().exec();
            res.sensors[sensor].measures.forEach((element) => {
                // eslint-disable-next-line no-param-reassign
                element.name = element.creationDate;
            });

            temp = temp.concat(res.sensors[sensor].measures);
        }
        res.temp = temp;

        res.temp.sort((a, b) => {
            return new Date(a.creationDate) - new Date(b.creationDate);
        });

        delete res.sensors;

        return res;
    } catch (error) {
        throw new Error('temperatureByLocation can\'t be get'.concat(' > ', error.message));
    }

};

/**
 * LOGIC :
 */
const temperatureByLocation = async (req, res) => {
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
module.exports = temperatureByLocation;
