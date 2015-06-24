'use strict';
/**
 * @ngdoc service
 * @name axisJsApp.WordPressOutput
 * @description
 * # WordPressOutput
 * Service in the axisJsApp.
 */
angular.module('axisJSApp')
  .factory('wordpressOutput', function wordpressOutput(GenericOutput, $http, $window) {
    var wordpress = angular.copy(GenericOutput);

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
            if (obj[key] instanceof Array) {
              for(var idx in obj[key]){
                var subObj = obj[key][idx];
                for(var subKey in subObj){
                  str.push(encodeURIComponent(key) + '[' + idx + '][' + encodeURIComponent(subKey) + ']=' + encodeURIComponent(subObj[subKey]));
                }
              }
            }
            else {
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
        console.dir([data, status, headers, config]);
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
        importData.config.axis.x.tick.format = function(b) {return'series' === importData.config.chartGlobalType&&'category'!==importData.config.axis.x.type?importData.config.axis.x.prefix+b.toFixed(importData.config.axis.x.accuracy).toString()+importData.config.axis.x.suffix:b;};
        importData.config.axis.y.tick.format = function(b) {return'series' === importData.config.chartGlobalType&&'category'!==importData.config.axis.y.type?importData.config.axis.y.prefix+b.toFixed(importData.config.axis.y.accuracy).toString()+importData.config.axis.y.suffix:b;};
        importData.config.axis.y2.tick.format = function(b) {return'series' === importData.config.chartGlobalType&&'category'!==importData.config.axis.y2.type?importData.config.axis.y2.prefix+b.toFixed(importData.config.axis.y2.accuracy).toString()+importData.config.axis.y2.suffix:b;};
        importData.config.donut.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        importData.config.pie.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        importData.config.gauge.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        
        if (importData.config && importData.inputData) {
          return importData;
        }
      }
    };

    return wordpress;
  });
