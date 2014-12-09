'use strict';

describe('Service: GenericOutput', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var GenericOutput;
  beforeEach(inject(function (_GenericOutput_) {
    GenericOutput = _GenericOutput_;
  }));

  it('should do something', function () {
    expect(!!GenericOutput).toBe(true);
  });

});
