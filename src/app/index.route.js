/**
 * @ngdoc overview
 * @name AxisJS
 * @description
 * # AxisJS Routes
 *
 * Main route module of the application. Bootstraps config via ui-router.
 */

(function() {
  'use strict';

  angular
    .module('axis')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController as main',
        resolve: {
          appConfig: function(configProvider, $rootScope) {
            $rootScope.version = '1.1.0';
            return configProvider;
          }
        }
      });
  }

})();
