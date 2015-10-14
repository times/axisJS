/**
 * Spec for spreadsheetInputService
 */
describe('Service: spreadsheetInput', function() {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var spreadsheetInput,
      testScope,
      output;

  beforeEach(inject(function(_spreadsheetInput_, $rootScope) {
    spreadsheetInput = _spreadsheetInput_;
    testScope = $rootScope.$new();
    testScope.inputs = {
      inputData: [
        ['header1', 'header2'],
        ['data1', 'data2']
      ]
    };
    testScope.config = {
      data: {
        types: {}
      }
    };
  }));

  it('should properly identify itself', function(){
    expect(spreadsheetInput.name).toBe('spreadsheetInputService');
  });

  it('should be able to validate an input spreadsheet', function(){
    expect(spreadsheetInput.validate([])).toBeTruthy(); // TODO write real validator for HOT.
  });

  it('should be able input a spreadsheet', function(){
    output = spreadsheetInput.input(testScope);

    expect(output.columns).toEqual(['header1', 'header2']);
    expect(output.chartData).toEqual([ ['data1', 'data2'] ]);
  });
  
  it('should be able to convert columnar data to HOT\'s row structure', function(){
    output = spreadsheetInput.convert([['data1', 1, 2, 3], ['data2', 4, 5, 6]]);

    expect(output[0]).toEqual(['data1', 'data2']);
    expect(output[1]).toEqual([1, 4]);
    expect(output[2]).toEqual([2, 5]);
    expect(output[3]).toEqual([3, 6]);
  });
});
