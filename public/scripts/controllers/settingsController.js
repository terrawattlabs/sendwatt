'use strict';

var sendwattApp = angular.module('sendwattApp');


sendwattApp.controller('SettingsCtrl', 
   	['$scope', '$timeout', '$routeParams', '$location', '$window', 'growl', 
   	function ($scope, $timeout, $routeParams, $location, $window, growl) {

   		 var currentUser = Parse.User.current();

   		 $scope.settings;
   		 $scope.selectedFreq;
   		 $scope.frequencies;
   		 $scope.messageTemplate;
   		 $scope.msgText;

   		 var templateID;

   		 // pull user settings
   		var Settings = Parse.Object.extend("Settings");
		var query = new Parse.Query(Settings);
		query.equalTo("user", currentUser);
		query.find({
		  success: function(results) {
		    $scope.settings = results[0];
		    pullTemplate(results[0].get('primaryTemplate').id);
		    templateID = results[0].get('primaryTemplate'.id);
		    pullDefFreq(results[0].get('frequency').id);
		    $scope.$apply();
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});

		// pull frequencies
   		var Frequency = Parse.Object.extend("Frequency");
		var query = new Parse.Query(Frequency);
		//query.equalTo("user", currentUser);
		query.find({
		  success: function(results) {
		    $scope.frequencies = results;
		  
		    $scope.$apply();
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});

		// pull default frequency 
		function pullDefFreq (id){
			var Frequency = Parse.Object.extend("Frequency");
			var query = new Parse.Query(Frequency);
			query.get(id, {
			  success: function(freq) {
			    $scope.selectedFreq = freq;
			    $scope.$apply();
			  },
			  error: function(object, error) {
			    // The object was not retrieved successfully.
			    // error is a Parse.Error with an error code and message.
			  }
			});
		};
		

		function pullTemplate(d) {
			var MsgTemplate = Parse.Object.extend("MsgTemplate");
			var query = new Parse.Query(MsgTemplate);
			query.get(d, {
			  success: function(template) {
			    $scope.messageTemplate = template;
			    $scope.msgText = $scope.messageTemplate.get('template');
			    $scope.$apply();
			  },
			  error: function(object, error) {
			    // The object was not retrieved successfully.
			    // error is a Parse.Error with an error code and message.
			  }
			});
		};

		


   		$scope.fields = [
   		{title:"Customer Name", description: "The name of the customer recieving the SMS message", text: "{{customer.name}}"},
   		{title:"Calculated Cost", description: "Calculated cost of energy", text: "{{cost}}"},
   		];




   		//$scope.selectedFreq;

   		$scope.changeFreq = function (f) {
   			$scope.selectedFreq = f;
   		};

   		

   		$scope.addField = function (f) {
   			//$scope.msgText = $scope.msgText + f.text;
   			var cursorPos = angular.element(document.querySelector('#txtInput')).prop('selectionStart');
   			console.log(cursorPos);
   			// compileString();
   		};

  

   		// $scope.otherLang = [
   		// {language: "spanish", messageTemplate}
   		// ];

   		function compileString() {
   				var str = $scope.msgText;
   			for (var i = 0; i <= $scope.fields.length - 1; i++) {
   				
   				str = str.replace(/$scope.fields[i].text/g, "");
   				console.log("interval = " +  i + " string = " + str);
   			};
   		};


		$scope.saveSettings = function () {
			// Create the object.
			var Settings = Parse.Object.extend("Settings");
			var setting = $scope.settings;
			var frequency = $scope.selectedFreq;

			setting.save(null, {
			  success: function(setting) {
			    setting.set("frequency", frequency);
				setting.set("user", currentUser);
			    setting.save();

			    saveTemplate(templateID);
			    pullDefFreq(frequency.id);
			  }
			});


		};

		function saveTemplate(id){
			var MsgTemplate = Parse.Object.extend("MsgTemplate");
			var template = $scope.messageTemplate;			

			template.save(null, {
			  success: function(template) {
			    // Now let's update it with some new data. In this case, only cheatMode and score
			    // will get sent to the cloud. playerName hasn't changed.
			    template.set("template", $scope.msgText);

			    template.save();
			    growl.addSuccessMessage("Saved");
			  }
			});

		};



   	}]);
