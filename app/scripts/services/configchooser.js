'use strict';

/**
 * @ngdoc service
 * @name axisJsApp.configChooser
 * @description
 * # configChooser
 * Factory in the axisJsApp.
 */
angular.module('axisJSApp')
  .factory('configChooser', function (cnOffCanvas) {
    return cnOffCanvas({
      controller: function ($scope, localStorageService, $window, configProvider) {
        this.name = 'Choose Configuration';
        $scope.themes = [];
        configProvider.then(function(res){
          $scope.themes = res.themes;
        });
        $scope.setConfig = function(config) {
          localStorageService.set('config', config);
          $window.location.reload();
        };
      },
      templateUrl: 'partials/configChooser.html' 
    });
  });
