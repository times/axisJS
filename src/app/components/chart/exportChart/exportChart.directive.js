/**
 * @ngdoc directive
 * @name axis.directive:exportChart
 * @description
 * Inlines styles and renders to canvas.
 * Also does some PNG and SVG stuff. It's not very well-written...
 *
 * Most of this is shamelessly stolen from Quartz's ChartBuilder.
 * @TODO Refactor the hell out of this.
 */
/*jshint -W083 */

(function(){
  'use strict';

  angular
    .module('axis')
    .directive('exportChart', exportChart);

  /** @ngInject */
  function exportChart (outputService, $window) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var main = scope.main; // This is the entire main controller scope. @TODO isolate.

        element.on('click', function(){
          createChartImages(main.config.chartWidth);
          if (attrs.exportChart !== 'save') {
            outputService(main, attrs.exportChart);
          }
        });

        var styles;

        var createChartImages = function(width) {
          // Remove all defs, which botch PNG output
          angular.element('defs').remove();

          // Copy CSS styles to Canvas
          var svgContent = inlineAllStyles(angular.element('#chart-container')[0]);

          // Create PNG image
          var canvas = angular.element('#canvas').empty()[0];
          canvas.setAttribute('width', angular.element('#chart-container').width() * 2); // Will clip otherwise
          canvas.setAttribute('height', angular.element('#chart-container').height() * 2);
          var canvasContext = canvas.getContext('2d');
          var svg = document.getElementById('svgClone');
          var serializer = new XMLSerializer();
          svg = serializer.serializeToString(svg);
          canvasContext.drawSvg(svg,0,0);

          var filename = [];
          for (var i=0; i < main.columns.length; i++) {
            filename.push(main.columns[i]);
          }

          if(main.chartTitle) {
            filename.unshift(main.chartTitle);
          }

          filename = filename.join('-').replace(/[^\w\d]+/gi, '-');

          angular.element('.savePNG').attr('href', canvas.toDataURL('png'))
            .attr('download', function(){ return filename + '_axisJS.png';
            });

          $('.saveSVG').attr('href','data:text/svg,'+ svgContent.source[0])
            .attr('download', function(){ return filename + '_axisJS.svg';});
          console.dir(svg);
          // svg.remove();
        };

        // This needs to be more abstracted. Currently it's built to handle C3's quirks.

        /* Take styles from CSS and put as inline SVG attributes so that Canvg
           can properly parse them. */
        var inlineAllStyles = function() {
          var svg = angular.element('#chart-container').clone()[0];
          svg.removeAttribute('build-chart'); // Otherwise buildChart fires again!
          svg.setAttribute('id', 'svgClone');
          svg.setAttribute('transform', 'scale(2)'); // Zoom! Enhance!
          angular.element('.rendering').append(svg); // Needs to be in DOM, or rest does not work.

          var prefix = {
            xmlns: "http://www.w3.org/2000/xmlns/",
            xlink: "http://www.w3.org/1999/xlink",
            svg: "http://www.w3.org/2000/svg"
          };

          var emptySvg = $window.document.createElementNS(prefix.svg, 'svg');
          $window.document.body.appendChild(emptySvg);
          var emptySvgDeclarationComputed = getComputedStyle(emptySvg);

          // hardcode computed css styles inside svg
          var allElements = traverse(svg);
          var i = allElements.length;
          while (i--){
            explicitlySetStyle(allElements[i]);
          }

          return createSVGContent(svg);

          function explicitlySetStyle (element) {
            var cSSStyleDeclarationComputed = getComputedStyle(element);
            var i, len, key, value;
            var computedStyleStr = "";
            for (i=0, len=cSSStyleDeclarationComputed.length; i<len; i++) {
              key=cSSStyleDeclarationComputed[i];
              value=cSSStyleDeclarationComputed.getPropertyValue(key);

              // THIS IS IMPORTANT FOR CANVAS CONVERSION — Explicitly set display: none.
              if ((key === 'visibility' && value === 'hidden') || (key === 'opacity' && value === '0')) {
                computedStyleStr += 'display: none; visibility: hidden;';
              } else if (value !== emptySvgDeclarationComputed.getPropertyValue(key)) {
                computedStyleStr += key + ":" + value + ";";
              }
            }
            element.setAttribute('style', computedStyleStr);
          }

          function traverse(obj){
            var tree = [];
            tree.push(obj);
            visit(obj);
            function visit(node) {
              if (node && node.hasChildNodes()) {
                var child = node.firstChild;
                while (child) {
                  if (child.nodeType === 1 && child.nodeName !== 'SCRIPT'){
                    tree.push(child);
                    visit(child);
                  }
                  child = child.nextSibling;
                }
              }
            }
            return tree;
          }
        };

        // Create a SVG.
        var createSVGContent = function(svg) {
          /*
            Copyright (c) 2013 The New York Times

            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

            SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          */

          //via https://github.com/NYTimes/svg-crowbar

          var prefix = {
            xmlns: 'http://www.w3.org/2000/xmlns/',
            xlink: 'http://www.w3.org/1999/xlink',
            svg: 'http://www.w3.org/2000/svg'
          };

          var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';


          svg.setAttribute('version', '1.1');

          // Disabled defs because it was screwing up SVG output
          //var defsEl = document.createElement("defs");
          //svg.insertBefore(defsEl, svg.firstChild); //TODO   .insert("defs", ":first-child")

          var styleEl = document.createElement('style');
          //defsEl.appendChild(styleEl);
          styleEl.setAttribute('type', 'text/css');

          // removing attributes so they aren't doubled up
          svg.removeAttribute('xmlns');
          svg.removeAttribute('xlink');

          // These are needed for the svg
          if (!svg.hasAttributeNS(prefix.xmlns, 'xmlns')) {
            svg.setAttributeNS(prefix.xmlns, 'xmlns', prefix.svg);
          }

          if (!svg.hasAttributeNS(prefix.xmlns, 'xmlns:xlink')) {
            svg.setAttributeNS(prefix.xmlns, 'xmlns:xlink', prefix.xlink);
          }

          var source = (new XMLSerializer()).serializeToString(svg).replace('</style>', '<![CDATA[' + styles + ']]></style>');

          // Quick 'n' shitty hacks to remove stuff that prevents AI from opening SVG

          // Replace all the replacement fonts with their replacement values.
          if (typeof scope.main.appConfig['font replacements'] !== 'undefined') {
            angular.forEach(scope.main.appConfig['font replacements'], function(val, key){
              source = source.replace(new RegExp(key, 'g'), val);
            });
          }

          // Fix font-family declarations. See https://twitter.com/aendrew/status/669222525746982913
          // Replace multiple font declarations with just the first value (they don't gracefully fallback)
          source = source.replace(/font-family:\s?['"]?([^,;'"]+)['"]?[^;]*?;/gi, 'font-family: \'$1\';');

          // Replace sans-serif and serif with Arial and Times New Roman respectively.
          source = source.replace(/font-family: \'sans-serif\';/g, 'font-family: \'Arial\';');
          source = source.replace(/font-family: \'(serif|Times)\';/g, 'font-family: \'Times New Roman\';');

          // Remove all clipping masks because AI doesn't seem to support them.
          source = source.replace(/\sclip-.+?="url\(["']?.[^"'\)]+["']?\)"/gi, ''); // Attribute format
          source = source.replace(/clip-[^\s:]+?:\s?url\(["']?.[^"'\)]+["']?\);?/gi, ''); // Style attr format

          // Remove all the double-scaling
          // source = source.replace(/\stransform="scale\(2\)"/gi, '');

          // not needed but good so it validates
          source = source.replace(/<defs xmlns="http:\/\/www.w3.org\/1999\/xhtml">/gi, '<defs>');

          return {svg: svg, source: [doctype + source]};
        };
      }
    };
  }
})();
