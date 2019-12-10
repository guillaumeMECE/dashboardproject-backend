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

    return inputs;
};

/**
 * PROCESS :
 */
const process = async (param) => {

    try {
        const res = await UserModel.find({}).select({ 'location': true }).lean().exec();
        res.forEach((element) => {
            element.name = element.location;
        });

        let avgMeasures = 0;
        let avgSensors = 0;

        for (let user = 0; user < res.length; user++) {
            // eslint-disable-next-line no-await-in-loop
            res[user].sensors = await SensorModel.find({ 'userID': res[user]._id }).select({ 'userID': true }).lean().exec();

            for (let sensor = 0; sensor < res[user].sensors.length; sensor++) {
                // eslint-disable-next-line no-await-in-loop
                res[user].sensors[sensor].measures = await MeasureModel.find({ 'sensorID': res[user].sensors[sensor]._id, 'type': 'airPollution' }).select({ 'type': true, 'value': true }).lean().exec();
                // eslint-disable-next-line no-loop-func
                res[user].sensors[sensor].measures.forEach((element) => {
                    avgMeasures += element.value;
                });
                res[user].sensors[sensor].airPollution = avgMeasures / (res[user].sensors[sensor].measures.length);
                avgMeasures = 0;

                // eslint-disable-next-line no-restricted-globals
                if (!isNaN(res[user].sensors[sensor].airPollution)) {
                    avgSensors += res[user].sensors[sensor].airPollution;
                }
            }
            res[user].airPollution = Math.round((avgSensors / res[user].sensors.length) * 100) / 100;
            avgSensors = 0;
            delete res[user].sensors;
        }

        for (let i = res.length - 1; i >= 4; i--) {
            res.splice(Math.floor(Math.random() * res.length), 1);
            console.log(res);
        }

        return res;
    } catch (error) {
        throw new Error('sensorsByLocation can\'t be get'.concat(' > ', error.message));
    }

};

/**
 * LOGIC :
 */
const airPollutionByLocation = async (req, res) => {
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
module.exports = airPollutionByLocation;
