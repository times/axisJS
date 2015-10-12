/**
 * @TODO write a spec for genericOutput
 */

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

  it('should return identity on preprocess()');
  it('should return identity on process()');
  it('should return identity on complete()');
  it('should run preprocess, process and complete on export(), returning identity');
});
