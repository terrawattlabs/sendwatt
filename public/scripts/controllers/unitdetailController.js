var sendwattApp = angular.module('sendwattApp');


sendwattApp.controller('UnitDetailCtrl', 
   	['$scope', '$timeout', '$routeParams', '$location', '$window',
   	function ($scope, $timeout, $routeParams, $location, $window) {
   		var unitID = $routeParams.objID;
   		console.log(unitID);

   		$scope.unit = [];

   		var selUnit;

   		var Units = Parse.Object.extend("Units");
		var query = new Parse.Query(Units);
		query.get(unitID, {
		  success: function(unit) {
		  	console.log(unit);
		  	selUnit = unit;
		    $scope.unit.name = unit.get('name');
		    $scope.unit.address = unit.get('address');
		    $scope.unit.city = unit.get('city');
		    $scope.unit.state = unit.get('state');
		    $scope.unit.zip = unit.get('zip');
		    $scope.unit.phone = unit.get('phone');
		    $scope.unit.notes = unit.get('notes');
		    $scope.unit.spanish = unit.get('spanish');
		    $scope.unit.getmsg = unit.get('getmessages');
		    $scope.unit.smartphone = unit.get('smartphone');

		    getReadings(unit);
		    $scope.$apply();
		  },
		  error: function(object, error) {
		    // The object was not retrieved successfully.
		    // error is a Parse.Error with an error code and message.
		  }
		});

		function getReadings (loc) {
			$scope.labels = [];
			$scope.data = [];
		    $scope.options = {scaleOverride: true};
		    totalKWH = [];
		    sortable = [];
			lowest = "";
			highest = "";
			step = "";
			min = "";
			max = "";

			
			$scope.processedReadings = [];
			kwhCost = 2.55 / 1000;

			var MeterRead = Parse.Object.extend("Readings_Water");
			var query = new Parse.Query(MeterRead);
			query.equalTo("unit", loc);
			query.limit(10);
			query.descending("createdAt");
			query.find({
			  success: function(results) {
			  	createGraph(results);
			  	console.log(results);
			    for (var i = 0; i <= results.length - 1; i++) {
			    	var dCost = (results[i].get('per_day_consumption') * kwhCost).toFixed(2);
			    	var mCost = (results[i].get('per_month_consumption') * kwhCost).toFixed(0);
			    	var multiple = results[i].get('multiple_from_prev');
			    	var percentage;
			    	var direction;
			    	var readingDate = processDate(results[i].createdAt);

			    	if (multiple >= 1) {
		                  percentage = ((multiple -1) * 100).toFixed(0);
		                  direction = "up";
		                 } else {
		                  percentage = ((1 - multiple) * 100).toFixed(0);
		                  direction = "down";
		                };


			    	
			    	$scope.processedReadings[i] = {
			    	"createdAt" : readingDate, 
			    	"measured" : results[i].get('reading'), 
			    	"dailyUse" : results[i].get('per_day_consumption'),
			    	"dailyCost" : "$" + dCost,
			    	"monthlyCost" : "$" + mCost,
			    	"change" : percentage + "%",
			    	"changeDirection": direction
			    }
			    	if (i == results.length - 1) {
			    		$scope.$apply();
			    		console.log('tried to apply scope');
			    	};
			    };
			    
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});

		};
		
		function processDate(myDate){
    	var readableDate = myDate.getMonth() + 1 + "/" + myDate.getDate() + "/" + myDate.getFullYear();
    	return readableDate;
    };

    	$scope.set_color = function (reading) {
    		var font;
    		if (reading.changeDirection == "up") {
    			font = {color: "red"}
    		};
    		if (reading.changeDirection == "down") {
    			font = {color: "green"}
    		};
    		return font;
    	};

    	$scope.goToPage = function(path){
    	console.log(path);
		$location.path(path);
		
		};

function highLowOfArray(actual, func){
			  var newArray = new Array();
			  for(var i = 0; i<actual.length; i++){
			      if (actual[i]){
			        newArray.push(actual[i]);
			    }
			  }

			  if (func == "low") {
			  	newArray.sort(function (a,b){return a-b});
			  	
			  };

			  if (func == "high") {
			  	
			  	newArray.sort(function(a, b){return b-a});
			  };
			  


			  return newArray[0];
			};

				
		
			function daysInMonth(month,year) {
			    return new Date(year, month +1, 0).getDate();
			};


			$scope.labels = [];
   		    $scope.data = [];
		    $scope.options = {scaleOverride: true};
		    var totalKWH = [];
		    var sortable;
		    var lowest;
		    var highest;
		    var step;
		    var min;
		    var max;

	function createGraph (results) {
		var prevDate;
			    for (var i = 0; i <= results.length-1; i++) {
			    	var dCost = (results[i].get('per_day_consumption') * kwhCost).toFixed(2);
			    	var mCost = (results[i].get('per_month_consumption') * kwhCost).toFixed(0);
			    	var multiple = results[i].get('multiple_from_prev');
			    	var reading = results[i].get('reading');
			    	var dailyUse = results[i].get('per_day_consumption');
			    	var percentage;
			    	var direction;
			    	var currentDate = results[i].createdAt;
			    	var readingDate = processDate(currentDate);

			    	if (prevDate) {
			    		if (prevDate.getMonth() == currentDate.getMonth()) {
			    			if (currentDate.getDate() - prevDate.getDate() <= -2 ) {
			    				//check if there are missing days within a month
			    				var firstDaysDiff = currentDate.getDate() - prevDate.getDate();

			    				console.log(firstDaysDiff);
			    				blankDays(-firstDaysDiff);
			    				
			    			};			    				
			    		} if (prevDate.getMonth() != currentDate.getMonth()) {
			    			// check if there are missing days that span over 2 different months

			    			var dayCurrent = currentDate.getDate();
			    			console.log('day current ' + dayCurrent);
			    			var dayPrev = prevDate.getDate();
			    			console.log('day previous ' + dayPrev);
			    			var daysPrevMonth = daysInMonth(currentDate.getMonth(), prevDate.getYear());

			    			console.log("days of previous " + daysPrevMonth);
			    			
			    			var totalDaysDiff = (daysPrevMonth - dayCurrent) + dayPrev -1;
			    			console.log(totalDaysDiff);
			    			for (var y = totalDaysDiff - 1; y >= 0; y--) {
			    				$scope.labels.push('');
			    				totalKWH.push('');
			    			};



			    		};
			    	} else {

			    	};
			    	

			    	if (multiple >= 1) {
		                  percentage = ((multiple -1) * 100).toFixed(0);
		                  direction = "up";
		                 } else {
		                  percentage = ((1 - multiple) * 100).toFixed(0);
		                  direction = "down";
		                };

		            $scope.labels.push(readingDate);
		            totalKWH.push(dailyUse);
			    		    	
			    				
			    	if (i == results.length - 1) {
			    		$scope.labels = $scope.labels.reverse();
			    		$scope.data[0] = totalKWH.reverse();
			    		sortable = $scope.data[0];

			    		lowest = highLowOfArray(sortable, "low");
			    		highest = highLowOfArray(sortable, "high");
			    		
			    		step = 1.0;
			    		min = Math.floor((lowest * .90)/step)*step;
			    		max = Math.ceil((highest * 1.10)/step)*step;
			    		
			    		console.log(min);
			    		console.log(max);


			    		$scope.options.scaleSteps = Math.ceil((max-min)/step);
			    		$scope.options.scaleStepWidth = step;
			    		$scope.options.scaleStartValue = min;
			    		$scope.$apply();
			    		console.log('tried to apply scope');
			    	};
			    	prevDate = results[i].createdAt;
			    };
	};

	function blankDays (num){
		console.log('got to the function' +  num);
		for (var i = num - 2; i >= 0; i--) {
			$scope.labels.push('');
			totalKWH.push('');
		};
		
	};

$scope.changeLang = function (){
	var unit = selUnit;

	unit.set("spanish", $scope.unit.spanish);
	unit.set("getmessages", $scope.unit.getmsg);
	unit.set("smartphone", $scope.unit.smartphone);

	unit.save(null, {
	  success: function(u) {
	    u.save();
	  }
	});
};



   	}]);
