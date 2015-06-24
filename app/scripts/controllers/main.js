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
    $scope.appConfig = appConfig;
    $scope.appConfig.toggleChooser = configChooser.toggle;
    $scope.inputs = {};
    $scope.columns = [];
    $scope.chartData = {};
    $scope.config = chartProvider(appConfig).config;
    $scope.chartTypes = chartProvider(appConfig).chartTypes;
    $scope.axesConfig = chartProvider(appConfig).axesConfig;
    $scope.config.background = appConfig.background ? appConfig.background : false;
    $scope.config.backgroundColor = appConfig.backgroundColor ? appConfig.backgroundColor : 'white';
    var input = inputService(appConfig);

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
     * TODO move to c3Service
     */
    $scope.setGlobalType = function(type) {
      for (var key in $scope.config.data.types) {
        if ($scope.config.data.types.hasOwnProperty(key)) {
          if (type !== 'series') {
            $scope.config.data.types[key] = type;
          } else {
            $scope.config.data.types[key] = 'line';
          }

        }
      }
    };

    /**
     * Sets data groups. Used with stacked bar charts.
     * TODO move to c3Service
     */
    $scope.setGroups = function() {
      $scope.config.data.groups = [];
      for (var group in $scope.config.groups) {
        if ($scope.config.groups.hasOwnProperty(group)) {
          if (typeof $scope.config.data.groups[$scope.config.groups[group]] === 'undefined') {
            $scope.config.data.groups[$scope.config.groups[group]] = [];
          }
          $scope.config.data.groups[$scope.config.groups[group]].push(group);
        }
      }
    };

    // Debugging function — run getConfig() in the console to get current config object
    $window.getConfig = function() {
      console.dir($scope);
      $window.chartConfig = $scope.config;
    };

    // Load data from external sources if present
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
    
    if (!$scope.inputs.inputData) {
      $scope.inputs.inputData = input.defaultData;
    }
    $scope.updateData();

  });
