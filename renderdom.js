#!/usr/bin/env phantomjs

// renderdom.js
//
// A phantomjs script for saving the rendered DOM of a website after scrolling.
//
// Usage: phantomjs renderdom.js <url> [image-path]
//
// Running the command will open <url>, let all scripts run and then scroll to
// the bottom of the page before storing an optional screenshot at [image-path]
// and printing the rendered DOM to stdout.

// Set a reasonable viewport size
const VIEWPORT_WIDTH  = 1280;
const VIEWPORT_HEIGHT =  720;

// Configure different timeouts. See below for what they are used.
const REQUEST_POLL_INTERVAL  = 500;
const SCROLL_TRIGGER_TIMEOUT = 500;
const SCRIPT_TIMEOUT         = 500;

var system = require('system');
var webPage = require('webpage');

var page = webPage.create();
var url = system.args[1];
var imagePath = system.args[2];

page.viewportSize = {
  width: 1280,
  height: 720
};

// A user agent is probably a good idea to not confuse the server
page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36'

// We keep track of open requests to find out if the page finished loading
var openRequests = [];

// This flag indicates if requests were send
var didRequest = false;

page.onResourceRequested = function(requestData, networkRequest) {
  didRequest = true;
  openRequests.push(requestData.id);
};

page.onResourceReceived = function(response) {
  var index = openRequests.indexOf(response.id);
  openRequests.splice(index, 1);
};

page.open(url, function(status) {
  scrollolol();
});

function scrollolol() {
  // Wait for open requests to finish
  var interval = setInterval(function() {
    if(openRequests.length === 0) {
      clearInterval(interval);

      // There were requests (that's how we came here) but now we reset the
      // flag so that we can check if scrolling the page will trigger other
      // requests.
      didRequest = false;

      // Timeout to let any scripts finish
      setTimeout(function() {

        // Scroll to the bottom of the page. This might trigger new requests.
        page.evaluate(function() {
          window.scrollTo(0, document.body.scrollHeight);
        });

        // Timeout to let requests trigger
        setTimeout(function() {

          // If scrolling down triggered new requests we call this function
          // again which will wait for the requests to finish, scroll down,
          // and check again .. recursion, you know.
          // We reached the end of the page if scrolling did not trigger
          // requests.
          if(didRequest) {
            scrollolol();
          }
          else {
            if(imagePath) {
              page.render(imagePath);
            }
            system.stdout.writeLine(page.content);
            phantom.exit();
          }
        }, SCROLL_TRIGGER_TIMEOUT);
      }, SCRIPT_TIMEOUT);
    }
  }, REQUEST_POLL_INTERVAL);
}
