'use strict';

/**
 * @ngdoc service
 * @name axisJsApp.inputService
 * @description
 * # inputService
 * Service that pulls in input services specified in config.yaml.
 */
angular.module('axisJSApp')
  .service('inputService', ['configProvider', '$injector', function (configProvider, $injector) {
    return function(appConfig){
      return $injector.get(appConfig.input + 'Input');
    };
  }]);
