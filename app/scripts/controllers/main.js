/**
 * @ngdoc function
 * @name axisJSApp.controller:MainCtrl
 * @description
 * Main controller. Populates and links the input fields.
 */

'use strict';

angular.module('axisJSApp')
  .controller('MainCtrl', function(chartProvider, inputService, configChooser, appConfig, $scope) {
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
    window.getConfig = function() {
      console.dir($scope);
      window.chartConfig = $scope.config;
    };

    /**
     * Sets up callback functions broken by JSON stringify.
     * TODO make this less ridiculous.
     */
    if (typeof parent.tinymce !== 'undefined' && typeof parent.tinymce.activeEditor.windowManager.getParams().axisJS !== 'undefined') {
      var fromWP = angular.fromJson(window.atob(parent.tinymce.activeEditor.windowManager.getParams().axisJS));
      $scope.config = fromWP;
      $scope.inputs.inputData = input.convert($scope.config.data.columns);
      $scope.config.axis.x.tick.format = function (b){return'series'===$scope.config.chartGlobalType&&'category'!==$scope.config.axis.x.type?$scope.config.axis.x.prefix+b.toFixed($scope.config.axis.x.accuracy).toString()+$scope.config.axis.x.suffix:b;};
      $scope.config.axis.y.tick.format = function (b){return'series'===$scope.config.chartGlobalType&&'category'!==$scope.config.axis.y.type?$scope.config.axis.y.prefix+b.toFixed($scope.config.axis.y.accuracy).toString()+$scope.config.axis.y.suffix:b;};
      $scope.config.axis.y2.tick.format = function (b){return'series'===$scope.config.chartGlobalType&&'category'!==$scope.config.axis.y2.type?$scope.config.axis.y2.prefix+b.toFixed($scope.config.axis.y2.accuracy).toString()+$scope.config.axis.y2.suffix:b;};
      $scope.config.donut.label.format = function (b,c){return(100*c).toFixed($scope.config.chartAccuracy)+'%';};
      $scope.config.pie.label.format = function (b,c){return(100*c).toFixed($scope.config.chartAccuracy)+'%';};
      $scope.config.gauge.label.format = function (b,c){return(100*c).toFixed($scope.config.chartAccuracy)+'%';};
      $scope.updateData();
    } else {
      /**
      * Push the initial data.
      */
      $scope.inputs.inputData = input.defaultData;
      $scope.updateData();
    }

  });
