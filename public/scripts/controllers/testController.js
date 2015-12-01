'use strict';

var sendwattApp = angular.module('sendwattApp');


sendwattApp.controller('testCtrl', 
    ['$scope', '$timeout', '$routeParams', '$location', '$window', 'growl',
    function ($scope, $timeout, $routeParams, $location, $window, growl) {
       $scope.tipArray = [];

       findPosTips("a", 'b', 'c', 'elec');


  function findPosTips (sendTo, nm, u, y){

    var Tips = Parse.Object.extend("Tips");

    var utilityQuery = new Parse.Query(Tips);
    utilityQuery.equalTo("utility", y);

    var allQuery = new Parse.Query(Tips);
    allQuery.equalTo("utility", "all");

   

    var query = new Parse.Query.or(utilityQuery, allQuery);
    query.equalTo("direction", "positive");
    query.find({
      success: function(results) {
        var max = results.length - 1;
        var n = getRandomInt(0, max);
        console.log("length was  - " + results.length);
        console.log("N was - " + n);

        console.log(results[n]);

        $scope.tipArray.push(results[n]);
        findNegTips(sendTo, nm, u, y);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
 
  };

  function findNegTips (sendTo, nm, u, y){

    var Tips = Parse.Object.extend("Tips");

    var utilityQuery = new Parse.Query(Tips);
    utilityQuery.equalTo("utility", y);

    var allQuery = new Parse.Query(Tips);
    allQuery.equalTo("utility", "all");

   

    var query = new Parse.Query.or(utilityQuery, allQuery);
    query.equalTo("direction", "negative");
    query.find({
      success: function(results) {
        var max = results.length - 1;
        var n = getRandomInt(0,max);
        console.log("length was  - " + results.length);
        console.log("N was - " + n);
        $scope.tipArray.push(results[n]);
        $scope.$apply();
        //getReadingSend(sendTo, nm, u, y); 

      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };
 



 function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
};




    }]);
