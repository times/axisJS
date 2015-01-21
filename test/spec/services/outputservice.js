'use strict';

describe('Service: outputService', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var outputService,
      genericOutput;

  beforeEach(inject(function (_outputService_) {
    outputService = _outputService_;
    genericOutput = outputService({'llama': 'duck'}, 'Generic');
  }));

  it('should return the above object', function () {
    expect(genericOutput.llama).toBe('duck');
  });

});
