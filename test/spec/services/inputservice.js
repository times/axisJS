'use strict';

// TODO write tests for inputService. I'm not really sure how, TBH...

xdescribe('Service: inputService', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var inputService,
      instanceType;

  beforeEach(inject(function (_inputService_) {
    inputService = _inputService_;
    instanceType = Object.prototype.toString.call(inputService);
  }));

  it('should do something', function () {
    expect(!!inputService).toBe(true);
  });

});
