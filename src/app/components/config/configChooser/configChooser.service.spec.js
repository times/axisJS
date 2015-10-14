  /**
 * @TODO write a better spec for configChooser
 */

 'use strict';

// There is like literally nothing to test with this.
describe('Service: configChooser', function () {

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var configChooser;
  beforeEach(inject(function (_configChooser_) {
    configChooser = _configChooser_;
  }));

  xit('should do something', function () {
    expect(!!configChooser).toBe(true);
  });

});
