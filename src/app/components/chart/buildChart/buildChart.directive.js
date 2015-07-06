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
      link: function postLink(scope, element) {
        var chart;
        
        element.children('svg').attr('transform', 'scale(2)'); // Needed to prevent pixely canvas
        
        function redraw() {
          // Sets size. @TODO move to chartService somehow.
          scope.config.size = {
            width: scope.config.chartWidth ? scope.config.chartWidth : angular.element('.rendering').width() - 20,
            height: scope.config.chartHeight ? scope.config.chartHeight : angular.element(window).height() - 50,
          };
          scope.config.chartWidth = scope.config.size.width;
          scope.config.chartHeight = scope.config.size.height;
          
          if (chart && chart.hasOwnProperty('destroy')) { // Needed to prevent memory holes.
            chart.destroy();
          }
          chart = chartService(scope.appConfig).generate(element[0].id, scope.config);
        }
        
        redraw(); // initial draw.

        /**
         * TODO refactor the following to make use of the chartService service.
         */

        // Change the data structure (modified by PapaParse in main.js)
        scope.$watch('config.data.columns', function(newValues){
          redraw();
          scope.config.data.colors = {}; // empty to prevent cruft from building. See #58.
          if (typeof scope.config.data.types === 'object') {
            angular.forEach(scope.config.data.types, function(v, key){
              for (var i = 0; i < newValues.length; i++){
                if (newValues[i][0] === key) {
                  return;
                }
              }
              // not here? delete.
              delete(scope.config.data.types[key]);
            });
          } else {
            scope.config.data.types = {};
          }

          scope.config.data.axes = {};

          angular.forEach(scope.columns, function(column){
            // Set default y-axis. Should maybe be in csvInput or main?
            if (!scope.config.data.axes[column]) {
              scope.config.data.axes[column] = scope.appConfig.defaults['y axis'] ? scope.appConfig.defaults['y axis'] : 'y';
            }
            // Configure colours.

            scope.config.data.colors[column] = chart.data.colors()[column];

            // configure datum types
            if (scope.config.chartGlobalType === 'series') {
              if (!scope.config.data.types[column]) {
                scope.config.data.types[column] = 'line'; // default to line.
              }
            } else { // else the global chart type
              scope.config.data.types[column] = scope.config.chartGlobalType;
            }
          });
        }, true);

        // Change the colours
        scope.$watch('config.data.colors', function(){
          chart.data.colors(scope.config.data.colors);
        }, true);

        // Change the chart types
        scope.$watch('config.data.types', function(){
          redraw();
        }, true);

        // Modify the axes
        scope.$watch('config.axis', function(newValues){
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
                  scope.config.axis[key].prefix = '';
                } else {
                  scope.config.axis[key].prefix = newValues[key].prefix;
                }

                if (typeof newValues[key].suffix === 'undefined') {
                  scope.config.axis[key].suffix = '';
                } else {
                  scope.config.axis[key].suffix = newValues[key].suffix;
                }

                if (typeof newValues[key].accuracy === 'undefined') {
                  scope.config.axis[key].accuracy = 0;
                } else {
                  scope.config.axis[key].accuracy = newValues[key].accuracy;
                }
              }
            }
          }
        }, true);

        // Modify data association
        scope.$watchGroup(['config.data.x', 'config.data.y', 'config.data.y2'], function(newValues){
          // Check if the column has categorical data strings
          newValues.forEach(function(v, i){
            var axis = (i === 0 ? 'x' : i === 1 ? 'y' : i === 2 ? 'y2' : '');
            scope.config.data.columns.forEach(function(column){
              for (var i = 1; i < column.length; i++) {
                if (isNaN(column[i]) && column[0] === v) { // Column is NaN
                  scope.config.axis[axis].type = 'category';
                  scope.config.axis[axis].tick = undefined;
                  break;
                } else if (column[0] === v) {
                  scope.config.data.axes[v] = axis;
                }
              }
            });
          });

          redraw();
        });

        // Do titles and other aspects needing just a simple redraw.
        scope.$watchGroup(
          [
            'config.chartHeight',
            'config.chartWidth',
            'config.chartTitle', 
            'config.chartCredit', 
            'config.chartSource', 
            'config.chartAccuracy', 
            'config.legend.position', 
            'config.legend.show',
            'config.subchart.show',
            'config.zoom.enabled',
            'config.interaction.enabled',
            'config.transition.duration',
            'config.title.text',
            'config.title.author',
            'config.title.source',
            'config.title.position',
          ], 
          function(){
            redraw();
          }
        );

        // Watch for groups
        scope.$watch('config.data.groups', function(){
          redraw();
        }, true);

        // Watch for background
        scope.$watch('config.background', function(val){
          if (val === true) {
            d3.select('svg')
              .insert('rect', ':first-child')
              .attr('class', 'chart-bg')
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('fill', scope.config.backgroundColor);
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