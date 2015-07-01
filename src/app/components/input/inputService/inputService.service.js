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
      return $injector.get(appConfig.input + 'Input');
    };
  }
})();