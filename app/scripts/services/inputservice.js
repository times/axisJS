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
    return function(scope, type){
      configProvider.then(function(appConfig){
        angular.forEach(appConfig[type], function(value){
          var input = $injector.get(value + 'Input');
          input.import(scope);
        });
      });
    };
  }]);
