// @TODO fill out the pending specs.

describe('Service: inputService', function () {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var inputService,
      inputProvider,
      appConfig;

  beforeEach(inject(function (_inputService_) {
    inputProvider = _inputService_;
  }));


  describe('one input service listed', function(){
    beforeEach(function(){
      appConfig = {
        input: 'csv'
      };

      inputService = inputProvider(appConfig);
    });

    it('should return an injected input service', function(){
      expect(inputService.name).toBe('csvInputService');
    });
  });

  describe('multiple inputs listed', function(){
    beforeEach(function(){
      appConfig = {
        input: ['spreadsheet', 'csv']
      };

      inputService = inputProvider(appConfig);
    });

    it('should return the first input service if there are multiple listed', function(){
      expect(inputService.name).toBe('spreadsheetInputService');
    });
  });
});
