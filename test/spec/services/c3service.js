'use strict';

describe('Service: c3Service', function () {

  // load the service's module
  beforeEach(module('axisJsApp'));

  // instantiate service
  var c3Service;
  beforeEach(inject(function (_c3Service_) {
    c3Service = _c3Service_;
  }));

  it('should do something', function () {
    expect(!!c3Service).toBe(true);
  });

});
