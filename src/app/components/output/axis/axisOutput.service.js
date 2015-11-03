/**
 * @ngdoc service
 * @name axis.axisOutput
 * @description
 * # axisOutput
 * Service for outputting to Axis Server or AxisMaker.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('axisOutput', axisOutput);

  /** @ngInject */
  function axisOutput(genericOutput, $window, chartService) {
    var maker = angular.copy(genericOutput);
    var parent = $window.parent;

    maker.serviceConfig = {
      type: 'export', // Options: 'save' and 'export'.
      label: 'Save' // Label to use on button.
    };

    maker.preprocess = function(scope) {
      var chartConfig = angular.copy(scope.config);
      chartConfig = chartService(scope.appConfig).saveCallbacks(chartConfig);
      var chartTitle = chartConfig.hasOwnProperty('chartTitle') ? chartConfig.chartTitle : 'A Chart';
      var axisConfig = String(angular.toJson(chartConfig));
      var axisChart = String(angular.element('.savePNG').attr('href'));
      return {
        config: axisConfig,
        png: axisChart,
        title: chartTitle
      };
    };

    maker.process = function(payload) {
      // Have use PostMessage to push outside the iframe
      parent.postMessage(
        JSON.stringify(payload),
        '*' // The intended origin, in this example we use the any origin wildcard.
      );
    };

    /* istanbul ignore next */
    maker.complete = function() {
      console.log('Complete.');
    };

    maker.export = function(scope) {
      var payload = maker.preprocess(scope);
      maker.process(payload);
      maker.complete();
    };

    maker.import = function(inputService, appConfig) {
      if (typeof parent.axisConfig !== 'undefined') {
        var importData = {};
        importData.config = angular.fromJson(parent.axisConfig);
        importData.inputData = inputService.convert(importData.config.data.columns);

        var config = importData.config;
        importData.config = chartService(appConfig).restoreCallbacks(importData.config);

        if (importData.config && importData.inputData) {
          return importData;
        }
      }
    };

    return maker;
  }
})();
