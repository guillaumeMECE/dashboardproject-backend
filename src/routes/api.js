
const { Router } = require('express');

const router = Router();

/**
 * Controllers imports
 */

// MEASURE IMPORT
const { ReadMeasure, ReadOneMeasure, CreateMeasure, DeleteMeasure, UpdateMeasure } = require('@controllers');

// SENSOR IMPORT
const { ReadSensor, ReadOneSensor, CreateSensor, DeleteSensor, UpdateSensor, ReadMeasuresSensor } = require('@controllers');

// USER IMPORT
const { ReadUser, ReadOneUser, CreateUser, DeleteUser, UpdateUser, ReadSensorsUser, ReadLocation } = require('@controllers');

// KPI
const { SensorsByLocation, AirPollutionByLocation, TemperatureByLocation, AverageMeasureByLocation, ThreeHighestTemperature, AvgSensorsByHouseSize } = require('@controllers');

/**
 * MIDDLEWARES
 */


/**
 * Routes
 */

// Measure ROUTES
router.post('/measures', CreateMeasure);
router.get('/measures/:id', ReadOneMeasure);
router.get('/measures', ReadMeasure);
router.patch('/measures/:id', UpdateMeasure);
router.delete('/measures/:id', DeleteMeasure);

// User ROUTES
router.get('/users/location', ReadLocation);
router.post('/users', CreateUser);
router.get('/users/:id', ReadOneUser);
router.get('/users', ReadUser);
router.get('/users/:id/sensors', ReadSensorsUser);
router.patch('/users/:id', UpdateUser);
router.delete('/users/:id', DeleteUser);

// Sensor ROUTES
router.post('/sensors', CreateSensor);
router.get('/sensors/:id', ReadOneSensor);
router.get('/sensors', ReadSensor);
router.get('/sensors/:id/measures', ReadMeasuresSensor);
router.patch('/sensors/:id', UpdateSensor);
router.delete('/sensors/:id', DeleteSensor);

// KPI
router.get('/sensorsbylocation', SensorsByLocation);
router.get('/airpollutionbylocation', AirPollutionByLocation);
router.get('/temperaturebylocation/:id', TemperatureByLocation);
router.get('/temperaturebylocation', TemperatureByLocation);
router.get('/averagemeasurebylocation/:id', AverageMeasureByLocation);
router.get('/threehighesttemperature', ThreeHighestTemperature);
router.get('/avgsensorsbyhousesize', AvgSensorsByHouseSize);

module.exports = router;
