'use strict';

var sendwattApp = angular.module('sendwattApp');

sendwattApp.controller('TipsCtrl', 
   	['$scope', '$timeout', '$routeParams', '$location', '$window', 'growl',
   	function ($scope, $timeout, $routeParams, $location, $window, growl) {
   		 var currentUser = Parse.User.current();
   	
        $scope.test = "hello";

        $scope.showForm = function () {
        $scope.formOpen = !$scope.formOpen;
      };

      $scope.newTip = function (){

      var Tips = Parse.Object.extend("Tips");
      var tip = new Tips();

      tip.set("title", $scope.tipTitle);
      tip.set("direction", $scope.tipDirection);
      tip.set("body", $scope.tipBody);
      tip.set("utility", $scope.tipUtility);
      console.log($scope.tipUtility);
      tip.save(null, {
        success: function(tip) {
          // Execute any logic that should take place after the object is saved.
          $scope.pullTips();
          $scope.showForm();
        },
        error: function(tip, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to create new object, with error code: ' + error.message);
        }
      });
      };

      $scope.pullTips = function (){
      var Tips = Parse.Object.extend("Tips");
      var query = new Parse.Query(Tips);
      query.find({
        success: function(results) {
          $scope.tipList = results;
          $scope.$apply();
          console.log('pulled tips');
        },
        error: function(error) {
          alert("Error: " + error.code + " " + error.message);
        }
      });
      };
      $scope.pullTips();

      $scope.tipDetail = false;
      $scope.selectedTip = [];

      $scope.showTip = function (i) {
        $scope.tipDetail = true;
        $scope.currentTip = $scope.tipList[i];
        $scope.selectedTip.title = $scope.tipList[i].get('title');
        $scope.selectedTip.body = $scope.tipList[i].get('body');
        $scope.selectedTip.direction = $scope.tipList[i].get('direction');
        $scope.selectedTip.spanish = $scope.tipList[i].get('spanish');
        $scope.selectedTip.utility = $scope.tipList[i].get('utility');


      };


    $scope.saveTip = function () {
      // Create the object.
      var Tips = Parse.Object.extend("Tips");
      var tip = $scope.currentTip;
    

      tip.save(null, {
        success: function(tip) {
          tip.set("title", $scope.selectedTip.title);
          tip.set("body", $scope.selectedTip.body);
          tip.set("direction", $scope.selectedTip.direction);
          tip.set("spanish", $scope.selectedTip.spanish);
          tip.set("utility", $scope.selectedTip.utility);
          tip.save();

          $timeout(function() {
           $scope.pullTips();
           growl.addSuccessMessage("Saved");
        }, 500);
          
        }
      });


    };

}]);