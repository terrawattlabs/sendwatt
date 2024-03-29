'use strict';

var sendwattApp = angular.module('sendwattApp');


sendwattApp.controller('PropertyDetailCtrl', 
   	['$scope', '$timeout', '$routeParams', '$location', '$window', 'growl',
   	function ($scope, $timeout, $routeParams, $location, $window, growl) {
   		var propertyID = $routeParams.objID;
   		$scope.unitofmeasure = [];
   		$scope.buildingList = [];

   	

   		$scope.goToPage = function (path) {
   			$location.path(path);
   		};

   		function findProperty(prop){
   			var Properties = Parse.Object.extend("Properties");
			var query = new Parse.Query(Properties);
			query.equalTo("objectId", prop);
			query.find({
			  success: function(results) {
			    $scope.property = results[0];
			    $scope.$apply();
			    $scope.pullBuildings($scope.property);
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
   		};

   		findProperty(propertyID);


   		$scope.pullBuildings = function (id){
   			var Buildings = Parse.Object.extend("Buildings");
			var query = new Parse.Query(Buildings);

			query.equalTo("property", id);

			query.find({
			  success: function(results) {
			    $scope.buildingList = results;
			    $scope.$apply();
			    calculateUnits(results);
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
   		};

   		

   		function calculateUnits(b) {
   			for (var i = 0; i <= b.length - 1; i++) {
   				var d = b[i];
   				pushUnits(d, i);
   			};
   		};

   		$scope.totalSum = 0;

   		function pushUnits (id, s) {
   			var Items = Parse.Object.extend("Units");
			var query = new Parse.Query(Items);
			query.equalTo("building", id);
			query.find({
			  success: function(results) {
			    $scope.buildingList[s].numUnits = results.length;
			    $scope.totalSum = $scope.totalSum + results.length;
			    $scope.$apply();
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
   		};

   		$scope.showForm = function () {
   			$scope.formOpen = !$scope.formOpen;
   		};


   			$scope.newBuilding = function (){

   			var Buildings = Parse.Object.extend("Buildings");
			var building = new Buildings();

			building.set("Number", $scope.buildingNumber);
			building.set("Notes", $scope.buildingNotes);
			building.set("property", $scope.property);

			building.save(null, {
			  success: function(building) {
			    // Execute any logic that should take place after the object is saved.
			    $scope.pullBuildings($scope.property);
			    $scope.showForm();
			  },
			  error: function(property, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    console.log('Failed to create new object, with error code: ' + error.message);
			  }
			});
   		};

   	}]);
