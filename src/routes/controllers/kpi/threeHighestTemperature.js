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




/**
 * PROCESS :
 */
const process = async (params) => {

    try {
        const res = await UserModel.find({}).select({ 'location': true }).lean().exec();
        res.forEach((element) => {
            element.name = element.location;
        });

        // let avgMeasures = 0;
        // let avgSensors = 0;

        for (let user = 0; user < res.length; user++) {
            // eslint-disable-next-line no-await-in-loop
            res[user].sensors = await SensorModel.find({ 'userID': res[user]._id }).select({ 'userID': true }).lean().exec();
            
            let tab1 = [];
            for (let sensor = 0; sensor < res[user].sensors.length; sensor++) {
                // eslint-disable-next-line no-await-in-loop
                res[user].sensors[sensor].measures = await MeasureModel.find({ 'sensorID': res[user].sensors[sensor]._id, 'type': 'temperature' }).select({ 'type': true, 'value': true }).lean().exec();
                
                let tab = [];
                for (let measure = 0; measure < res[user].sensors[sensor].measures.length; measure++) {
                    
                    tab = tab.concat(res[user].sensors[sensor].measures[measure].value);
                    
                }
                res[user].sensors[sensor].maxtemp = Math.max(...tab); 
                tab = [];

               
                tab1 = tab1.concat(res[user].sensors[sensor].maxtemp);

            } 
                   
            res[user].maxTemp = Math.max(...tab1);
            tab1 = [];
            delete res[user].sensors;

            res.sort(( a, b) => {
                return b.maxTemp - a.maxTemp; });
            
            

        }
        const res1 = res.slice(0,3);



        return res1;
    } catch (error) {
        throw new Error('threeHighestTemperature can\'t be get'.concat(' > ', error.message));
    }

};

/**
 * LOGIC :
 */
const threeHighestTemperature = async (req, res) => {
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
module.exports = threeHighestTemperature;
