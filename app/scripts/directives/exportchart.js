/*global $*/ //Disabling loopfunc linting options because it's dumb.
/*jshint -W083 */
'use strict';

/**
 * @ngdoc directive
 * @name axisJSApp.directive:exportChart
 * @description
 * Most of this is shamelessly stolen from Quartz's ChartBuilder.
 * @todo Refactor the hell out of this.
 */
angular.module('axisJSApp')
  .directive('exportChart', ['$http', function ($http) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.on('click', function(){
          switch(attrs.exportChart) {
            case 'cms':
              createChartImages(scope.config.chartWidth);
              var chartConfig = scope.config;
              chartConfig.axis.x.tick.format = chartConfig.axis.x.tick.format.toString();
              chartConfig.axis.y.tick.format = chartConfig.axis.y.tick.format.toString();
              chartConfig.axis.y2.tick.format = chartConfig.axis.y2.tick.format.toString();
              chartConfig.pie.label.format = chartConfig.pie.label.format.toString();
              chartConfig.donut.label.format = chartConfig.donut.label.format.toString();
              chartConfig.gauge.label.format = chartConfig.gauge.label.format.toString();
              var axisConfig = String(angular.toJson(chartConfig));
              var axisChart = String(angular.element('.savePNG').attr('href'));
              var axisWP = parent.tinymce.activeEditor.windowManager.getParams().axisWP;
              var payload = {
                action: 'insert_axis_attachment',
                axisConfig: axisConfig,
                axisChart: axisChart,
                parentID: axisWP.parentID
              };
              $.post(parent.ajaxurl, payload, function(res){
                res = angular.fromJson(res);
                parent.tinymce.activeEditor.insertContent('<div class="mceNonEditable"><img src="' + res.attachmentURL + '" data-axisjs=\'' + window.btoa(angular.toJson(res)) + '\' class="mceItem axisChart" /></div><br />');
                parent.tinymce.activeEditor.windowManager.close();
              });

              // TODO Figure out why the following doesn't work due to lns. 22-27
              // $http({
              //   method: 'POST',
              //   url: parent.ajaxurl,
              //   data: $.param(payload),
              //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
              // })
              //   .success(function(res){
              //     parent.tinymce.activeEditor.insertContent('<div class="mceNonEditable"><img src="' + res.attachmentURL + '" data-axisjs=\'' + window.btoa(angular.toJson(res)) + '\' class="mceItem axisChart" /></div><br />');
              //     parent.tinymce.activeEditor.windowManager.close();
              //   })
              //   .error(function(res){
              //     console.log('Error saving to CMS: ');
              //     console.dir(res);
              //   });
            break;
            case 'images':
              createChartImages(scope.config.chartWidth);
            break;
          }
        });

        var styles;

        var createChartImages = function(width) {
          // Remove all defs, which botch PNG output
          angular.element('defs').remove();

          // Copy CSS styles to Canvas
          inlineAllStyles();

      		// Create PNG image
      		var canvas = angular.element('#canvas').empty()[0];

          if (!width) {
            // Zoom! Enhance!
            angular.element('#chart > svg').attr('transform', 'scale(2)');
            canvas.width = angular.element('#chart > svg').width() * 2;
            canvas.height = angular.element('#chart > svg').height() *2;
          } else {
            var scaleFactor = width / angular.element('#chart').width();
            angular.element('#chart > svg').attr('transform', 'scale(' + scaleFactor + ')');
            canvas.width = angular.element('#chart > svg').width() * scaleFactor;
            canvas.height = angular.element('#chart > svg').height() * scaleFactor;
          }


      		var canvasContext = canvas.getContext('2d');

          var svg = document.getElementsByTagName('svg')[0];
          var serializer = new XMLSerializer();
          svg = serializer.serializeToString(svg);

          canvasContext.drawSvg(svg,0,0);

      		var filename = [];
      		for (var i=0; i < scope.columns.length; i++) {
      			filename.push(scope.columns[i]);
      		}

      		if(scope.chartTitle) {
      			filename.unshift(scope.chartTitle);
      		}

      		filename = filename.join('-').replace(/[^\w\d]+/gi, '-');

      		angular.element('.savePNG').attr('href', canvas.toDataURL('png'))
      			.attr('download', function(){ return filename + '_axisJS.png';
      			});

      		var svgContent = createSVGContent(angular.element('#chart > svg')[0]);

      		$('.saveSVG').attr('href','data:text/svg,'+ svgContent.source[0])
      			.attr('download', function(){ return filename + '_axisJS.svg';});

          // Disabling blob support below because data URLs are easier to move out of WordPress.

      		// if(!(/Apple/).test(navigator.vendor)) {
      		// 	//blobs dont work in Safari so don't use that method
      		// 	var base64 = canvas.toDataURL("png").split(",")[1];
      		// 	var bytes = window.atob(base64);
      		// 	var ui8a = new Uint8Array(bytes.length);
          //
      		// 	for (var i = 0; i < bytes.length; i++)
      		// 		ui8a[i] = bytes[i].charCodeAt(0);
          //
      		// 	var blob = new Blob([ui8a], { type: 'image/png' });
      		// 	var url = URL.createObjectURL(blob);
          //   angular.element('.savePNG').attr('href', url);
          //
      		// 	blob = new Blob(svgContent.source, { type: '"text\/xml"' });
      		// 	url = URL.createObjectURL(blob);
      		// 	angular.element('.saveSVG').attr('href', url);
      		// }
        };

        // This needs to be more abstracted. Currently it's built to handle C3's quirks.

        /* Take styles from CSS and put as inline SVG attributes so that Canvg
           can properly parse them. */
        var inlineAllStyles = function() {
      		var chartStyle, selector;

      		// Get rules from c3.css
      		for (var i = 0; i <= document.styleSheets.length - 1; i++) {
      			if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('c3.css') !== -1) {
      				if (document.styleSheets[i].rules !== undefined) {
      					chartStyle = document.styleSheets[i].rules;
      				} else {
      					chartStyle = document.styleSheets[i].cssRules;
      				}
      			}
      		}

      		if (chartStyle !== null && chartStyle !== undefined) {
            // SVG doesn't use CSS visibility and opacity is an attribute, not a style property. Change hidden stuff to "display: none"
            var changeToDisplay = function(){
              if (angular.element(this).css('visibility') === 'hidden' || angular.element(this).css('opacity') === '0') {
                angular.element(this).css('display', 'none');
              }
            };

            // Inline apply all the CSS rules as inline
      			for (i = 0; i < chartStyle.length; i++) {
      				if (chartStyle[i].type === 1) {
      					selector = chartStyle[i].selectorText;
      					styles = makeStyleObject(chartStyle[i]);
                angular.element('svg *').each(changeToDisplay);
      					angular.element(selector).not('.c3-chart path').css(styles);
      				}

              /* C3 puts line colour as a style attribute, which gets overridden
                 by the global ".c3 path, .c3 line" in c3.css. The .not() above
                 prevents that, but now we need to set fill to "none" to prevent
                 weird beziers.

                 Which screws with pie charts and whatnot, ergo the is() callback.
              */
              angular.element('.c3-chart path')
                .filter(function(){
                  return angular.element(this).css('fill') === 'none';
                })
                .attr('fill', 'none');

              angular.element('.c3-chart path')
                .filter(function(){
                  return angular.element(this).css('fill') !== 'none';
                })
                .attr('fill', function(){
                  return angular.element(this).css('fill');
                });
      			}
      		}
      	};

        // Create an object containing all the CSS styles.
        // TODO move into inlineAllStyles
      	var makeStyleObject = function (rule) {
      		var styleDec = rule.style;
      		var output = {};
      		var s;

      		for (s = 0; s < styleDec.length; s++) {
      			output[styleDec[s]] = styleDec[styleDec[s]];
      		}
      		return output;
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

          // Disabled defs because it was screwing up PNG output
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
          source = source.replace(/\sfont-.*?: .*?;/gi, '');
          source = source.replace(/\sclip-.*?="url\(http:\/\/localhost:9000\/.*?\)"/gi, '');
          source = source.replace(/\stransform="scale\(2\)"/gi, '');
          // not needed but good so it validates
          source = source.replace(/<defs xmlns="http:\/\/www.w3.org\/1999\/xhtml">/gi, '<defs>');

      		return {svg: svg, source: [doctype + source]};
      	};
      }
    };
  }]);
