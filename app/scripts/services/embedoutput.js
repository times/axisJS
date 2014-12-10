'use strict';

/**
 * @ngdoc service
 * @name axisJsApp.embedOutput
 * @description
 * # embedOutput
 * Factory in the axisJsApp.
 */
angular.module('axisJSApp')
  .factory('embedOutput', function () {
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
