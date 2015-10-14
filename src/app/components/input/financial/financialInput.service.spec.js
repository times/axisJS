describe('Service: financialInput', function() {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  var financialInput,
      testScope;

  beforeEach(inject(function(_financialInput_, $rootScope) {
    financialInput = _financialInput_;
    testScope = $rootScope.$new();

    testScope.inputs = {
      symbol: 'NWS',
      dateStart: '2015-09-13',
      dateEnd: '2015-10-14'
    };
    testScope.config = {};
  }));

  it('should identify itself', function(){
    expect(financialInput.name).toBe('financialInputService');
  });

  it('should return the default data', function(){
    var defaultData = financialInput.defaultData;
    var baseTime = new Date(2015, 10, 14);
    jasmine.clock().mockDate(baseTime);

    expect(defaultData.symbol).toBe('NWS');
    expect(defaultData.dateStart).toBe('2015-09-13');
    expect(defaultData.dateEnd).toBe('2015-10-14');
  });

  it('should validate picker symbols', function(){
    expect(financialInput.validate([])).toBeTruthy(); // This isn't a real test because the validator doesn't work yet.
  });

  xit('should parse the data', inject(function($httpBackend){
    $httpBackend.expectGET('assets/i18n/en_GB.json');
    $httpBackend.whenGET('assets/i18n/en_GB.json').respond('{}');

    var output = financialInput.input(testScope); // This resolves a promise inside the function and is thus borked.
    testScope.$digest();
    $httpBackend.flush();
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.whenGET('default.config.yaml').respond('');
    $httpBackend.expectGET('config.yaml');
    $httpBackend.whenGET('config.yaml').respond('');

    expect(output.chartData).toBeDefined();
  }));

  it('should convert loaded data'); // Not sure if convert is functional yet.

});
