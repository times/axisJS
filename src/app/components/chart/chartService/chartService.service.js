/**
 * @ngdoc service
 * @name axis.chartService
 * @description
 * # chartService
 * Injects the correct chart renderer service based on YAML config.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .service('chartService', chartService);

  /** @ngInject */
  function chartService($injector) {
    return function(appConfig) {
      var renderer = $injector.get(appConfig.renderer + 'Service');
      var config = renderer.getConfig(appConfig);

      config.getConfig = function() {
        return renderer.getConfig(appConfig).config;
      };

      config.generate = renderer.generate;
      return config;
    };
  }
})();
