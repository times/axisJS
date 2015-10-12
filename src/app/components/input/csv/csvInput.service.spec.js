/**
 * @TODO fill in pending specs.
 */

describe('Service: csvInput', function () {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var csvInput;
  beforeEach(inject(function (_csvInput_) {
    csvInput = _csvInput_;
  }));

  describe('basic functionality', function(){
    it('should have default data', function(){
      expect(csvInput.defaultCSV);
    });

    it('should validate CSV');

    it('should parse a CSV into an array of columns');

    it('should be able to convert an array of columns into a CSV string');
  });

  describe('edge cases', function(){
    it('should throw a CsvInputServiceException if invalid data', function () {
      expect(!!csvInput).toBe(true);
    });

    it('should remove separator commas from numbers');

    it('should be able to validate CSVs with only one column');
  });
});
