const DriversController = require('../controllers/driversController');

module.exports = (app) => {
  // Api routes
  app.get('/api', (req, res) => res.send({ hi: 'there' }));

  // Drivers routes
  app.get(   '/api/drivers',     DriversController.index);
  app.get(   '/api/drivers/:id', DriversController.show);
  app.post(  '/api/drivers',     DriversController.create);
  app.put(   '/api/drivers/:id', DriversController.update);
  app.delete('/api/drivers/:id', DriversController.destroy);
};