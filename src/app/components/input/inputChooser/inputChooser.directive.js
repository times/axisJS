/**
 * @ngdoc directive
 * @name AxisJS.directive:inputChooser
 * @description
 * Directive allowing the user choose an input method
 */
(function(){
  'use strict';
  
  angular
    .module('axis')
    .directive('inputChooser', inputChooser);
  
  /** @ngInject */  
  function inputChooser(inputService) {
    return {
      templateUrl: 'app/components/input/inputChooser/inputChooser.html',
      restrict: 'E',
      scope: true,
      link: function postLink(scope) {
        scope.isArray = angular.isArray;
        scope.template = false;
        scope.setTemplate = function(type) {
          scope.template = type;
          scope.appConfig.input = type; // Replace array with string form.
          scope.setInput(type); // Set input in MainController to this input provider.
          scope.inputs.inputData = inputService(scope.appConfig).defaultData; // Replace default data
          scope.config.inputType = type; // Set type in config object to restore on load.
          scope.updateData();
        };
      }
    };
  }
})();