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
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.buttonType = attrs.type;
        scope.items = attrs.type === 'export' ? scope.appConfig.export : scope.appConfig.save;
      }
    };
  });
