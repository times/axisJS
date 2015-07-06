/**
 * @ngdoc directive
 * @name AxisJS.directive:addColorDataAttributes
 * @description
 * Lame hack to add data attributes to select options, for Bootstrap Color Picker.
 * Might be doable with $watch instead of $timeout. Feels sloppy doing it that way...
 */
(function(){
  'use strict';
  
  angular
    .module('axis')
    .directive('addColorDataAttributes', addColorDataAttributes);
  
  /** @ngInject */  
  function addColorDataAttributes($timeout) {
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
  }
})();