/*global c3,d3*/
'use strict';

/**
 * @ngdoc directive
 * @name axisJSApp.directive:BuildChart
 * @description
 * Base directive for building the chart preview.
 */
angular.module('axisJSApp')
  .directive('buildChart', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        element.children('svg').attr('transform', 'scale(2)'); // Needed to prevent pixely canvas
        /**
         * Multiline "this needs to be unfucked @TODO" comment
         *
         * This is HEAVILY bound to C3js at the moment. To make this wipe the floor
         * with Quartz's ChartBuilder, it needs to be abstracted to allow drop-in-place
         * charting libraries (highcharts, nvd3, etc. etc.)
         *
         * If somebody picks this up before I get to it, I OWE YOU A BEER.
         */

        // This is a really brute-force manner of doing things. This can be done better.
        function doTitles() {
          d3.selectAll('svg g.titles').remove();
          var svg = d3.select('svg').attr('height', 420);
          var titlesGroup = svg.insert('g').attr('class', 'titles');
          titlesGroup.insert('text').text(scope.config.chartTitle).attr('font-size', '30px').attr('text-anchor', 'middle');
          titlesGroup.insert('text').text(scope.config.chartCredit).attr('font-size', '25px').attr('y', '30').attr('text-anchor', 'middle');
          titlesGroup.insert('text').text(scope.config.chartSource.length > 0 ? 'source: ' + scope.config.chartSource : '').attr('font-size', '20px').attr('y', scope.config.chartCredit.length > 0 ? '60' : '30').attr('text-anchor', 'middle').attr('font-style', 'oblique');
          titlesGroup.attr('transform', 'translate(332,350)');
        }

        function redraw() {
          chart = c3.generate({
            bindto: '#' + element[0].id,
            data: {
              x: scope.config.data.x,
              y: scope.config.data.y,
              y2: scope.config.data.y2,
              columns: scope.config.data.columns, //expects multi-dimensional array containing one array per column.
              axes: scope.config.data.axes, //expects object mapping columns to axis objects (below)
              types: scope.config.data.types, //expects an object mapping each data column to a type
              colors: scope.config.data.colors
            },
            axis: scope.config.axis,
            legend: scope.config.legend,
            point: scope.config.point
          });

          doTitles();
        }

        var chart;
        redraw(); // initial draw.

        // YYYYYYEEAH, I'm not sure using $watch like this is kosher...

        // Change the data structure (modified by PapaParse in main.js)
        scope.$watch('config.data.columns', function(){
          redraw();

          // Assign the new colours specified by C3 to the inputs.
          // Needs to be done after redraw().
          for (var color in chart.data.colors()) {
            if (typeof scope.config.data.colors[color] === 'undefined') {
              scope.config.data.colors[color] = chart.data.colors()[color];
            }
          }
        });

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
              if (newValues[key].hasOwnProperty('show') || newValues[key].hasOwnProperty('max') || newValues[key].hasOwnProperty('min')) { // redraw if axis visibility changed
                redraw();
              }

              // Setup prefix/suffix
              if (newValues[key].hasOwnProperty('prefix') || newValues[key].hasOwnProperty('suffix') || newValues[key].hasOwnProperty('accuracy')) { // redraw if axis visibility changed
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
        scope.$watchGroup(['config.data.x', 'config.data.y', 'config.data.y2'], function(){
          redraw();
        });

        // Do titles
        scope.$watchGroup(['config.chartTitle', 'config.chartCredit', 'config.chartSource'], function(){
          redraw();
        });
      }
    };
  });
