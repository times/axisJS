/**
 * @ngdoc service
 * @name axis.c3Service
 * @description
 * # c3Service
 * Factory to render C3-based charts.
 * The following charts are currently supported:
 *   * line/spline
 *   * scatter
 *   * bar
 *   * pie
 *   * donut
 *   * gauge
 */

(function(){
'use strict';  

  angular
    .module('axis')
    .factory('c3Service', c3Service);
  
  /** @ngInject */
  function c3Service() {
    return {
      /**
       * Generates a chart based on config data
       * @param  {string} selectorID DOM ID to select
       * @param  {object} config     Config object passed in from scope
       * @return {object}            An instance of C3.js
       */
      generate: function(selectorID, config) {
        var chartConfig = angular.extend({bindto: '#' + selectorID}, config);
        return c3.generate(chartConfig);
      },

      /**
       * Builds a config object
       * @param {object} appConfig App config object via ConfigProvider.
       */
      getConfig: function (appConfig) {
        var defaultColors = [];
        angular.forEach(appConfig.colors, function(color){
          defaultColors.push(color.value);
        });

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
              data1: appConfig.defaults['y axis'],
              data2: appConfig.defaults['y axis']
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
          grid: {
            x: {
              show: typeof appConfig.defaults['grid x'] !== 'undefined' ? appConfig.defaults['grid x'] : false
            },
            y: {
              show: typeof appConfig.defaults['grid y'] !== 'undefined' ? appConfig.defaults['grid y'] : false
            }
          },
          axis: {
            x: {
              show: typeof appConfig.defaults['axis x'] !== 'undefined' ? appConfig.defaults['axis x'] : true,
              // tick: {
              //   format: function(d){return d;}
              // }
            },
            y: {
              show: typeof appConfig.defaults['axis y'] !== 'undefined' ? appConfig.defaults['axis y'] : true,
              invert: false
            },
            y2: {
              show: typeof appConfig.defaults['axis y2'] !== 'undefined' ? appConfig.defaults['axis y2'] : false,
              invert: false
            }
          },
          point: {
            show:  typeof appConfig.defaults.point !== 'undefined' ? appConfig.defaults.point : false
          },
          legend: {
            position: typeof appConfig.defaults['legend position'] !== 'undefined' ? appConfig.defaults['legend position'] : 'bottom',
            show:  typeof appConfig.defaults.legend !== 'undefined' ? appConfig.defaults.legend : true
          },
          color: {
            pattern: defaultColors
          },
          subchart: {
            show: false
          },
          zoom: {
            enabled: false
          },
          interaction: {
            enabled: true
          },
          transition: {
            duration: undefined
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

        var axesConfig = [
          {value: 'x', label: 'Bottom'},
          {value: 'y', label: 'Left'},
          {value: 'y2', label: 'Right'}
        ];

        config.groups = {};

        // Populate Initial
        config.axis.x.accuracy = 0;
        config.axis.y.accuracy = 0;
        config.axis.y2.accuracy = 0;
        config.axis.x.commas = true;
        config.axis.y.commas = true;
        config.axis.y2.commas = true;
        config.axis.x.prefix = '';
        config.axis.y.prefix = '';
        config.axis.y2.prefix = '';
        config.axis.x.suffix = '';
        config.axis.y.suffix = '';
        config.axis.y2.suffix = '';
        config.axis.x.tick = {
          format: function (d) {
            if (config.chartGlobalType === 'series' && config.axis.x.type !== 'category') {
              var f = d3.format(config.axis.x.commas ? ',' : '' + '.' + config.axis.x.accuracy ? config.axis.x.accuracy : 0 + 'f');
              return config.axis.x.prefix + f(d).toString() + config.axis.x.suffix;
            } else {
              return d;
            }
          }
        };
        config.axis.y.tick = {
          format: function (d) {
            if (config.chartGlobalType === 'series' && config.axis.y.type !== 'category') {
              var f = d3.format(config.axis.y.commas ? ',' : '' + '.' + config.axis.y.accuracy ? config.axis.y.accuracy : 0 + 'f');
              return config.axis.y.prefix + f(d).toString() + config.axis.y.suffix;
            } else {
              return d;
            }
          }
        };
        config.axis.y2.tick = {
          format: function (d) {
            if (config.chartGlobalType === 'series' && config.axis.y2.type !== 'category') {
              var f = d3.format(config.axis.y2.commas ? ',' : '' + '.' + config.axis.y2.accuracy ? config.axis.y2.accuracy : 0 + 'f');
              return config.axis.y2.prefix + f(d).toString() + config.axis.y2.suffix;
            } else {
              return d;
            }
          }
        };

        config.chartTitle = '';
        config.chartCredit = '';
        config.chartSource = '';
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

        return {
          config: config,
          chartTypes: chartTypes,
          axesConfig: axesConfig,
          dependencies: this.getExternalDependencies(),
          setGlobalType: this.setGlobalType,
          setGroups: this.setGroups
        };
      },

      getExternalDependencies: function(){
        return {
          css: [
            '//cdnjs.cloudflare.com/ajax/libs/c3/0.4.7/c3.min.css'
          ],
          js: [
            '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/c3/0.4.7/c3.min.js'
          ]
        };
      },
      
      /**
       * Sets the global chart type.
       * @param  {string} type  A chart type
       * @param  {object} scope Axis scope
       */
      setGlobalType: function(type, scope) {
        for (var key in scope.config.data.types) {
          if (scope.config.data.types.hasOwnProperty(key)) {
            if (type !== 'series') {
              scope.config.data.types[key] = type;
            } else {
              scope.config.data.types[key] = 'line';
            }
          }
        }
      },
      
      /**
       * Put data into groups.
       * @param  {object} scope Axis scope
       */
      setGroups: function(scope) {
        scope.config.data.groups = [];
        for (var group in scope.config.groups) {
          if (scope.config.groups.hasOwnProperty(group)) {
            if (typeof scope.config.data.groups[scope.config.groups[group]] === 'undefined') {
              scope.config.data.groups[scope.config.groups[group]] = [];
            }
            scope.config.data.groups[scope.config.groups[group]].push(group);
          }
        }
      }
    };
  }
})();