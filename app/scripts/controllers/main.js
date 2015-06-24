/**
 * @ngdoc function
 * @name axisJSApp.controller:MainCtrl
 * @description
 * Main controller.
 * Pulls in config from the providers and sets up either the initial/default data or the loaded data.
 */

'use strict';

angular.module('axisJSApp')
  .controller('MainCtrl', function($scope, $injector, $window, appConfig, chartProvider, inputService, configChooser) {
    /**
     * Sets up the configuration object from YAML
     */
    var input = inputService(appConfig);
    var chart = chartProvider(appConfig);
    
    $scope.inputs = {};
    $scope.columns = [];
    $scope.chartData = {};
    $scope.appConfig = appConfig;
    $scope.appConfig.toggleChooser = configChooser.toggle;
    $scope.config = chart.config;
    $scope.chartTypes = chart.chartTypes;
    $scope.axesConfig = chart.axesConfig;
    $scope.config.background = appConfig.background ? appConfig.background : false;
    $scope.config.backgroundColor = appConfig.backgroundColor ? appConfig.backgroundColor : 'white';
    

    /**
     * Updates the data. Runs whenever data is added, deleted or modified.
     */
    $scope.updateData = function() {
      // console.log($scope.inputs);
      return input.input($scope);
    };

    /**
     * Validates the data. Runs on data change.
     */
    $scope.validateData = function(value) {
      return input.validate(value);
    };

    /**
     * Sets the global chart type.
     */
    $scope.setGlobalType = function(type) {
      chart.setGlobalType(type, $scope);
    };

    /**
     * Sets data groups. Used with stacked bar charts.
     * TODO move to c3Service
     */
    $scope.setGroups = function() {
      chart.setGroups($scope);
    };

    /**
     * Debugging function — run getConfig() in the console to log current config object.
     * Also attaches $scope.config to window.chartConfig so it's visible in console.
     */
    $window.getConfig = function() {
      console.dir($scope);
      $window.chartConfig = $scope.config;
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
          $scope.inputs.inputData = importData.inputData;
          $scope.config = importData.config;
        }
      }
    });
    
    // If the above services don't populate inputData, populate it with default data.
    if (!$scope.inputs.inputData) {
      $scope.inputs.inputData = input.defaultData;
    }
    
    // Finally, update and render.
    $scope.updateData();

  });
