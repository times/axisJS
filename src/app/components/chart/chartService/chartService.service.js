'use strict';

/**
 * @ngdoc service
 * @name AxisJS.chartProvider
 * @description
 * # chartProvider
 * Service in the AxisJS.
 */
angular.module('axis')
  .service('chartProvider', ['$injector', function chartProvider($injector) {
    return function(appConfig) {
      var framework = $injector.get(appConfig.framework + 'Service');
      var config = framework.getConfig(appConfig);
      config.generate = framework.generate;
      return config;
    };
  }]);
