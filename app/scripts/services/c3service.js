'use strict';

/**
 * @ngdoc service
 * @name axisJsApp.c3Service
 * @description
 * # c3Service
 * Factory in the axisJsApp.
 */
angular.module('axisJSApp')
  .factory('c3Service', function () {
    return {
      getConfig: function (appConfig) {
        var config = {
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
              data1: appConfig.colors[0].value,
              data2: appConfig.colors[1].value
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
          legend: {
            position: 'bottom',
            show: true
          }
        };

        var chartTypes = [
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

        config.groups = {};

        // Populate Initial
        config.axis.x.show = true;
        config.axis.y.show = true;
        config.axis.y2.show = false;
        config.axis.x.accuracy = 0;
        config.axis.y.accuracy = 0;
        config.axis.y2.accuracy = 0;
        config.axis.x.prefix = '';
        config.axis.y.prefix = '';
        config.axis.y2.prefix = '';
        config.axis.x.suffix = '';
        config.axis.y.suffix = '';
        config.axis.y2.suffix = '';
        config.axis.x.tick = {
          format: function (d) {
            if (config.chartGlobalType === 'series' && config.axis.x.type !== 'category') {
              return config.axis.x.prefix + d.toFixed(config.axis.x.accuracy).toString() + config.axis.x.suffix;
            } else {
              return d;
            }
          }
        };
        config.axis.y.tick = {
          format: function (d) {
            if (config.chartGlobalType === 'series' && config.axis.y.type !== 'category') {
              return config.axis.y.prefix + d.toFixed(config.axis.y.accuracy).toString() + config.axis.y.suffix;
            } else {
              return d;
            }
          }
        };
        config.axis.y2.tick = {
          format: function (d) {
            if (config.chartGlobalType === 'series' && config.axis.y2.type !== 'category') {
              return config.axis.y2.prefix + d.toFixed(config.axis.y2.accuracy).toString() + config.axis.y2.suffix;
            } else {
              return d;
            }
          }
        };

        config.chartTitle = '';
        config.chartCredit = '';
        config.chartSource = '';
        config.chartWidth = 1000;
        config.chartGlobalType = 'series';
        config.chartAccuracy = 1;
        config.cms = (typeof parent.tinymce !== 'undefined' ? true : false);

        config.pie = {
          label: {
            format: function(val, percentage) {
              return (percentage * 100).toFixed(config.chartAccuracy) + '%';
            }
          }
        };

        config.donut = {
          label: {
            format: function(val, percentage) {
              return (percentage * 100).toFixed(config.chartAccuracy) + '%';
            }
          }
        };

        config.gauge = {
          label: {
            format: function(val, percentage) {
              return (percentage * 100).toFixed(config.chartAccuracy) + '%';
            }
          }
        };

        return {config: config, chartTypes: chartTypes};
      }
    };
  });
