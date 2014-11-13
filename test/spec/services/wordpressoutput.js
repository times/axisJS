'use strict';

describe('Service: WordPressOutput', function () {

  // load the service's module
  beforeEach(module('axisJsApp'));

  // instantiate service
  var WordPressOutput;
  beforeEach(inject(function (_WordPressOutput_) {
    WordPressOutput = _WordPressOutput_;
  }));

  it('should do something', function () {
    expect(!!WordPressOutput).toBe(true);
  });

});
