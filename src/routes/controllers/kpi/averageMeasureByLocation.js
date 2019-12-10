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
    inputs.id=req.params.id;

    return inputs;
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

        let avgMeasureTemp = 0;
        let avgMeasureHumidity = 0;
        let avgMeasureAirPollution = 0;
        let avgSensors1 = 0;
        let avgSensors2 = 0;
        let avgSensors3 = 0;

        // eslint-disable-next-line no-await-in-loop
        res.sensors = await SensorModel.find({ 'userID': res._id }).select({ 'userID': true }).lean().exec();

        for (let sensor = 0; sensor < res.sensors.length; sensor++) {
            // eslint-disable-next-line no-await-in-loop
            // TEMPERATURE
            res.sensors[sensor].measureTemp = await MeasureModel.find({ 'sensorID': res.sensors[sensor]._id, 'type': 'temperature'}).select({ 'type': true, 'value': true }).lean().exec();
                
            // eslint-disable-next-line no-loop-func
            res.sensors[sensor].measureTemp.forEach((element) => {
                avgMeasureTemp += element.value;
            });
            res.sensors[sensor].temperature = avgMeasureTemp / (res.sensors[sensor].measureTemp.length);
            avgMeasureTemp = 0;

            // eslint-disable-next-line no-await-in-loop
            // HUMIDITY
            res.sensors[sensor].measureHumidity = await MeasureModel.find({ 'sensorID': res.sensors[sensor]._id, 'type': 'humidity'}).select({ 'type': true, 'value': true }).lean().exec();
                
            // eslint-disable-next-line no-loop-func
            res.sensors[sensor].measureHumidity.forEach((element) => {
                avgMeasureHumidity += element.value;
            });
            res.sensors[sensor].humidity = avgMeasureHumidity / (res.sensors[sensor].measureHumidity.length);
            avgMeasureHumidity = 0;

            // eslint-disable-next-line no-await-in-loop
            // AIR POLLUTION
            res.sensors[sensor].measureAirPollution = await MeasureModel.find({ 'sensorID': res.sensors[sensor]._id, 'type': 'airPollution'}).select({ 'type': true, 'value': true }).lean().exec();
                
            // eslint-disable-next-line no-loop-func
            res.sensors[sensor].measureAirPollution.forEach((element) => {
                avgMeasureAirPollution += element.value;
            });
            res.sensors[sensor].airPollution = avgMeasureAirPollution / (res.sensors[sensor].measureAirPollution.length);
            avgMeasureAirPollution = 0;

            // eslint-disable-next-line no-restricted-globals
            if (!isNaN(res.sensors[sensor].temperature)) {
                avgSensors1 += res.sensors[sensor].temperature;
            }

            if (!isNaN(res.sensors[sensor].humidity)) {
                avgSensors2 += res.sensors[sensor].humidity;
            }

            if (!isNaN(res.sensors[sensor].airPollution)) {
                avgSensors3 += res.sensors[sensor].airPollution;
            }
        }

        // res.temperature = Math.round((avgSensors1 / res.sensors.length) * 100) / 100;
        // avgSensors1 = 0;


        // res.humidity = Math.round((avgSensors2 / res.sensors.length) * 100) / 100;
        // avgSensors2 = 0;


        // res.airPollution = Math.round((avgSensors3 / res.sensors.length) * 100) / 100;
        // avgSensors3 = 0;
        // delete res.sensors;
        res.temperature = Math.round((avgSensors1 / res.sensors.length));
        avgSensors1 = 0;


        res.humidity = Math.round((avgSensors2 / res.sensors.length));
        avgSensors2 = 0;


        res.airPollution = Math.round((avgSensors3 / res.sensors.length));
        avgSensors3 = 0;
        delete res.sensors;

        return res;
    } catch (error) {
        throw new Error('averageMeasureByLocation can\'t be get'.concat(' > ', error.message));
    }

};

/**
 * LOGIC :
 */
const averageMeasureByLocation = async (req, res) => {
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
module.exports = averageMeasureByLocation;
