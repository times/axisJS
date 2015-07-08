/**
 * @ngdoc service
 * @name axis.chartService
 * @description
 * # chartService
 * Injects the correct chart framework based on YAML config.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .service('chartService', chartService);
  
  /** @ngInject */
  function chartService($injector) {
    return function(appConfig) {
      var framework = $injector.get(appConfig.framework + 'Service');
      var config = framework.getConfig(appConfig);
      
      config.getConfig = function() {
        return framework.getConfig(appConfig).config;
      };
      
      config.generate = framework.generate;
      return config;
    };
  }
})();