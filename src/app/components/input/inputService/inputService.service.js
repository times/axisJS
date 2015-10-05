/**
 * @ngdoc service
 * @name axis.inputService
 * @description
 * # inputService
 * Service that pulls in input services specified in config.yaml.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .service('inputService', inputService);

  /** @ngInject */
  function inputService(configProvider, $injector) {
    return function(appConfig){
      if (!angular.isUndefined(appConfig) && !angular.isUndefined(appConfig.input)) {
        if (appConfig.input.constructor === Array) {
          return $injector.get(appConfig.input[0] + 'Input'); // If multiple, use the first to populate data.
        } else {
          return $injector.get(appConfig.input + 'Input');
        }
      }
    };
  }
})();
