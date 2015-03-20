/*global d3*/
'use strict';

/**
 * @ngdoc directive
 * @name axisJSApp.directive:BuildChart
 * @description
 * Base directive for building the chart preview.
 */
angular.module('axisJSApp')
  .directive('buildChart', ['chartProvider', '$timeout', function (chartProvider, $timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        element.children('svg').attr('transform', 'scale(2)'); // Needed to prevent pixely canvas

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
            titlesGroup = svg.insert('text').attr('class', 'titles').attr('text-anchor', scope.appConfig.titles.align);
            chartTitle = titlesGroup.insert('tspan').attr('class', 'chartTitle');
            chartCredit = titlesGroup.insert('tspan').attr('class', 'chartCredit');
            chartSource = titlesGroup.insert('tspan').attr('class', 'chartSource');
          }

          // Set text
          chartTitle.text(scope.config.chartTitle).attr('font-size', scope.appConfig.titles['title size']);
          chartCredit.text(scope.config.chartCredit).attr('font-size', scope.appConfig.titles['credit size']);

          var sourceText = (scope.appConfig.titles['append source'] && scope.config.chartSource ? 'Source: ' : '') + scope.config.chartSource;
          chartSource.text(sourceText).attr({'font-size': scope.appConfig.titles['source size'], 'font-style': scope.appConfig.titles['source style']});

          // Position text relative to each line
          var chartTitleTranslateY = typeof scope.appConfig.titles['title translateY'] !== 'undefined' ? scope.appConfig.titles['title translateY'] : 0;
          chartTitle.attr({'dy': chartTitleTranslateY, 'x': 0});

          var chartCreditTranslateY = typeof scope.appConfig.titles['credit translateY'] !== 'undefined' ? scope.appConfig.titles['credit translateY'] : 32;
          chartCredit.attr({'dy': chartCreditTranslateY, 'x': 0});

          var chartSourceTranslateY = typeof scope.appConfig.titles['source translateY'] !== 'undefined' ? scope.appConfig.titles['source translateY'] : 30;
          chartSource.attr({'dy': chartSourceTranslateY, 'x': 0});

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

          if (scope.appConfig.titles['title background'] && chartTitle.text().length > 0) {
            chartTitle.attr('fill', 'white');
            var bbox = chartTitle.node().getBBox();
            var padding = scope.appConfig.titles['background padding'];
            var rect = d3.select(chartTitle.node().parentNode.parentNode).insert('rect', 'text.titles');

            rect.attr('x', 0)
                .attr('y', 0)
                .attr('class', 'title-background')
                .attr('width', bbox.width + (padding*2))
                .attr('height', 18 + (padding*2)) //TODO get rid of magic number. bbox.height includes source.
                .style('fill', scope.config.data.colors[scope.config.data.columns[0][0]]);
            chartTitle.attr({'x': 0 + padding, 'dy': chartTitleTranslateY + padding});
          }

          // Position text group
          var translateGroupX = typeof scope.appConfig.titles.translateX !== 'undefined' ? scope.appConfig.titles.translateX : svgWidth / 2;
          var translateGroupY = typeof scope.appConfig.titles.translateY !== 'undefined' ? scope.appConfig.titles.translateY : 350;
          titlesGroup.attr('width', svgWidth).attr('transform', 'translate(' + translateGroupX + ',' + translateGroupY + ')');
          // Resize SVG
          svg.attr('height', svg.node().getBBox().height + 'px');
        }

        function redraw() {
          chart = chartProvider(scope.appConfig).generate(element[0].id, scope.config);

          $timeout(function(){
            doTitles();
          });
        }

        var chart;
        redraw(); // initial draw.

        /**
         * TODO refactor the following to make use of the ChartProvider service.
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
                } else if (column[0] === v) {
                  scope.config.data.axes[v] = axis;
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
      }
    };
  }]);
