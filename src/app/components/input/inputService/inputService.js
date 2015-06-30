'use strict';

/**
 * @ngdoc service
 * @name AxisJS.inputService
 * @description
 * # inputService
 * Service that pulls in input services specified in config.yaml.
 */
angular.module('axis')
  .service('inputService', function (configProvider, $injector) {
    return function(appConfig){
      return $injector.get(appConfig.input + 'Input');
    };
  });
