/**
 * @ngdoc service
 * @name Axis.outputService
 * @description
 * # outputProvider
 * Service that pulls in output services specified in config.yaml.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .service('outputService', outputService);
    
  /** @ngInject */
  function outputService(configProvider, $injector) {
    return function(scope, type){
      var output = $injector.get(type + 'Output');
      return output.export(scope);
    };
  }
})();