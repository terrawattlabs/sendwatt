'use strict';

var sendwattApp = angular.module('sendwattApp');


sendwattApp.controller('testCtrl', 
    ['$scope', '$timeout', '$routeParams', '$location', '$window', 'growl',
    function ($scope, $timeout, $routeParams, $location, $window, growl) {

      var tipArray = [];
      var y = 'water';

var Tips = Parse.Object.extend("Tips");

var utilityQuery = new Parse.Query(Tips);
    utilityQuery.equalTo("utility", y);

var allQuery = new Parse.Query(Tips);
    allQuery.equalTo("utility", "all");

var queryNeg = new Parse.Query.or(utilityQuery, allQuery);
    queryNeg.equalTo("direction", "negative");

var queryPos = new Parse.Query.or(utilityQuery, allQuery);
    queryPos.equalTo("direction", "positive");

queryNeg.find().then(function (negtips) {
  console.log(negtips.length);
  var n = getRandomInt(0,negtips.length);
  console.log(n);
  var body = negtips[n].get('body');
  console.log(body);
  tipArray.push(body);

})
.then(function() {
  queryPos.find().then(function (postips) {
    console.log(postips.length);
      var n = getRandomInt(0,postips.length);
      var body = postips[n].get('body');
      console.log(body);
      tipArray.push(body);
  }).then(function (){
    console.log(tipArray);
  });

});


 function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
};




    }]);
