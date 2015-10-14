/**
 * @ngdoc service
 * @name axis.wordpressOutput
 * @description
 * # wordpressOutput
 * Handles migrating data to and from AxisWP.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('wordpressOutput', wordpressOutput);

  /** @ngInject */
  function wordpressOutput(genericOutput, $http, $window) {
    function WordPressOutputServiceException(data, status, headers, config) {
      this.name = 'WordPressOutputServiceException';
      this.message = 'WordPressOutputServiceException: ' + status;
      this.data = data;
      this.status = status;
      this.headers = headers;
      this.config = config;
    }
    WordPressOutputServiceException.prototype = new Error();
    WordPressOutputServiceException.prototype.constructor = WordPressOutputServiceException;

    var wordpress = angular.copy(genericOutput);

    wordpress.serviceConfig = {
      type: 'export', // Options: 'save' and 'export'.
      label: 'Save to WordPress' // Label to use on button.
    };

    wordpress.preprocess = function(scope){
      var chartConfig = angular.copy(scope.config);
      chartConfig.axis.x.tick.format = chartConfig.axis.x.tick.format.toString();
      chartConfig.axis.y.tick.format = chartConfig.axis.y.tick.format.toString();
      chartConfig.axis.y2.tick.format = chartConfig.axis.y2.tick.format.toString();
      chartConfig.pie.label.format = chartConfig.pie.label.format.toString();
      chartConfig.donut.label.format = chartConfig.donut.label.format.toString();
      chartConfig.gauge.label.format = chartConfig.gauge.label.format.toString();
      var axisConfig = String(angular.toJson(chartConfig));
      var axisChart = String(angular.element('.savePNG').attr('href'));
      var axisWP = parent.tinymce.activeEditor.windowManager.getParams().axisWP;
      return {
        action: 'insert_axis_attachment',
        axisConfig: axisConfig,
        axisChart: axisChart,
        parentID: axisWP.parentID
      };
    };

    wordpress.process = function(payload){
      // Have WordPress process the data-URI PNG and return some config data
      $http.post(parent.ajaxurl, payload, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}, // $http sends as JSON, WP expects form.
        transformRequest: function(obj) { // Via http://stackoverflow.com/a/19270196/467760
          var str = [];
          for (var key in obj) {
            /* istanbul ignore next */
            if (obj[key] instanceof Array) { // Transform array into flat object.
              for(var idx in obj[key]){
                var subObj = obj[key][idx];
                for(var subKey in subObj){
                  str.push(encodeURIComponent(key) + '[' + idx + '][' + encodeURIComponent(subKey) + ']=' + encodeURIComponent(subObj[subKey]));
                }
              }
            } else { // Already flat; just push key-value pairs.
              str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
          }
          return str.join('&');
        }
      })
      .success(function(res){
        res = angular.fromJson(res);
        parent.tinymce.activeEditor.insertContent('<div class="mceNonEditable"><img width="100%" src="' + res.attachmentURL + '?' + new Date().getTime() + '" data-axisjs=\'' + window.btoa(angular.toJson(res)) + '\' class="mceItem axisChart" /></div><br />');
        parent.tinymce.activeEditor.windowManager.close();
      })
      .error(function(data, status, headers, config){
        throw new WordPressOutputServiceException(data, status, headers, config);
      });
    };

    wordpress.export = function(scope){
      var payload = wordpress.preprocess(scope);
      wordpress.process(payload);
      wordpress.complete();
    };

    wordpress.import = function(inputService){
      if (typeof parent.tinymce !== 'undefined' && typeof parent.tinymce.activeEditor.windowManager.getParams().axisJS !== 'undefined') {
        var importData = {};
        importData.config = angular.fromJson($window.atob(parent.tinymce.activeEditor.windowManager.getParams().axisJS));
        importData.inputData = inputService.convert(importData.config.data.columns);

        /* jshint ignore:start */
        importData.config.axis.x.tick.format = function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.x.type){var b=d3.format(config.axis.x.commas?',':config.axis.x.accuracy);return config.axis.x.prefix+b(a).toString()+config.axis.x.suffix}return a};
        importData.config.axis.y.tick.format = function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.y.type){var b=d3.format(config.axis.y.commas?',':config.axis.y.accuracy);return config.axis.y.prefix+b(a).toString()+config.axis.y.suffix}return a};
        importData.config.axis.y2.tick.format = function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.y2.type){var b=d3.format(config.axis.y2.commas?',':config.axis.y2.accuracy);return config.axis.y2.prefix+b(a).toString()+config.axis.y2.suffix}return a};
        importData.config.donut.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        importData.config.pie.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        importData.config.gauge.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        /* jshint ignore:end */

        if (importData.config && importData.inputData) {
          return importData;
        }
      }
    };

    return wordpress;
  }
})();
