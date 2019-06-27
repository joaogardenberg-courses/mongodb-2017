const Driver = require('../models/driver');

module.exports = {
  index(req, res, next) {
    const { lng, lat } = req.query;

    const location = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };

    Driver.aggregate([{
      $geoNear: {
        near: location,
        spherical: true,
        maxDistance: 200000,
        distanceField: 'dist.calculated'
      }
    }])
      .then((drivers) => res.send(drivers))
      .catch(next);
  },

  show(req, res, next) {
    const driverId = req.params.id;

    Driver.findById(driverId)
      .then((driver) => res.send(driver))
      .catch(next);
  },

  create(req, res, next) {
    const driverProps = req.body;

    Driver.create(driverProps)
      .then((driver) => res.send(driver))
      .catch(next);
  },

  update(req, res, next) {
    const driverId    = req.params.id;
    const driverProps = req.body;

    Driver.findByIdAndUpdate(driverId, driverProps)
      .then(() => Driver.findById(driverId))
      .then((driver) => res.send(driver))
      .catch(next);
  },

  destroy(req, res, next) {
    const driverId = req.params.id;

    Driver.findByIdAndRemove(driverId)
      .then((driver) => res.status(204).send(driver))
      .catch(next);
  }
};