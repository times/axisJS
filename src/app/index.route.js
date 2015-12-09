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
      .state('main', {
        abstract: true,
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController as main',
        resolve: {
          appConfig: function(configProvider, $rootScope) { /* istanbul ignore next */
            $rootScope.version = '1.1.0';
            return configProvider;
          }
        }
      })
      .state('main.new', {
        name: 'new',
        url: '/new',
        controller: 'NewController as newCtrl'
      })
      .state('main.edit', {
        name: 'edit',
        url: '/edit/:id',
        controller: 'EditController as editCtrl'
      })
      .state('main.edit.load', {
        url: '/edit/',
        controller: 'LoadController as loadCtrl'
      });
  }

})();
