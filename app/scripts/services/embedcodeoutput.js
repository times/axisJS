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

  embed.process = function(payload){
    var output = [];
    // var config = String(angular.toJson(payload.config));
    var config = JSONfn.stringify(payload.config).replace(/'/g, '\\\'').replace(/\\n/g, ' ');

    // Needs to be above script declarations.
    output.push('<div id="' + payload.config.bindto.replace('#', '') + '"></div>');

    angular.forEach(payload.dependencies.css, function(v){
      output.push('<link rel="stylesheet" href="' + v + '" />');
    });
    angular.forEach(payload.dependencies.js, function(v){
      output.push('<script src="' + v + '"></script>');
    });
    output.push(
      '<script type="text/javascript">(function(){' +
        'var configJSON = JSON.parse(\'' + config + '\');' +
        'var fixJson = function(obj){for(var i in obj)obj.hasOwnProperty(i)&&("string"==typeof obj[i]&&obj[i].match(/^function/)?(console.log("func"),obj[i]=eval("("+obj[i]+")")):"object"==typeof obj[i]&&fixJson(obj[i]));return obj};' +
        'var config = fixJson(configJSON);' +
        'c3.generate(config);' +
      '})();</script>'
    );

    return output.join('\n');
  };

  embed.complete = function(output){
    $modal.open({
      template: '<h1 style="text-align: center;">Embed code: <br /><small style="text-align: center;">Copy and paste this into a new HTML document</small></h1> <textarea width="100%" height="400" class="form-control">{{output}}</textarea>',
      controller: function($scope) {
        $scope.output = output;
      }
    });
  };

  return embed;
}]);
