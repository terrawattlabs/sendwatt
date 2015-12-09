'use strict';

var sendwattApp = angular.module('sendwattApp');


sendwattApp.controller('BuildingsCtrl', 
   	['$scope', '$timeout', '$routeParams', '$location', '$window', 'growl',
   	function ($scope, $timeout, $routeParams, $location, $window, growl) {
   		$scope.unitofmeasure = [];
		var buildingID = $routeParams.objID; 

   		$scope.pullBuilding = function (id){
   			var Buildings = Parse.Object.extend("Buildings");
			var query = new Parse.Query(Buildings);
			query.equalTo("objectId", id);
			query.find({
			  success: function(results) {
			    $scope.building = results[0];
			    findProperty(results[0].get('property'));
			    $scope.$apply();
			    $scope.pullUnits($scope.building);
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
   		};

   		function findProperty(prop){
   			var Properties = Parse.Object.extend("Properties");
			var query = new Parse.Query(Properties);
			query.get(prop.id,{
			  success: function(results) {
			    $scope.property = results;
			    $scope.$apply();
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
   		};

   		$scope.pullBuilding(buildingID);

   		$scope.goToPage = function (path) {
   			$location.path(path);
   		};

   		$scope.formOpen = false;

   		$scope.showForm = function () {
   			$scope.formOpen = !$scope.formOpen;
   		};

   		$scope.newUnit = function (){

   			var Units = Parse.Object.extend("Units");
			var unit = new Units();

			//take symbols out of phone number
			var stripedPhone = $scope.unitPhone.replace(/[^\d]/g, '');
			// remove '1' if its the first number
			var processedPhone = stripedPhone.replace(/^[1]/, '');
			// add '+1' to the phone number
			var readyPhone = '+1' + processedPhone;


			unit.set("name", $scope.unitName);
			unit.set("address", $scope.unitAddress);
			unit.set("phone", readyPhone);
			unit.set("notes", $scope.unitNotes);
			unit.set("building", $scope.building);
			unit.set("property", $scope.property);
			unit.set("getmessages", true);

			unit.save(null, {
			  success: function(unit) {
			    // Execute any logic that should take place after the object is saved.
			    $scope.pullUnits($scope.building);
			    $scope.showForm();
			  },
			  error: function(property, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    console.log('Failed to create new object, with error code: ' + error.message);
			  }
			});
   		};

   		$scope.pullUnits = function (id){
   			console.log(id);
   			var Units = Parse.Object.extend("Units");
			var query = new Parse.Query(Units);
			query.equalTo("building", id);
			query.find({
			  success: function(results) {
			    $scope.unitList = results;
			    $scope.$apply();
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
   		};
   		

   		$scope.reading_entry =[];



   		// saving the meter readings --- - -- - - -------------------------------------------------------------

   			//all variables need to be set


	var meter_read;
	var location;
	var prev_read;
	var prev_createdAt;
	var prev_per_day;
	var consumption_since_prev;
	var consumption_per_day;
	var consumption_per_month;
	var multiple_from_prev;


	$scope.findUnit = function (i,ID) {
		var Units = Parse.Object.extend("Units");
		var query = new Parse.Query(Units);
		query.get(ID, {
		  success: function(unit) {
		  	//console.log(unit);
		    $scope.newReading(i,ID,unit);
		  },
		  error: function(object, error) {
		    // The object was not retrieved successfully.
		    // error is a Parse.Error with an error code and message.
		  }
		});
	};



	$scope.newReading = function(i, ID, unitObj) {
		console.log("got to the function");

		// from meter read
		meter_read = parseFloat($scope.reading_entry[i]);
		location = unitObj;
		//console.log(meter_read);
		
		// pull previous reading


		var MeterRead;
		

		if ($scope.unitofmeasure[i] == "elec") {
			MeterRead = Parse.Object.extend("Readings_Elec");
		} if ($scope.unitofmeasure[i] == "water") {
			MeterRead = Parse.Object.extend("Readings_Water");
		} if ($scope.unitofmeasure[i] == "gas") {
			MeterRead = Parse.Object.extend("Readings_NG");
		};

		var query = new Parse.Query(MeterRead);
		query.equalTo("unit", location);
		query.descending("createdAt");
		query.limit(1);
		query.find({
		  success: function(reading) {
		  	console.log('here is the previous reading we got');
		  	//console.log(reading[0].get('prev_kwh_read'));
		   	pushWithPrevious(reading[0], i);
		   	console.log(reading);
		  },
		  error: function(object, error) {
		    // The object was not retrieved successfully.
		    // error is a Parse.Error with an error code and message.
		  }
		});

	};

	function pushWithPrevious (reading, i) {
			console.log('another function');
			var MeterRead;

			if ($scope.unitofmeasure[i] == "elec") {
			MeterRead = Parse.Object.extend("Readings_Elec");
			} if ($scope.unitofmeasure[i] == "water") {
				MeterRead = Parse.Object.extend("Readings_Water");
			} if ($scope.unitofmeasure[i] == "gas") {
				MeterRead = Parse.Object.extend("Readings_NG");
			};
			var meter_read_object = new MeterRead();

			//from previous
			if (reading !== undefined) {
				prev_read = reading.get('reading');
				prev_createdAt = reading.createdAt;
				prev_per_day = reading.get('per_day_consumption');

				console.log('inside the previous function');
			};
			



			 
			meter_read_object.set("reading", meter_read);
			meter_read_object.set("unit", location);
			meter_read_object.set("prev_read", prev_read);
			meter_read_object.set("prev_createdAt", prev_createdAt);
			meter_read_object.set("prev_per_day", prev_per_day);

			 
			meter_read_object.save(null, {
			  success: function(meter_read_object) {
			    console.log('success');
			    calculateAndPush(meter_read_object, i);
			  },
			  error: function(meter_read_object, error) {
			   
			  }
			});
	};

	function calculateAndPush (obj, i) {
		// var daysSincePrevious = (obj.createdAt - prev_createdAt) / 1000 / 60 / 60 / 24;
		var daysSincePrevious = 1;
		console.log('time since previous is - ' + daysSincePrevious);


		//calculated
			consumption_since_prev = meter_read - prev_read;
			consumption_per_day = consumption_since_prev / daysSincePrevious;
			var consumption_per_day_form = parseFloat(consumption_per_day.toFixed(2));
			consumption_per_month = consumption_per_day * 30.4;
			var consumption_per_month_form = parseFloat(consumption_per_month.toFixed(2));
			multiple_from_prev = consumption_per_day / prev_per_day;
			var multiple_from_prev_form = parseFloat(multiple_from_prev.toFixed(4));


			// console.log(consumption_since_prev);
			// console.log(consumption_per_day);
			// console.log(consumption_per_month);
			// console.log(multiple_from_prev);

			var id = obj.id;
			var MeterRead;

			if ($scope.unitofmeasure[i] == "elec") {
				MeterRead = Parse.Object.extend("Readings_Elec");
			} if ($scope.unitofmeasure[i] == "water") {
				MeterRead = Parse.Object.extend("Readings_Water");
			} if ($scope.unitofmeasure[i] == "gas") {
				MeterRead = Parse.Object.extend("Readings_NG");
			};

			
			var query = new Parse.Query(MeterRead);
			query.get(id, {
			  success: function(read) {
			  	console.log('found this read');
			  	console.log(read);
			    	read.save(null, {
						success: function(read) {
							read.set("consumption_since_prev", consumption_since_prev);
							read.set("per_day_consumption", consumption_per_day_form);
							read.set("per_month_consumption", consumption_per_month_form);
							read.set("multiple_from_prev", multiple_from_prev_form);
							read.save();
							growl.addSuccessMessage("Saved!!!");
							//$scope.changeSelectedLocation($scope.selLocation);

							
						}
					});
			  },
			  error: function(object, error) {
			    // The object was not retrieved successfully.
			    // error is a Parse.Error with an error code and description.
			  }
			});


	};




   	}]);
