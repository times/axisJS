'use strict';

describe('Service: csvInput', function() {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var csvInput,
      sampleTSV = 'data1\tdata2\n30\t50\n200\t20\n100\t10\n400\t40\n150\t15\n250\t25',
      sampleCSV = 'data1,data2\n30,50\n200,20\n100,10\n400,40\n150,15\n250,25',
      sampleBroken = 'llama llama duck';

  var testScope = {
        inputs: {
          inputData: sampleTSV
        },
        config: {
          data: {
            types: {}
          }
        },
      };

  beforeEach(inject(function(_csvInput_) {
    csvInput = _csvInput_;
  }));

  it('should include default data', function() {
    expect(csvInput.defaultData).toEqual(sampleTSV);
  });

  it('should validate compliant CSV', function() {
    expect(csvInput.validate(sampleTSV)).toBe(true);
  });

  it('should not validate non-compliant CSV', function() {
    expect(csvInput.validate(sampleBroken)).toBe(false);
  });

  it('parse TSV and return a Papaparse Object', function() {
    expect(csvInput.input(testScope).config.data.columns.length).toBe(2);
  });

  it('should recognise CSV and parse it properly', function() {
    testScope.inputs.csvData = sampleCSV;
    expect(csvInput.input(testScope).config.data.columns.length).toBe(2);
  });
});
