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
        axes: { // This is used in a similar fashion to config.axis.
        },
        groups: { // Ditto.
        },
        type: '',
        types: {
          data1: 'line', // Currently must set explictly on initialisation to populate view.
          data2: 'line'
        },
        colors: {
          data1: '#78B8DF',
          data2: '#AFCBCE'
        }
      },
      axis: {
        x: {
          show: true,
          // tick: {
          //   format: function(d){return d;}
          // }
        },
        y: {
          show: true,
          // tick: {
          //   format: function(d){return d;}
          // }
        },
        y2: {
          show: false,
          // tick: {
          //   format: function(d){return d;}
          // }
        }
      },
      point: {
          show: false
      },
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

    $scope.config.groups = {};

    $scope.config.defaultColors = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];

    // Populate Initial
    $scope.inputs.csvData = 'data1\tdata2\n30\t50\n200\t20\n100\t10\n400\t40\n150\t15\n250\t25';
    $scope.config.axis.x.show = true;
    $scope.config.axis.y.show = true;
    $scope.config.axis.y2.show = false;
    $scope.config.axis.x.accuracy = 0;
    $scope.config.axis.y.accuracy = 0;
    $scope.config.axis.y2.accuracy = 0;
    $scope.config.axis.x.prefix = '';
    $scope.config.axis.y.prefix = '';
    $scope.config.axis.y2.prefix = '';
    $scope.config.axis.x.suffix = '';
    $scope.config.axis.y.suffix = '';
    $scope.config.axis.y2.suffix = '';
    $scope.config.axis.x.tick = {
      format: function (d) {
        if ($scope.config.chartGlobalType === 'series' && $scope.config.axis.x.type !== 'category') {
          return $scope.config.axis.x.prefix + d.toFixed($scope.config.axis.x.accuracy).toString() + $scope.config.axis.x.suffix;
        } else {
          return d;
        }
      }
    };
    $scope.config.axis.y.tick = {
      format: function (d) {
        if ($scope.config.chartGlobalType === 'series' && $scope.config.axis.y.type !== 'category') {
          return $scope.config.axis.y.prefix + d.toFixed($scope.config.axis.y.accuracy).toString() + $scope.config.axis.y.suffix;
        } else {
          return d;
        }
      }
    };
    $scope.config.axis.y2.tick = {
      format: function (d) {
        if ($scope.config.chartGlobalType === 'series' && $scope.config.axis.y2.type !== 'category') {
          return $scope.config.axis.y2.prefix + d.toFixed($scope.config.axis.y2.accuracy).toString() + $scope.config.axis.y2.suffix;
        } else {
          return d;
        }
      }
    };

    $scope.config.chartTitle = '';
    $scope.config.chartCredit = '';
    $scope.config.chartSource = '';
    $scope.config.chartWidth = 1000;
    $scope.config.chartGlobalType = 'series';
    $scope.config.chartAccuracy = 1;
    $scope.config.cms = (typeof parent.tinymce !== 'undefined' ? true : false);

    $scope.config.pie = {
      label: {
        format: function(val, percentage) {
          return (percentage * 100).toFixed($scope.config.chartAccuracy) + '%';
        }
      }
    };

    $scope.config.donut = {
      label: {
        format: function(val, percentage) {
          return (percentage * 100).toFixed($scope.config.chartAccuracy) + '%';
        }
      }
    };

    $scope.config.gauge = {
      label: {
        format: function(val, percentage) {
          return (percentage * 100).toFixed($scope.config.chartAccuracy) + '%';
        }
      }
    };


    $scope.updateData = function() {
      if ($scope.inputs.csvData) {
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
      }
    };

    $scope.validateCSV = function(value) {
      var csv = Papa.parse(value, {header: true});
      return (csv.errors.length > 0 ? false : true);
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

    window.getConfig = function(){
      console.dir($scope.config);
      window.chartConfig = $scope.config;
    };

    // Repopulate if data is being sent in from WordPress.
    if (typeof parent.tinymce !== 'undefined' && typeof parent.tinymce.activeEditor.windowManager.getParams().axisJS !== 'undefined' ) {
      $scope.config = angular.fromJson(window.atob(parent.tinymce.activeEditor.windowManager.getParams().axisJS));
      $scope.updateData();
    }


  });
