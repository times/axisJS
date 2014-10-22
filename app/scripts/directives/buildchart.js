/*global c3,d3*/
'use strict';

/**
 * @ngdoc directive
 * @name axisJSApp.directive:BuildChart
 * @description
 * Base directive for building the chart preview.
 */
angular.module('axisJSApp')
  .directive('buildChart', ['$timeout', function ($timeout) {
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

        function doTitles() {
          var svg = d3.select('svg');
          var titlesGroup, chartTitle, chartCredit, chartSource;
          var svgWidth = svg.attr('width');

          // Insert titles if non-existent; otherwise select them.
          if (svg.select('text.titles')[0][0] !== null) { // d3.select is weird.
            titlesGroup = svg.select('text.titles');
            chartTitle = titlesGroup.select('tspan.chartTitle');
            chartCredit = titlesGroup.select('tspan.chartCredit');
            chartSource = titlesGroup.select('tspan.chartSource');
          } else {
            titlesGroup = svg.insert('text').attr('class', 'titles').attr('text-anchor', 'middle');
            chartTitle = titlesGroup.insert('tspan').attr('class', 'chartTitle');
            chartCredit = titlesGroup.insert('tspan').attr('class', 'chartCredit');
            chartSource = titlesGroup.insert('tspan').attr('class', 'chartSource');
          }

          // Set text
          chartTitle.text(scope.config.chartTitle).attr('font-size', '32px');
          chartCredit.text(scope.config.chartCredit).attr('font-size', '30px');
          chartSource.text(scope.config.chartSource).attr({'font-size': '28px', 'font-style': 'oblique'});

          // Position text relative to each line
          chartTitle.attr({'dy': 0, 'x': 0});
          chartCredit.attr({'dy': 32, 'x': 0});
          chartSource.attr({'dy': 30, 'x': 0});

          while (chartTitle.node().getComputedTextLength() > svgWidth || chartCredit.node().getComputedTextLength() > svgWidth || chartSource.node().getComputedTextLength() > svgWidth) {
            var newTitleSize = parseInt(chartTitle.attr('font-size').replace('px', '')) - 1;
            var newCreditSize = parseInt(chartCredit.attr('font-size').replace('px', '')) - 1;
            var newSourceSize = parseInt(chartSource.attr('font-size').replace('px', '')) - 1;
            chartTitle.attr('font-size', newTitleSize + 'px');
            chartCredit.attr('font-size', newCreditSize + 'px');
            chartSource.attr('font-size', newSourceSize + 'px');
            chartCredit.attr({'dy': newTitleSize, 'x': 0});
            chartSource.attr({'dy': newCreditSize, 'x': 0});
          }

          // Position text group
          titlesGroup.attr('width', svgWidth).attr('transform', 'translate(' + svgWidth / 2 + ',350)');
          // Resize SVG
          svg.attr('height', svg.node().getBBox().height + 'px');
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
              colors: scope.config.data.colors,
              groups: scope.config.data.groups
            },
            axis: scope.config.axis,
            legend: scope.config.legend,
            point: scope.config.point,
            pie: scope.config.pie,
            donut: scope.config.donut,
            gauge: scope.config.gauge,
            color: {
              pattern: scope.config.defaultColors
            }
          });

          $timeout(function(){
            doTitles();
          });
        }

        var chart;
        redraw(); // initial draw.

        // Watch all the different scope variables, redraw if necessary.
        // This might need a refactor at some point. Not sure using $watch like
        // this is kosher, given how AngularJS checks for var changes.

        // Change the data structure (modified by PapaParse in main.js)
        scope.$watch('config.data.columns', function(){
          redraw();

          // Assign the new colours specified by C3 to the inputs.
          // Needs to be done after redraw().
          for (var column in chart.data.colors()) {
            scope.config.data.colors[column] = chart.data.colors()[column];
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
              if (newValues[key].hasOwnProperty('show') || newValues[key].hasOwnProperty('max') || newValues[key].hasOwnProperty('min')) {
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
                }
              }
            });
          });

          redraw();
        });

        // Do titles
        scope.$watchGroup(['config.chartTitle', 'config.chartCredit', 'config.chartSource', 'config.chartAccuracy', 'config.legend.position', 'config.legend.show'], function(){
          redraw();
        });

        // Watch for groups
        scope.$watch('config.data.groups', function(){
          redraw();
        }, true);
      }
    };
  }]);
