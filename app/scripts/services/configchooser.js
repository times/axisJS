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
      controller: function () {
        this.name = 'Choose Configuration';
      },
      controllerAs: 'ConfigCtrl',
      templateUrl: 'partials/configChooser.html' 
    });
  });
