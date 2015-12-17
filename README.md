# protractor-mock-helper

Another protractor http backend mock helper. It uses similar aproach to http-backend-proxy and protractor-http-mock.

## Install

```bash

npm install --save-dev protractor-mock-helper

```


## Usage

```javascript

var mocks = require('protractor-mock-helper');

describe('Example Test Suite', function () {

  it('should test', function () {
    browser.addMockModule('httpBackEndMock', mocks.build([
      function ($httpBackend) {
        return $httpBackend.whenPOST(/api\/auth$/).respond(200);
      }
    ]));

    browser.get('/');
    element(by.css('[name="username"]')).sendKeys('admin');
    element(by.css('[name="password"]')).sendKeys('password');
    element(by.buttonText('OK')).click();

    expect(element(by.css('.messages')).getText()).toMatch('Successfully');
  });

});

```

LICENSE: MIT
