'use strict';

/**
 * @ngdoc function
 * @name axisJsApp.controller:HeadCtrl
 * @description
 * # HeadCtrl
 * Controller of the axisJsApp
 */
angular.module('axisJSApp')
  .controller('HeadCtrl', ['configProvider', '$scope', function (configProvider, $scope) {
    configProvider.then(function(appConfig){
      $scope.conf = appConfig;
      $scope.stylesheet = typeof appConfig.stylesheet !== 'undefined' ? appConfig.stylesheet : '';
      $scope.fonts = typeof appConfig.fonts !== 'undefined' ? appConfig.fonts : [];
    });
  }]);
