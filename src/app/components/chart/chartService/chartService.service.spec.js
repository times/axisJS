describe('Service: chartProvider', function () {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  var chartProvider,
      chartService,
      appConfig = {
        renderer: 'c3',
        colors: [
          'red',
          'blue'
        ],
        defaults: {
          'grid x': true,
          'grid y': true
        }
      };

  beforeEach(inject(function (_chartService_) {
    chartProvider = _chartService_;
    chartService = chartProvider(appConfig);
  }));

  it('should load c3Service', function () {
    expect(chartService.dependencies.js[1]).toBe('//cdnjs.cloudflare.com/ajax/libs/c3/0.4.7/c3.min.js');
  });

});
