/**
 * @ngdoc directive
 * @name AxisJS.directive:saveButton
 * @description
 * # saveButton
 */

(function(){
  'use strict';
  
  angular.module('axis')
    .directive('saveButton', saveButton);
    
  function saveButton() {
    return {
      templateUrl: 'app/components/saveButton/saveButton.html',
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.buttonType = attrs.type;
        scope.items = attrs.type === 'export' ? scope.appConfig.export : scope.appConfig.save;
      }
    };
  }
})();