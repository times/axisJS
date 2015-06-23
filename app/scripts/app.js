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
    'ui.router',
    'ui.bootstrap',
    'minicolors',
    'cn.offCanvas',
    'ngHandsontable'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl',
        resolve: {
          appConfig: ['configProvider', '$rootScope', function(configProvider, $rootScope) {
            $rootScope.version = '1.0.3';
            return configProvider;
          }]
        }
      });
  }]);
