'use strict';

/**
 * @ngdoc service
 * @name axisJsApp.csvService
 * @description
 * # csvService
 * Factory in the axisJsApp.
 */
angular.module('axisJSApp')
  .factory('csvService', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
