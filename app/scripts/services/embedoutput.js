'use strict';

/**
 * @ngdoc service
 * @name axisJsApp.embedOutput
 * @description
 * # embedOutput
 * Factory to generate embed codes, beautifully displayed in a handle little modal!
 */

angular.module('axisJSApp')
.factory('embedOutput', ['GenericOutput', 'chartProvider', '$modal', function embedOutput(GenericOutput, chartProvider, $modal) {
  var embed = angular.copy(GenericOutput);

  embed.serviceConfig = {
    type: 'export', // Options: 'save' and 'export'.
    label: 'Generate embed code' // Label to use on button.
  };

  embed.preprocess = function(scope){
    scope.config.bindto = '#chart-' + Math.floor((Math.random()*6)+1);

    return {
      config: scope.config,
      dependencies: chartProvider(scope.appConfig).dependencies
    };
  };

  embed.process = function(payload){
    var output = [];
    var config = String(angular.toJson(payload.config));

    // Needs to be above script declarations.
    output.push('<div id="' + payload.config.bindto.replace('#', '') + '"></div>');

    angular.forEach(payload.dependencies.css, function(v){
      output.push('<link rel="stylesheet" href="' + v + '" />');
    });
    angular.forEach(payload.dependencies.js, function(v){
      output.push('<script src="' + v + '"></script>');
    });
    output.push('<script type="text/javascript">(function(){c3.generate(' + config + ');})();</script>');

    return output.join('\n');
  };

  embed.complete = function(output){
    $modal.open({
      template: '<h1>Embed code: <br /><small>Copy and paste this into a new HTML document</small></h1> <textarea width="100%" height="400" class="form-control">{{output}}</textarea>',
      controller: function($scope) {
        $scope.output = output;
      }
    });
  };

  return embed;
}]);
