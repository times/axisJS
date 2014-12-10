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
      .state('index', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          appConfig: function(configProvider) {
            return configProvider;
          }
        }
      });
  });
