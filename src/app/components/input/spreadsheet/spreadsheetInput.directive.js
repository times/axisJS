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
    .directive('spreadsheetInput', spreadsheetInput);

  /** @ngInject */
  function spreadsheetInput() {
    return {
      templateUrl: 'app/components/input/spreadsheet/spreadsheetInput.directive.html',
      restrict: 'E',
      scope: {
        main: '=config'
      },
      controllerAs: 'sheet',
      controller: function($scope) {
        var main = $scope.main;
        var vm = this;

        vm.inputs = main.inputs;
        vm.updateData = function(){
          main.updateData();
        };
      }
    };
  }
})();
