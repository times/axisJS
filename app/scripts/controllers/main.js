/* global ngGridFlexibleHeightPlugin, Papa*/
'use strict';

/**
 * @ngdoc function
 * @name axisJSApp.controller:MainCtrl
 * @description
 * Main controller. Populates and links the input fields.
 */
angular.module('axisJSApp')
  .controller('MainCtrl', function ($scope) {
    $scope.inputs = {};
    $scope.columns = [];
    $scope.chartData = {};
    $scope.gridOptions = {
      data: 'chartData',
      plugins: [
        new ngGridFlexibleHeightPlugin()
      ]
    };

    $scope.config = {
      data: {
        x: '',
        y: '',
        y2: '',
        columns: [
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 50, 20, 10, 40, 15, 25]
        ],
        axes: {
        },
        type: '',
        types: {
          data1: 'line', // Currently must set explictly on initialisation to populate view.
          data2: 'line'
        },
        colors: {
          data1: '#44a4ed',
          data2: '#AEC1D0'
        }
      },
      axis: {
        x: {
          show: true,
          tick: {
            format: function(d){return d;}
          }
        },
        y: {
          show: true,
          tick: {
            format: function(d){return d;}
          }
        },
        y2: {
          show: false,
          tick: {
            format: function(d){return d;}
          }
        }
      }
    };

    $scope.chartTypes = [ // TODO: Abstract this into the ChartProvider service.
      'line',
      'step',
      'area',
      'area-step',
      'scatter',
      'bar',
      'spline',
      // 'donut', // These are handled via $scope.config.chartGlobalType
      // 'gauge',
      // 'pie'
    ];

    // Populate Initial
    $scope.inputs.csvData = 'data1\tdata2\n30\t50\n200\t20\n100\t10\n400\t40\n150\t15\n250\t25';
    $scope.config.axis.x.show = true;
    $scope.config.axis.y.show = true;
    $scope.config.axis.y2.show = false;
    $scope.config.chartTitle = '';
    $scope.config.chartCredit = '';
    $scope.config.chartSource = '';
    $scope.config.chartWidth = 1000;
    $scope.config.chartGlobalType = 'series';
    $scope.config.cms = (typeof parent.tinymce !== 'undefined' ? true : false);

    $scope.updateData = function() {
      $scope.chartData = []; // Empty, or else new column names will break ng-grid
      $scope.columns = []; // Clear existing
      $scope.config.data.columns = [];

      $scope.chartData = Papa.parse($scope.inputs.csvData, {header: true}).data;
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

    $scope.updateData(); // Push the initial data.
    //$scope.$watch('chartData', function(){$scope.apply;}); // needed? probably not...

    // Repopulate if data is being sent in from WordPress.
    if (typeof parent.tinymce !== 'undefined' && typeof parent.tinymce.activeEditor.windowManager.getParams().axisJS !== 'undefined' ) {
      console.log('yay');
      $scope.config = angular.fromJson(window.atob(parent.tinymce.activeEditor.windowManager.getParams().axisJS));
      $scope.updateData();
    }


  });
