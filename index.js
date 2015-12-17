'use strict';

function options204($httpBackend) {
  $httpBackend.when('OPTIONS', /\/api\//)
    .respond(function () {
      return [204, '', {}];
    });
}

function passThrough($httpBackend) {
  var methods, url;

  url = /^(?!api)/;

  methods = [
    'HEAD',
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'JSONP'
  ];

  methods.forEach(function (method) {
    $httpBackend['when' + method](url).passThrough();
  });
}

function build(funcs) {
  var headStr, headDefineStr,
    bodyStr, optionsStr, footStr;

  headStr = "angular.module('httpBackEndMock')";
  headDefineStr = "angular.module('httpBackEndMock', ['ngMockE2E'])";

  optionsStr = "\r.run(" + options204 + ")";
  footStr = "\r.run(" + passThrough + ")";

  bodyStr = (Array.isArray(funcs) ? funcs : [funcs])
    .map(function (f) {
      return "\r.run(" + f + ")";
    }).join('');

  return Function([
    'try { ',
      headDefineStr, bodyStr, optionsStr, footStr,
    '} catch (err) { ',
      headStr, bodyStr, optionsStr, footStr,
    '}'
  ].join(''));
}

function verifyNoOutstandingExpectationFn(callback) {
  var $httpBackend = angular.element('body').injector().get('$httpBackend');

  try {
    $httpBackend.verifyNoOutstandingExpectation();
    callback(null);
  } catch (err) {
    callback(err.message);
  }
}

function verifyNoOutstandingRequestFn(callback) {
  var $httpBackend = angular.element('body').injector().get('$httpBackend');

  try {
    $httpBackend.verifyNoOutstandingRequest();
    callback(null);
  } catch (err) {
    callback(err.message);
  }
}

function verifyNoOutstandingExpectation() {
  var message = browser.executeAsyncScript(verifyNoOutstandingExpectationFn);
  expect(message).toBeNull();
}

function verifyNoOutstandingRequest() {
  var message = browser.executeAsyncScript(verifyNoOutstandingRequestFn);
  expect(message).toBeNull();
}

function wrapData(func, data) {
  var s, oldBody, body, fn;

  s = func.toString();

  oldBody = s.substring(s.indexOf('{') + 1, s.lastIndexOf('}') - 1);

  body = '';

  Object.keys(data).forEach(function (key) {
    var value = data[key];
    body += 'var ' + key + ' = ' + JSON.stringify(data[key]) + ';\n';
  });

  body += '\n' + oldBody;

  fn = Function('$httpBackend', body);

  return fn;
}

module.exports = {
  build: build,
  verifyNoOutstandingExpectation: verifyNoOutstandingExpectation,
  verifyNoOutstandingRequest: verifyNoOutstandingRequest,
  wrapData: wrapData
};

