/**
 * @ngdoc service
 * @name axisJsApp.githubOutput
 * @description
 * # axisMaker Output
 * Service for outputting to AxisMaker.
 */

'use strict';

angular.module('axisJSApp')
  .factory('axisOutput', function(GenericOutput) {
    var maker = angular.copy(GenericOutput);

    maker.serviceConfig = {
      type: 'export', // Options: 'save' and 'export'.
      label: 'Save' // Label to use on button.
    };

    maker.preprocess = function(scope) { // @TODO Replace with JSONfn.
      var chartConfig = scope.config;
      chartConfig.axis.x.tick.format = chartConfig.axis.x.tick.format.toString();
      chartConfig.axis.y.tick.format = chartConfig.axis.y.tick.format.toString();
      chartConfig.axis.y2.tick.format = chartConfig.axis.y2.tick.format.toString();
      chartConfig.pie.label.format = chartConfig.pie.label.format.toString();
      chartConfig.donut.label.format = chartConfig.donut.label.format.toString();
      chartConfig.gauge.label.format = chartConfig.gauge.label.format.toString();
      var chartTitle = chartConfig.chartTitle;
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
      window.parent.postMessage(
        JSON.stringify(payload),
        '*' // The intended origin, in this example we use the any origin wildcard.
      );
    };

    maker.complete = function() {
      console.log('Complete.');
    };

    maker.export = function(scope) {
      var payload = maker.preprocess(scope);
      maker.process(payload);
      maker.complete();
    };
    
    maker.import = function(inputService) {
      if (typeof parent.axisConfig !== 'undefined') {
        var importData = {};
        importData.config = angular.fromJson(parent.axisConfig);
        importData.inputData = inputService.convert(importData.config.data.columns);
        importData.config.axis.x.tick.format = function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.x.type){var b=d3.format(config.axis.x.commas?',':config.axis.x.accuracy);return config.axis.x.prefix+b(a).toString()+config.axis.x.suffix}return a};
        importData.config.axis.y.tick.format = function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.y.type){var b=d3.format(config.axis.y.commas?',':config.axis.y.accuracy);return config.axis.y.prefix+b(a).toString()+config.axis.y.suffix}return a};
        importData.config.axis.y2.tick.format = function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.y2.type){var b=d3.format(config.axis.y2.commas?',':config.axis.y2.accuracy);return config.axis.y2.prefix+b(a).toString()+config.axis.y2.suffix}return a};
        importData.config.donut.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        importData.config.pie.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        importData.config.gauge.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        
        if (importData.config && importData.inputData) {
          return importData;
        }
      }
    };

    return maker;
  });
