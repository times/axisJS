'use strict';

// There is like literally nothing to test with this.
xdescribe('Service: configChooser', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var configChooser;
  beforeEach(inject(function (_configChooser_) {
    configChooser = _configChooser_;
  }));

  it('should do something', function () {
    expect(!!configChooser).toBe(true);
  });

});
