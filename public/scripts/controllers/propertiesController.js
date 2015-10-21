'use strict';

var sendwattApp = angular.module('sendwattApp');


sendwattApp.controller('PropertiesCtrl', 
   	['$scope', '$timeout', '$routeParams', '$location', '$window',
   	function ($scope, $timeout, $routeParams, $location, $window) {
   		$scope.newProperty = function (){

   			var Properties = Parse.Object.extend("Properties");
			var property = new Properties();

			property.set("name", $scope.propertyName);
			property.set("address", $scope.propertyAddress);
			property.set("units", $scope.propertyUnits);
			property.set("notes", $scope.propertyNotes);

			property.save(null, {
			  success: function(property) {
			    // Execute any logic that should take place after the object is saved.
			    alert('New object created with objectId: ' + property.id);
			    $scope.pullProperties();
			    $scope.showForm();
			  },
			  error: function(property, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to create new object, with error code: ' + error.message);
			  }
			});
   		};

   		$scope.formOpen = false;

   		$scope.showForm = function () {
   			$scope.formOpen = !$scope.formOpen;
   		};

   		$scope.pullProperties = function (){
   			var Properties = Parse.Object.extend("Properties");
			var query = new Parse.Query(Properties);
			query.find({
			  success: function(results) {
			    $scope.propertyList = results;
			    $scope.$apply();
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
   		};
   		$scope.pullProperties();

   		$scope.goToPage = function (path) {
   			$location.path(path);
   		};

   	}]);
