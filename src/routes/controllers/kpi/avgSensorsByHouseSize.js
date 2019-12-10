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
const process = async (params) => {

    try {

        const res = await UserModel.find({}).select({ 'houseSize': true }).lean().exec();

        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            // eslint-disable-next-line no-await-in-loop
            element.sensors = await SensorModel.find({ 'userID': element._id }).count().lean().exec();
        }

        const tab = [{ houseSize: 'small', sensors: 0 }, { houseSize: 'medium', sensors: 0 }, { houseSize: 'big', sensors: 0 }];

        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            for (let id = 0; id < tab.length; id++) {
                const arr = tab[id];
                if (element.houseSize === arr.houseSize) {
                    arr.sensors += element.sensors;
                }
            }
        }

        return tab;
    } catch (error) {
        throw new Error('temperatureByLocation can\'t be get'.concat(' > ', error.message));
    }

};

/**
 * LOGIC :
 */
const avgSensorsByHouseSize = async (req, res) => {
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
module.exports = avgSensorsByHouseSize;
