'use strict';

/**
 * @ngdoc directive
 * @name axisJsApp.directive:addColors
 * @description
 * # Lame hack to add data attributes to select options, for Bootstrap Color Picker.
 */
angular.module('axisJSApp')
  .directive('addColors', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        $timeout(function(){
          element.children('option').each(function(){
            var elm = angular.element(this);
            elm.attr('data-color', elm.text());
          });
          element.colorselector();
        }, 500);
      }
    };
  }]);
