'use strict';

/**
 * @ngdoc function
 * @name axisJsApp.controller:HeadCtrl
 * @description
 * # HeadCtrl
 * Controller of the axisJsApp
 */
angular.module('axisJSApp')
  .controller('HeadCtrl', function (configProvider, $scope) {
    configProvider.then(function(appConfig){
      $scope.stylesheet = typeof appConfig.stylesheet !== 'undefined' ? appConfig.stylesheet : '';
      $scope.fonts = typeof appConfig.fonts !== 'undefined' ? appConfig.fonts : [];
    });
  });
