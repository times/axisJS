'use strict';

/**
 * @ngdoc service
 * @name axisJsApp.embedOutput
 * @description
 * # embedOutput
 * Factory to generate embed codes, beautifully displayed in a handle little modal!
 */

angular.module('axisJSApp')
.factory('embedcodeOutput', ['GenericOutput', 'chartProvider', '$modal', function (GenericOutput, chartProvider, $modal) {
  var embed = angular.copy(GenericOutput);

  embed.serviceConfig = {
    type: 'export', // Options: 'save' and 'export'.
    label: 'Generate embed code' // Label to use on button.
  };

  embed.preprocess = function(scope){
    var chartConfig = angular.copy(scope.config); // Needs to copy or else scope breaks. See #45.
    chartConfig.bindto = '#chart-' + Math.floor((Math.random()*10000)+1);
    return {
      config: chartConfig,
      dependencies: chartProvider(scope.appConfig).dependencies
    };
  };

  embed.process = function(payload) {
    var output = {};
    var deps = [];
    var code = [];
    var config = JSONfn.stringify(payload.config);

    // Needs to be above script declarations.
    deps.push('<div id="' + payload.config.bindto.replace('#', '') + '"></div>');

    angular.forEach(payload.dependencies.css, function(v) {
      deps.push('<link rel="stylesheet" href="' + v + '" />');
    });

    angular.forEach(payload.dependencies.js, function(v) {
      deps.push('<script src="' + v + '"></script>');
    });

    code.push(
      '<script type="text/javascript">(function(){',
        'var configJSON = ' + config + ';',
        'var fixJson = function(obj){for(var i in obj)obj.hasOwnProperty(i)&&("string"==typeof obj[i]&&obj[i].match(/^function/)?obj[i]=eval("("+obj[i]+")"):"object"==typeof obj[i]&&fixJson(obj[i]));return obj};',
        'var config = fixJson(configJSON);',
        'c3.generate(config);',
      '})();</script>'
    );

    output.complete = deps.concat(code).join("\n"); // TODO figure out how to pretty-print.
    output.partial = [deps[0]].concat(code).join("\n");
    
    return output;
  };

  embed.complete = function(output) {
    $modal.open({
      templateUrl: 'partials/outputModal.html',
      controller: function($scope) {
        $scope.includeDeps = true;
        $scope.output = $scope.includeDeps ? output.complete : output.partial;
        $scope.updateOutput = function(deps) {
          if (deps) {
            $scope.output = output.complete;
          } else {
            $scope.output = output.partial;
          }
        };
      }
    });
  };

  return embed;
}]);
