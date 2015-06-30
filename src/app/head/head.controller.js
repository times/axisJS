/**
 * @ngdoc function
 * @name AxisJS.controller:HeadController
 * @description
 * # HeadController
 * Adds stylesheets, fonts and other stuff in the `<head>` section.
 */

(function() {
  'use strict';

  angular
    .module('axis')
    .controller('HeadController', HeadController);

  /** @ngInject */
  function HeadController($scope, configProvider) {
    configProvider.then(function(appConfig){
      $scope.conf = appConfig;
      $scope.stylesheet = typeof appConfig.stylesheet !== 'undefined' ? appConfig.stylesheet : '';
      $scope.fonts = typeof appConfig.fonts !== 'undefined' ? appConfig.fonts : [];
    });
  }
})();
