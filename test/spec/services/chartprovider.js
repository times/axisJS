'use strict';

describe('Service: chartProvider', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  var chartProvider,
      chartService,
      appConfig = {
        framework: 'c3',
        colors: [
          'red',
          'blue'
        ],
        defaults: {
          'grid x': true,
          'grid y': true
        }
      };

  beforeEach(inject(function (_chartProvider_) {
    chartProvider = _chartProvider_;
    chartService = chartProvider(appConfig);
  }));

  it('should load c3Service', function () {
    expect(chartService.dependencies.js[1]).toBe('//cdnjs.cloudflare.com/ajax/libs/c3/0.4.7/c3.min.js');
  });

});
