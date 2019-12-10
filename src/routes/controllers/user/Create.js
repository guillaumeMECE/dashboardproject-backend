const { UserModel } = require('@models');

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

    if (req.body.houseSize === undefined || req.body.houseSize === null) {
        throw new Error('HouseSize undefined/null');
    }
    inputs.houseSize = req.body.houseSize;

    if (req.body.personInHouse === undefined || req.body.personInHouse === null) {
        throw new Error('PersonInHouse undefined/null');
    }
    inputs.personInHouse = req.body.personInHouse;

    if (req.body.location === undefined || req.body.location === null) {
        throw new Error('location undefined/null');
    }
    inputs.location = req.body.location;


    return inputs;
};

/**
* PROCESS :
*/
const process = async (param) => {
    const inputs = param;

    console.log('inputs: ', inputs);

    try {
        const data = await UserModel.create(inputs);


        return data;
    } catch (error) {
        throw new Error('User can\'t be create'.concat(' > ', error.message));
    }

};

/**
* LOGIC :
*/
const createUser = async (req, res) => {
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
module.exports = createUser;
