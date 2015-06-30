'use strict';

/**
 * @ngdoc service
 * @name AxisJS.outputProvider
 * @description
 * # outputProvider
 * Service that pulls in output services specified in config.yaml.
 */
angular.module('axis')
  .service('outputService', function(configProvider, $injector) {
    return function(scope, type){
      var output = $injector.get(type + 'Output');
      return output.export(scope);
    };
  });
