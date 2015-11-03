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
  function c3Service($window) {
    var c3 = $window.c3;
    var d3 = $window.d3;

    function C3ServiceException(message) {
      this.name = 'C3ServiceException';
      this.message = 'Chart rendering has failed: ' + message;
    }
    C3ServiceException.prototype = new Error();
    C3ServiceException.prototype.constructor = C3ServiceException;

    function traverse(o,func) {
      for (var i in o) {
        o[i] = func.apply(this,[i,o[i]]);
        if (o[i] !== null && typeof(o[i]) === 'object') {
          traverse(o[i],func);
        }
      }
    }

    return {
      /**
       * Scope variables to watch
       * @type {Array}
       */
      watchers: [
        'chartHeight',
        'chartWidth',
        'chartTitle',
        'chartCredit',
        'chartSource',
        'chartAccuracy',
        'legend.position',
        'legend.show',
        'subchart.show',
        'zoom.enabled',
        'interaction.enabled',
        'transition.duration',
        'title.text',
        'title.author',
        'title.source',
        'title.position',
        'area.zerobased',
        'grid.x.show',
        'grid.y.show',
        'data.labels'
      ],

      /**
       * Generates a chart based on config data
       * @param  {string} selectorID DOM ID to select
       * @param  {object} config     Config object passed in from scope
       * @return {object}            An instance of C3.js
       */
      generate: function(selectorID, config) {
        var chartConfig = angular.extend({bindto: '#' + selectorID}, config);
        var result;
        try {
          result = c3.generate(chartConfig);
        } catch (e) {
          console.dir(e);
          // throw new C3ServiceException(e);
        }

        return result;
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
            ],
            axes: { // This is used in a similar fashion to config.axis.
              data1: appConfig.defaults['y axis'],
              data2: appConfig.defaults['y axis']
            },
            groups: { // Ditto.
            },
            type: '',
            types: {
              data1: angular.isDefined(appConfig.defaults['series type']) ? appConfig.defaults['series type'] : 'line', // Currently must set explictly on initialisation to populate view.
              data2: angular.isDefined(appConfig.defaults['series type']) ? appConfig.defaults['series type'] : 'line'
            },
            colors: {
              data1: angular.isDefined(appConfig.colors[0].value) ? appConfig.colors[0].value : 'blue',
              data2: angular.isDefined(appConfig.colors[1].value) ? appConfig.colors[1].value : 'red'
            }
          },
          grid: {
            x: {
              show: angular.isDefined(appConfig.defaults['grid x']) ? appConfig.defaults['grid x'] : false
            },
            y: {
              show: angular.isDefined(appConfig.defaults['grid y']) ? appConfig.defaults['grid y'] : false
            }
          },
          axis: {
            x: {
              show: angular.isDefined(appConfig.defaults['axis x']) ? appConfig.defaults['axis x'] : true,
              padding: {
                left: angular.isDefined(appConfig.defaults['axis x padding left']) ? appConfig.defaults['axis x padding left'] : 0,
                right: angular.isDefined(appConfig.defaults['axis x padding right']) ? appConfig.defaults['axis x padding left'] : 0
              }
            },
            y: {
              show: angular.isDefined(appConfig.defaults['axis y']) ? appConfig.defaults['axis y'] : true,
              invert: false,
              padding: {
                top: angular.isDefined(appConfig.defaults['axis y padding top']) ? appConfig.defaults['axis y padding top'] : 0,
                bottom: angular.isDefined(appConfig.defaults['axis y padding bottom']) ? appConfig.defaults['axis y padding bottom'] : 0
              }
            },
            y2: {
              show: angular.isDefined(appConfig.defaults['axis y2']) ? appConfig.defaults['axis y2'] : false,
              invert: false,
              padding: {
                top: angular.isDefined(appConfig.defaults['axis y2 padding top']) ? appConfig.defaults['axis y2 padding top'] : 0,
                bottom: angular.isDefined(appConfig.defaults['axis y2 padding bottom']) ? appConfig.defaults['axis y2 padding bottom'] : 0
              }
            }
          },
          point: {
            show:  angular.isDefined(appConfig.defaults['point show']) ? appConfig.defaults['point show'] : false
          },
          legend: {
            position: angular.isDefined(appConfig.defaults['legend position']) ? appConfig.defaults['legend position'] : 'bottom',
            show:  angular.isDefined(appConfig.defaults['legend show']) ? appConfig.defaults['legend show'] : true
          },
          color: {
            pattern: defaultColors
          },
          subchart: {
            show: angular.isDefined(appConfig.defaults['subchart show']) ? appConfig.defaults['subchart show'] : false
          },
          zoom: {
            enabled: angular.isDefined(appConfig.defaults['zoom enabled']) ? appConfig.defaults['zoom enabled'] : false
          },
          interaction: {
            enabled: angular.isDefined(appConfig.defaults['interaction enabled']) ? appConfig.defaults['interaction enabled'] : true
          },
          transition: {
            duration: angular.isDefined(appConfig.defaults['transition duration']) ? appConfig.defaults['transition duration'] : undefined
          },
          title: {
            text: angular.isDefined(appConfig.defaults['title text']) ? appConfig.defaults['title text'] : undefined,
            author: angular.isDefined(appConfig.defaults['title author']) ? appConfig.defaults['title author'] : undefined,
            source: angular.isDefined(appConfig.defaults['title source']) ? appConfig.defaults['title source'] : undefined,
            position: angular.isDefined(appConfig.defaults['title position']) ? appConfig.defaults['title position'] : 'top-right'
          },
          padding: {
            top: angular.isDefined(appConfig.defaults['padding top']) ? appConfig.defaults['padding top'] : 50,
            bottom: angular.isDefined(appConfig.defaults['padding bottom']) ? appConfig.defaults['padding bottom'] : 50,
            left: angular.isDefined(appConfig.defaults['padding left']) ? appConfig.defaults['padding left'] : 50,
            right: angular.isDefined(appConfig.defaults['padding right']) ? appConfig.defaults['padding right'] : 50
          }
        };

        var chartTypes = [
          'line',
          'step',
          'area',
          'area-step',
          'area-spline',
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

        config.chartGlobalType = 'series';
        config.chartAccuracy = 1;
        config.cms = typeof parent.tinymce !== 'undefined' ? true : false;

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

        config.area = {
          zerobased: angular.isDefined(appConfig.defaults['area zerobased']) ? appConfig.defaults['area zerobased'] : false
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

      /**
       * Return external dependencies for embed code output.
       * @return {object} Contains arrays of CDN URLs for CSS and JS
       */
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
        // Set each data type to the new global type, unless it's a series chart,
        // in which case set everything to either line of defaults['series type'].
        for (var key in scope.config.data.types) {
          if (scope.config.data.types.hasOwnProperty(key)) {
            if (type !== 'series') {
              scope.config.data.types[key] = type;
            } else {
              scope.config.data.types[key] = scope.appConfig.defaults['series type'] || 'line';
            }
          }
        }

        // Apply any global type defaults from config
        if (angular.isDefined(scope.appConfig.defaults.charts) && angular.isDefined(scope.appConfig.defaults.charts[type])) {
          scope.config = angular.extend({}, scope.config, scope.appConfig.defaults.charts[type]);
        }
      },

      /**
       * Put data into groups.
       * @param  {object} scope Axis scope
       */
      setGroups: function(scope) {
        var groups = [];

        for (var group in scope.config.groups) {
          if (scope.config.groups.hasOwnProperty(group)) {
            if (typeof groups[scope.config.groups[group]] === 'undefined') {
              groups[scope.config.groups[group]] = [];
            }
            groups[scope.config.groups[group]].push(group);
          }
        }

        groups = groups.filter(function(item){ // Reindex array to prevent #98.
          return item;
        });
        scope.config.data.groups = groups;
      },

      /**
       * Store all callbacks as strings
       * @param  {object} config Copy of C3 config object
       * @return {object}        Updated C3 config object
       */
      saveCallbacks: function(config){
        function fixFormatters(key, value) {
          if (key === 'format' && typeof value === 'function') {
            return value.toString();
          } else {
            return value;
          }
        }

        traverse(config, fixFormatters);
        return config;
      },

      /**
       * Changes all the string callbacks to function callbacks
       * @param  {object} config Imported C3 config object
       * @return {object}        Updated C3 config object
       */
      restoreCallbacks: function(config){
        function evalFormatters(key, value) {
          if (key === 'format' && typeof value === 'string') {
            return eval('(' + value + ')'); // jshint ignore:line
          } else {
            return value;
          }
        }

        traverse(config, evalFormatters);
        return config;
      }
    }; //end return
  }
})();
