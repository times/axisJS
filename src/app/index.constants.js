/* global toastr:false, moment:false */
(function() {
  'use strict';

  angular
    .module('axis')
    .constant('toastr', toastr)
    .constant('moment', moment);
})();
