'use strict';
/*global $*/
/**
 * @ngdoc service
 * @name axisJsApp.WordPressOutput
 * @description
 * # WordPressOutput
 * Service in the axisJsApp.
 */
angular.module('axisJSApp')
  .factory('WordPressOutput', function WordPressOutput(GenericOutput) {
    var wordpress = angular.copy(GenericOutput);

    wordpress.serviceConfig = {
      type: 'export', // Options: 'save' and 'export'.
      label: 'Save to WordPress' // Label to use on button.
    };

    wordpress.preprocess = function(scope){
      var chartConfig = scope.config;
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
      $.post(parent.ajaxurl, payload, function(res){
        res = angular.fromJson(res);
        parent.tinymce.activeEditor.insertContent('<div class="mceNonEditable"><img src="' + res.attachmentURL + '" data-axisjs=\'' + window.btoa(angular.toJson(res)) + '\' class="mceItem axisChart" /></div><br />');
        parent.tinymce.activeEditor.windowManager.close();
      });
    };

    wordpress.complete = function(){
      console.log('Complete.');
    };

    wordpress.export = function(scope){
      var payload = wordpress.preprocess(scope);
      wordpress.process(payload);
      wordpress.complete();
    };

    return wordpress;
  });
