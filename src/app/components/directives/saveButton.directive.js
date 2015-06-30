'use strict';

/**
 * @ngdoc directive
 * @name AxisJS.directive:saveButton
 * @description
 * # saveButton
 */
angular.module('axis')
  .directive('saveButton', function () {
    return {
      templateUrl: 'app/partials/saveButton.html',
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.buttonType = attrs.type;
        scope.items = attrs.type === 'export' ? scope.appConfig.export : scope.appConfig.save;
      }
    };
  });
