/**
 * @ngdoc service
 * @name axis.pdfOutput
 * @description
 * # pdfOutput
 * Produces PDFs of the chart.
 */
/* global jsPDF*/

(function(){
  'use strict';

  angular
    .module('axis')
    .service('pdfOutput', pdfOutput);

  /** @ngInject */
  function pdfOutput(genericOutput) {
    var pdf = angular.copy(genericOutput);

    pdf.name = 'pdfOutputService';

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
  }
})();
