'use strict';

/**
 * @ngdoc service
 * @name axisJsApp.chartProvider
 * @description
 * # chartProvider
 * Service in the axisJsApp.
 */
angular.module('axisJSApp')
  .service('chartProvider', ['$injector', function chartProvider($injector) {
    return function(appConfig) {
      var framework = $injector.get(appConfig.framework + 'Service');
      var config = framework.getConfig(appConfig);
      config.generate = framework.generate;
      return config;
    };
  }]);
