'use strict';

/**
 * @ngdoc service
 * @name AxisJS.pdfOutputService
 * @description
 * # pdfOutputService
 * Service in the AxisJS.
 */
angular.module('axis')
  .service('pdfOutput', function pdfOutput(GenericOutput) {
    var pdf = angular.copy(GenericOutput);

    pdf.preprocess = function(scope) {
      return {
        data: document.getElementById('canvas').toDataURL(),
        margins: scope.appConfig['print margins'] ? scope.appConfig['print margins'] : undefined
      };
    };

    pdf.process = function(payload){
      var doc = new jsPDF('l', 'pt');
      doc.addImage(payload.data, 'PNG', 0, 0); // TODO add margins
      return doc;
    };

    pdf.complete = function(output) {
      output.save('axis.pdf'); // provided by jsPDF
    };

    return pdf;
  });
