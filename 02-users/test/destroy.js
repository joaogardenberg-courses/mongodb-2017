const assert = require('assert');

const User = require('../src/user');

describe('Destroying records', () => {
  let joe;

  beforeEach((done) => {
    joe = new User({ name: 'Joe' });

    joe.save()
      .then(() => done())
  });

  function assertUser(operation, done) {
    operation
      .then(() => User.findOne({ name: 'Joe' }))
      .then((user) => {
        assert(user === null);
        done();
      });
  }

  it('model instance remove', (done) => {
    assertUser(joe.remove(), done);
  });

  it('class method remove', (done) => {
    assertUser(User.remove({ name: 'Joe' }), done);
  });

  it('class method findAndRemove', (done) => {
    assertUser(User.findOneAndRemove({ name: 'Joe' }), done);
  });

  it('class method findByIdAndRemove', (done) => {
    assertUser(User.findByIdAndRemove(joe._id), done);
  });
});