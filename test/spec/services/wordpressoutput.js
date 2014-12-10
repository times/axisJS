'use strict';

// TODO write WordPressOutputService tests
xdescribe('Service: WordPressOutput', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var WordPressOutput;
  beforeEach(inject(function (_WordPressOutput_) {
    WordPressOutput = _WordPressOutput_;
  }));

  it('should do something', function () {
    expect(!!WordPressOutput).toBe(true);
  });

});
