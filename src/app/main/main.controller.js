/**
 * @ngdoc function
 * @name AxisJS.controller:MainController
 * @description
 * Main controller.
 * Pulls in config from the providers and sets up either the initial/default data or the loaded data.
 */

(function() {
  'use strict';

  angular
    .module('axis')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($injector, $window, appConfig, chartService, inputService, configChooser) {
    var vm = this;

    /**
     * Sets up the configuration object from YAML
     */
    var input = inputService(appConfig);
    var chart = chartService(appConfig);

    vm.inputs = {};
    vm.columns = [];
    vm.chartData = {};
    vm.appConfig = appConfig;
    vm.config = chart.config;
    vm.chartTypes = chart.chartTypes;
    vm.axesConfig = chart.axesConfig;
    vm.config.background = appConfig.background ? appConfig.background : false;
    vm.config.backgroundColor = appConfig.backgroundColor ? appConfig.backgroundColor : 'white';

    vm.toggleChooser = function() {
      configChooser();
    };

    vm.datepicker = {
      isOpen: false
    };
    vm.datepicker.toggle = function($event){
      $event.preventDefault();
      $event.stopPropagation();
      vm.datepicker.isOpen = true;
    };


    /**
     * Updates the data. Runs whenever data is added, deleted or modified.
     */
    vm.updateData = function() {
      vm = input.input(vm);
      return vm;
    };

    /**
     * Validates the data. Runs on data change.
     */
    vm.validateData = function(value) {
      return input.validate(value);
    };

    /**
     * Resets the config to factory default from chartService
     */
    vm.resetConfig = function() {
      try {
        vm.config = chart.getConfig();
      } catch(e) {
        console.dir(e);
      }

    };

    /**
     * Sets the global chart type.
     */
    vm.setGlobalType = function(type) {
      try {
        chart.setGlobalType(type, vm);
      } catch(e) {
        console.dir(e);
      }

    };

    /**
     * Sets data groups. Used with stacked bar charts.
     * TODO move to c3Service
     */
    vm.setGroups = function() {
      try {
        chart.setGroups(vm);
      } catch(e) {
        console.dir(e);
      }

    };

    /**
     * Sets the input service. Used by inputChooser.
     */
    vm.setInput = function() {
      input = inputService(appConfig);
    };

    /**
     * Checks whether any of the data are being displayed as areas.
     * TODO move to chartProvider.
     */
    vm.hasAreas = function(){
      for (var i in vm.config.data.types) {
        if (vm.config.data.types[i].match('area')) {
          return true;
        }
      }

      return false; // return false if no areas.
    };

    /**
     * Debugging function — run getConfig() in the console to log current config object.
     * Also attaches $scope.config to window.chartConfig so it's visible in console.
     */
    $window.getConfig = function() {
      console.dir(vm);
      $window.chartConfig = vm.config;
    };

    /**
     * Load data from external sources if present
     * @param  {array} appConfig.export List of all exporters in config file.
     */
    angular.forEach(appConfig.export, function(type){
      var output = $injector.get(type.toLowerCase().replace(' ', '') + 'Output');
      var importData;
      if (typeof output.import !== 'undefined') {
        importData = output.import(input);
        if (importData) {
          vm.inputs.inputData = importData.inputData;
          vm.config = importData.config;
        }
      }
    });

    // If the above services don't populate inputData, populate it with default data.
    if (!vm.inputs.inputData) {
      vm.inputs.inputData = input.defaultData;
    }

    // Finally, update and render.
    vm.updateData();
  }
})();
