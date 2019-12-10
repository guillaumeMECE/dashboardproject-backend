/* eslint-disable global-require */

module.exports = {

    // Measure handlers
    CreateMeasure: require('./measure/Create'),
    ReadOneMeasure: require('./measure/ReadOne'),
    ReadMeasure: require('./measure/Read'),
    UpdateMeasure: require('./measure/Update'),
    DeleteMeasure: require('./measure/Delete'),

    // User handlers
    CreateUser: require('./user/Create'),
    ReadOneUser: require('./user/ReadOne'),
    ReadUser: require('./user/Read'),
    ReadSensorsUser: require('./user/ReadSensors'),
    UpdateUser: require('./user/Update'),
    DeleteUser: require('./user/Delete'),
    ReadLocation: require('./user/ReadLocation'),

    // Sensor handlers
    CreateSensor: require('./sensor/Create'),
    ReadOneSensor: require('./sensor/ReadOne'),
    ReadSensor: require('./sensor/Read'),
    ReadMeasuresSensor: require('./sensor/ReadMeasure'),
    UpdateSensor: require('./sensor/Update'),
    DeleteSensor: require('./sensor/Delete'),


    // KPI
    SensorsByLocation: require('./kpi/sensorsByLocation'),
    AirPollutionByLocation: require('./kpi/airPollutionByLocation'),
    TemperatureByLocation: require('./kpi/temperatureByLocation'),
    AverageMeasureByLocation: require('./kpi/averageMeasureByLocation'),
    ThreeHighestTemperature: require('./kpi/threeHighestTemperature'),
    AvgSensorsByHouseSize: require('./kpi/avgSensorsByHouseSize'),
};
