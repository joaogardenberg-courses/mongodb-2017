const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../app');
const Driver = mongoose.model('driver');

describe('Drivers controller', (done) => {
  it('post to /api/drivers creates a new driver', (done) => {
    Driver.count()
      .then((initialCount) => {
        request(app)
          .post('/api/drivers')
          .send({ email: 'test@test.com' })
          .end(() => {
            Driver.count()
              .then((finalCount) => {
                assert(initialCount + 1 === finalCount);
                done();
              });
          });
      });
  });

  it('put to /api/drivers/:id updates an existing driver', (done) => {
    const driver = new Driver({ email: 'test@test.com', driving: false });

    driver.save()
      .then(() => {
        request(app)
          .put(`/api/drivers/${driver._id}`)
          .send({ driving: true })
          .end(() => {
            Driver.findById(driver._id)
              .then((driver) => {
                assert(driver.driving === true);
                done();
              });
          });
      });
  });

  it('delete to /api/drivers/:id destroys an existing driver', (done) => {
    const driver = new Driver({ email: 'test@test.com' });

    driver.save()
      .then(() => {
        request(app)
          .delete(`/api/drivers/${driver._id}`)
          .end(() => {
            Driver.findOne({ email: driver.email })
              .then((driver) => {
                assert(driver === null);
                done();
              })
          });
      });
  });

  it('get to /api/drivers finds drivers in a location', (done) => {
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      location: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
    });

    const miamiDriver = new Driver({
      email: 'miami@test.com',
      location: { type: 'Point', coordinates: [-80.253, 25.791] }
    });

    Promise.all([seattleDriver.save(), miamiDriver.save()])
      .then(() => {
        request(app)
          .get('/api/drivers?lng=-80&lat=25')
          .end((err, response) => {
            assert(response.body.length === 1);
            assert(response.body[0].email === miamiDriver.email);
            done();
          });
      });
  });
});