'use strict';

/**
 * @ngdoc service
 * @name axisJsApp.outputProvider
 * @description
 * # outputProvider
 * Service that pulls in output services specified in config.yaml.
 */
angular.module('axisJSApp')
  .service('outputService', function(configProvider, $injector) {
    return function(scope, type){
      var output = $injector.get(type + 'Output');
      return output.export(scope);
    };
  });
