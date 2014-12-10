'use strict';

// TODO write unit tests for this.

xdescribe('Service: embedOutput', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var embedOutput;
  beforeEach(inject(function (_embedOutput_) {
    embedOutput = _embedOutput_;
  }));

  it('should do something', function () {
    expect(!!embedOutput).toBe(true);
  });

});
