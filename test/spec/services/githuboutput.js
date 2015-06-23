'use strict';

describe('Service: githubOutput', function () {

  // load the service's module
  beforeEach(module('axisJSapp'));

  // instantiate service
  var githubOutput;
  beforeEach(inject(function (_githubOutput_) {
    githubOutput = _githubOutput_;
  }));

  it('should do something', function () {
    expect(!!githubOutput).toBe(true);
  });

});
