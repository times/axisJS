describe('Service: outputService', function () {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var outputService,
      genericOutput;

  beforeEach(inject(function (_outputService_) {
    outputService = _outputService_;
    genericOutput = outputService({'llama': 'duck'}, 'generic');
  }));

  it('should return the above object', function () {
    expect(genericOutput.llama).toBe('duck');
  });
});