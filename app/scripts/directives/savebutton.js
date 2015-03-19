'use strict';

/**
 * @ngdoc directive
 * @name axisJsApp.directive:saveButton
 * @description
 * # saveButton
 */
angular.module('axisJSApp')
  .directive('saveButton', function () {
    return {
      templateUrl: 'partials/saveButton.html',
      scope: {
        buttonType: '@type',
        config: '='
      },
      // link: function postLink(scope, element, attrs) {
      //
      // }
    };
  });
