/**
 * @ngdoc overview
 * @name axisJSApp
 * @description
 * # axisJSApp
 *
 * Main module of the application. Bootstraps config via ui-router.
 */

 'use strict';
angular
  .module('axisJSApp', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui',
    'ui.router'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('root', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl',
        resolve: {
          appConfig: function(configProvider, $rootScope) {
            $rootScope.version = '0.2.2';
            return configProvider;
          }
        }
      });
  });
