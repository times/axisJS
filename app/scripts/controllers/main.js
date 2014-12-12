/**
 * @ngdoc function
 * @name axisJSApp.controller:MainCtrl
 * @description
 * Main controller. Populates and links the input fields.
 */

/* global Papa*/
'use strict';

angular.module('axisJSApp')
  .controller('MainCtrl', ['chartProvider', 'configChooser', 'appConfig', '$scope', function (chartProvider, configChooser, appConfig, $scope) {
    $scope.appConfig = appConfig;
    $scope.appConfig.toggleChooser = configChooser.toggle;
    $scope.inputs = {};
    $scope.columns = [];
    $scope.chartData = {};
    $scope.config = chartProvider(appConfig).config;
    $scope.chartTypes = chartProvider(appConfig).chartTypes;
    $scope.axesConfig = chartProvider(appConfig).axesConfig;

    // TODO put the following into a CSV input service
    $scope.inputs.csvData = 'data1\tdata2\n30\t50\n200\t20\n100\t10\n400\t40\n150\t15\n250\t25';

    // TODO find somewhere smarter to put this
    $scope.config.background = false;
    $scope.config.backgroundColor = $scope.appConfig.backgroundColor ? $scope.appConfig.backgroundColor : 'white';

    $scope.updateData = function() {
      if ($scope.inputs.csvData) {
        $scope.chartData = []; // Empty, or else new column names will break ng-grid
        $scope.columns = []; // Clear existing
        $scope.config.data.columns = [];
        var parserConfig = {
          header: true
        };

        // Detect TSV; fallback to auto-detection. @see #39.
        if ($scope.inputs.csvData.match('\t')) {
          parserConfig.delimiter = '\t';
        }

        $scope.chartData = Papa.parse($scope.inputs.csvData, parserConfig).data;
        // n.b., you can also use rows in C3 instead, which is like Papa.parse() without
        // header: true. TODO for anyone wanting to play some code golf...

        if ($scope.chartData.length > 0) {
          $scope.columns = Object.keys($scope.chartData[0]);
          angular.forEach($scope.columns, function(colName) {
            var column = [];
            column.push(colName);
            angular.forEach($scope.chartData, function(datum) {
              column.push(datum[colName]);
            });

            $scope.config.data.columns.push(column);
            if (typeof $scope.config.data.types[colName] === 'undefined') {
              if ($scope.config.chartGlobalType === 'series') {
                $scope.config.data.types[colName] = 'line'; // default to line.
              } else { // else the global chart type
                $scope.config.data.types[colName] = $scope.config.chartGlobalType;
              }

            }
          });
        }
      }
    };

    $scope.validateCSV = function(value) {
      var parserConfig = {
        header: true
      };

      // Detect TSV; fallback to auto-detection. @see #39.
      if (value.match('\t')) {
        parserConfig.delimiter = '\t';
      }

      var csv = Papa.parse(value, parserConfig);
      var noDelimiter = /^[^,\t\s]*\n[^,\t\s]*$/gm; // Edge-case for gauge charts (one column of data)
      return (csv.errors.length > 0 && !value.match(noDelimiter) ? false : true);
    };



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

    $scope.updateData(); // Push the initial data.

    // Debugging function — run getConfig() in the console to get current config object
    window.getConfig = function(){
      console.dir($scope.config);
      window.chartConfig = $scope.config;
    };

    // TODO abstract into an input service or something.
    // Repopulate if data is being sent in from WordPress.
    if (typeof parent.tinymce !== 'undefined' && typeof parent.tinymce.activeEditor.windowManager.getParams().axisJS !== 'undefined' ) {
      $scope.config = angular.fromJson(window.atob(parent.tinymce.activeEditor.windowManager.getParams().axisJS));
  		$scope.config.axis.x.tick.format = function (b){return'series'===$scope.config.chartGlobalType&&'category'!==$scope.config.axis.x.type?$scope.config.axis.x.prefix+b.toFixed($scope.config.axis.x.accuracy).toString()+$scope.config.axis.x.suffix:b;};
  		$scope.config.axis.y.tick.format = function (b){return'series'===$scope.config.chartGlobalType&&'category'!==$scope.config.axis.y.type?$scope.config.axis.y.prefix+b.toFixed($scope.config.axis.y.accuracy).toString()+$scope.config.axis.y.suffix:b;};
  		$scope.config.axis.y2.tick.format = function (b){return'series'===$scope.config.chartGlobalType&&'category'!==$scope.config.axis.y2.type?$scope.config.axis.y2.prefix+b.toFixed($scope.config.axis.y2.accuracy).toString()+$scope.config.axis.y2.suffix:b;};
  		$scope.config.donut.label.format = function (b,c){return(100*c).toFixed($scope.config.chartAccuracy)+'%';};
  		$scope.config.pie.label.format = function (b,c){return(100*c).toFixed($scope.config.chartAccuracy)+'%';};
  		$scope.config.gauge.label.format = function (b,c){return(100*c).toFixed($scope.config.chartAccuracy)+'%';};
      $scope.updateData();
    }
  }]);
