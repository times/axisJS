/**
 * @ngdoc directive
 * @name axis.directive:maintainFocus
 * @description
 * # maintainFocus
 * Prevents tab key from changing focus and instead inserts a tab into the
 * focused element.
 */
(function(){
  'use strict';

  angular
    .module('axis')
    .directive('maintainFocus', maintainFocus);
  
  /** @ngInject */
  function maintainFocus() {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        element.on('keydown', function(e) {
          if (e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var val = this.value,
            start = this.selectionStart,
            end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            return false;
          }
        });
      }
    };
  }
})();