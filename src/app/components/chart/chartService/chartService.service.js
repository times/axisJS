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
      var chart = renderer.getConfig(appConfig);

      chart.getConfig = function() {
        return renderer.getConfig(appConfig).config;
      };

      chart.generate = renderer.generate;
      chart.watchers = renderer.watchers.map(function(v){
        return 'main.config.' + v;
      });

      return chart;
    };
  }
})();
