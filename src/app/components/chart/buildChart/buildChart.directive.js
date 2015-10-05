/**
 * @ngdoc directive
 * @name axis.directive:buildChart
 * @description
 * Builds the chart preview and sets titles. Watches for specific scope changes
 * and redraws when appropriate.
 *
 * This file is admittedly a bit of a mess and needs a bit of a rewrite.
 */

(function(){
  'use strict';

  angular.module('axis')
    .directive('buildChart', buildChart);

  /** @ngInject */
  function buildChart(chartService, $window) {
    return {
      restrict: 'A',
      scope: {
        'main': '=config'
      },
      link: function postLink(scope, element) {
        var main = scope.main;
        var chart;

        element.children('svg').attr('transform', 'scale(2)'); // Needed to prevent pixely canvas

        function redraw() {
          // Sets size. @TODO move to chartService somehow.
          main.config.size = {
            width: main.config.chartWidth ? main.config.chartWidth : angular.element('.rendering').width() - 20,
            height: main.config.chartHeight ? main.config.chartHeight : angular.element(window).height() - 50,
          };
          main.config.chartWidth = main.config.size.width;
          main.config.chartHeight = main.config.size.height;

          if (chart && chart.hasOwnProperty('destroy')) { // Needed to prevent memory holes.
            chart.destroy();
          }
          chart = chartService(main.appConfig).generate(element[0].id, main.config);
        }

        redraw(); // initial draw.

        /**
         * TODO refactor the following to make use of the chartService service.
         */

        // Change the data structure
        scope.$watch('main.config.data.columns', function(newValues){
          if (main.config.data.columns.length > 0) {
            main.config.data.colors = {}; // empty to prevent cruft from building. See #58.
            if (typeof main.config.data.types === 'object') {
              angular.forEach(main.config.data.types, function(v, key){
                for (var i = 0; i < newValues.length; i++){
                  if (newValues[i][0] === key) {
                    return;
                  }
                }
                // not here? delete.
                delete(main.config.data.types[key]);
              });
            } else {
              main.config.data.types = {};
            }

            main.config.data.axes = {};

            angular.forEach(main.columns, function(column){
              // Set default y-axis. Should maybe be in csvInput or main?
              if (!main.config.data.axes[column]) {
                main.config.data.axes[column] = main.appConfig.defaults['y axis'] ? main.appConfig.defaults['y axis'] : 'y';
              }
              // Configure colours.
              main.config.data.colors[column] = chart.data.colors()[column];

              // configure datum types
              if (main.config.chartGlobalType === 'series') {
                if (!main.config.data.types[column]) {
                  main.config.data.types[column] = main.appConfig.defaults['series type'] || 'line'; // default to line.
                }
              } else { // else the global chart type
                main.config.data.types[column] = main.config.chartGlobalType;
              }
            });

            redraw(); // Data's all updated — now trigger redraw.
          }
        }, true);

        // Change the colours
        scope.$watch('main.config.data.colors', function(){
          chart.data.colors(main.config.data.colors);
        }, true);

        // Change the chart types
        scope.$watch('main.config.data.types', function(){
          redraw();
        }, true);

        // Modify the axes
        scope.$watch('main.config.axis', function(newValues){
          for (var key in newValues) {
            if (newValues.hasOwnProperty(key)) {

              // Modify labels
              if (newValues[key].hasOwnProperty('label')) {
                var axis = {};
                axis[key] = newValues[key].label;
                chart.axis.labels(axis);
              }

              // Show or hide an axis; set maximums or minimums (requires simple redraw)
              if (newValues[key].hasOwnProperty('show') || newValues[key].hasOwnProperty('max') || newValues[key].hasOwnProperty('min')) {
                redraw();
              }

              // Setup prefix/suffix
              if (newValues[key].hasOwnProperty('prefix') ||
                  newValues[key].hasOwnProperty('suffix') ||
                  newValues[key].hasOwnProperty('accuracy') ||
                  newValues[key].hasOwnProperty('commas')) { // redraw if axis visibility changed
                if (typeof newValues[key].prefix === 'undefined') {
                  main.config.axis[key].prefix = '';
                } else {
                  main.config.axis[key].prefix = newValues[key].prefix;
                }

                if (typeof newValues[key].suffix === 'undefined') {
                  main.config.axis[key].suffix = '';
                } else {
                  main.config.axis[key].suffix = newValues[key].suffix;
                }

                if (typeof newValues[key].accuracy === 'undefined') {
                  main.config.axis[key].accuracy = 0;
                } else {
                  main.config.axis[key].accuracy = newValues[key].accuracy;
                }
              }
            }
          }
        }, true);

        // Modify data association
        scope.$watchGroup(['main.config.data.x', 'main.config.data.y', 'main.config.data.y2'], function(newValues){
          // Check if the column has categorical data strings
          newValues.forEach(function(v, i){
            var axis = (i === 0 ? 'x' : i === 1 ? 'y' : i === 2 ? 'y2' : '');
            main.config.data.columns.forEach(function(column){
              for (var i = 1; i < column.length; i++) {
                if (isNaN(column[i]) && column[0] === v) { // Column is NaN
                  main.config.axis[axis].type = 'category';
                  main.config.axis[axis].tick = undefined;
                  main.config.axis[axis].accuracy = undefined;
                  break;
                } else if (column[0] === v) {
                  main.config.data.axes[v] = axis;
                }
              }
            });
          });

          redraw();
        });

        // Do titles and other aspects needing just a simple redraw.
        scope.$watchGroup(
          [
            'main.config.chartHeight',
            'main.config.chartWidth',
            'main.config.chartTitle',
            'main.config.chartCredit',
            'main.config.chartSource',
            'main.config.chartAccuracy',
            'main.config.legend.position',
            'main.config.legend.show',
            'main.config.subchart.show',
            'main.config.zoom.enabled',
            'main.config.interaction.enabled',
            'main.config.transition.duration',
            'main.config.title.text',
            'main.config.title.author',
            'main.config.title.source',
            'main.config.title.position',
            'main.config.area.zerobased'
          ],
          function(){
            redraw();
          }
        );

        // Watch for groups
        scope.$watch('main.config.data.groups', function(){
          redraw();
        }, true);

        // Watch for background
        scope.$watch('main.config.background', function(val){
          if (val === true) {
            d3.select('svg')
              .insert('rect', ':first-child')
              .attr('class', 'chart-bg')
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('fill', main.config.backgroundColor);
          } else {
            d3.select('.chart-bg').remove();
          }
        });

        // Redraw on browser resize.
        angular.element($window).bind('resize', function(){
          redraw();
        });
      }
    };
  }
})();
