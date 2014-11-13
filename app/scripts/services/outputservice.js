'use strict';

/**
 * @ngdoc service
 * @name axisJsApp.outputProvider
 * @description
 * # outputProvider
 * Service that pulls in output services specified in config.yaml.
 */
angular.module('axisJSApp')
  .service('outputService', ['configProvider', '$injector', function (configProvider, $injector) {
    return function(scope, type){
      configProvider.then(function(appConfig){
        angular.forEach(appConfig[type], function(value){
          var output = $injector.get(value + 'Output');
          output.export(scope);
        });
      });
    };
  }]);
