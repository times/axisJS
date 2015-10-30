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

  function inputChooser() {
    return {
      templateUrl: 'app/components/input/inputChooser/inputChooser.html',
      restrict: 'E',
      scope: {
        'main': '=config'
      },
      controllerAs: 'inputCtrl',
      controller: 'InputChooserController'
    };
  }

  angular
    .module('axis')
    .controller('InputChooserController', InputChooserController);

  /** @ngInject **/
  function InputChooserController($scope, inputService) {
    var main = $scope.main;
    var vm = this;

    vm.isArray = angular.isArray;
    vm.template = false;
    vm.setTemplate = function(type) {
      vm.template = type;
      main.appConfig.input = type; // Replace array with string form.
      main.setInput(type); // Set input in MainController to this input provider.
      main.resetConfig(type); // Reset chart config to default
      main.inputs.inputData = inputService(main.appConfig).defaultData; // Replace default data
      main.config.inputType = type; // Set type in config object to restore on load.
      main.updateData();
    };
  }
})();
