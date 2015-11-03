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
    var chart = vm.chart = chartService(appConfig);

    vm.inputs = {};
    vm.columns = [];
    vm.chartData = {};
    vm.appConfig = appConfig;
    vm.config = chart.config;
    vm.chartTypes = chart.chartTypes;
    vm.axesConfig = chart.axesConfig;
    vm.config.background = appConfig.background ? appConfig.background : false;
    vm.config.backgroundColor = appConfig.backgroundColor ? appConfig.backgroundColor : 'white';

    /**
     * Toggle the configuration chooser panel.
     * @return {void}
     */
    /* istanbul ignore next */
    vm.toggleChooser = function() {
      configChooser();
    };

    /**
     * Opens and closes datepicker in the stock symbol picker.
     * I have no idea why it is here and not there.
     * @type {Object}
     */
    /* istanbul ignore next */
    vm.datepicker = {
      isOpen: false,
      toggle: function($event){
        $event.preventDefault();
        $event.stopPropagation();
        this.isOpen = true;
      }
    };


    /**
     * Updates the data. Runs whenever data is added, deleted or modified.
     * @return {Object} MainController scope.
     */
    vm.updateData = function() {
      vm = input.input(vm);
      return vm;
    };

    /**
     * Validates data against chosen input picker.
     * @param  {string} value Value to validate
     * @return {boolean}       Whether string validates.
     */
    vm.validateData = function(value) {
      return input.validate(value);
    };

    /**
     * Resets the config to factory default from chartService.
     *
     * N.b., there's a bug (axisWP#16) wherein this keeps nuking config.issueType. The line
     * below resolves it, though it's a short-term fix given I'm not entirely sure what's going on.
     *
     * @return {void}
     */
    vm.resetConfig = function(type) {
      try {
        vm.config = chart.getConfig();
        vm.config.inputType = type; // Explicitly set inputType. See Axis-WordPress#16.
      } catch(e) {
        throw new MainControllerException('resetConfig failed');
      }
    };

    /**
     * Sets the global chart type.
     * @param  {string} type Type of chart
     * @return {void}
     */
    vm.setGlobalType = function(type) {
      chart.setGlobalType(type, vm);
      try {
        chart.setGlobalType(type, vm);
      } catch(e) {
        throw new MainControllerException('setGlobalType failed');
      }

    };

    /**
     * Sets data groups. Used with stacked bar charts.
     * TODO move to c3Service
     * @return {void}
     */
    vm.setGroups = function() {
      try {
        chart.setGroups(vm);
      } catch(e) {
        throw new MainControllerException('setGroups failed');
      }

    };

    /**
     * Sets the input service. Used by inputChooser.
     * @return {void}
     */
    vm.setInput = function() {
      input = inputService(appConfig);
    };

    /**
     * Checks whether any of the data are being displayed as areas.
     * TODO move to chartProvider.
     * @return {void}
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
     * Returns whether the chart type needs an axis.
     * @return {boolean} Whether the current chart global type needs an axis.
     */
    vm.hasAxis = function(){

    };

    /**
     * Debugging function — run getConfig() in the console to log current config object.
     * Also attaches $scope.config to window.chartConfig so it's visible in console.
     * @return {object} Chart config object.
     */
    /* istanbul ignore next */
    $window.getConfig = function() {
      console.dir(vm);
      $window.chartConfig = vm.config;
      return vm;
    };

    /**
     * Load data from external sources if present
     * @param  {array} appConfig.export List of all exporters in config file.
     * @return {void}
     */
    angular.forEach(appConfig.export, function(type){
      var output = $injector.get(type.toLowerCase().replace(' ', '') + 'Output');
      var importData;
      if (typeof output.import !== 'undefined') {
        importData = output.import(input, appConfig);
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

    function MainControllerException(message) {
      this.name = 'MainControllerException';
      this.message = message;
    }
    MainControllerException.prototype = new Error();
    MainControllerException.prototype.constructor = MainControllerException;
  }
})();
