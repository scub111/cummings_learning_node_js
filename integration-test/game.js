(function () {
   'use strict';

   var expect = require('chai').expect;
   var page = require('webpage').create();

   var rootUrl = 'http://localhost:3000';

   page.open('http://google.com', function() {
      setTimeout(function() {
         page.render('google.png');
         var content = page.content;
         console.log(content);
         phantom.exit();
      }, 200);
   });
   /*

   withGame('Example', function () {
      expect(getText('#word')).to.equal('_____');
   });

   function withGame(word, callback) {

   }

   function getText(selector) {
      return page.evaluate(function (s) {
         return $(s).text();
      }, selector);
   }

   function verify(expectations) {
      return function() {
         try {
            expectations();
         } catch (e) {
            console.log('Test failed');
         }
      }
   }
   */
   function handleError(message) {
      console.log(message);
      phantom.exit(1);
   }

   phantom.onError = page.onError = handleError;

}());