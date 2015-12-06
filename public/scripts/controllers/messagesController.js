var sendwattApp = angular.module('sendwattApp');


sendwattApp.controller('MessagesCtrl', 
   	['$scope', '$timeout', '$routeParams', '$location', '$window',
   	function ($scope, $timeout, $routeParams, $location, $window) {

   		var z = jstz.determine();
    	var clientZone = z.name();

   		$scope.selectedUnit;

   		$scope.sendMessage = function(){
   			var Messages = Parse.Object.extend("Messages");
			var message = new Messages();

			message.set("body", $scope.newMessage);
			message.set("type", "outgoing");
			message.set("unread", false);
			message.set("unit", $scope.selectedUnit.id);

			message.save(null, {
			  success: function(gameScore) {
			  sendSMS($scope.newMessage, $scope.selectedUnit.get('phone'));
			   $scope.newMessage = "";
			   $scope.pullMessages();


			  },
			  error: function(gameScore, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to create new object, with error code: ' + error.message);
			  }
			});
   		};

   		function sendSMS(m, p) {
   			Parse.Cloud.run('outgoingSMS', {
                  "sendTo" : p,
                  "message": m
                }, {
                  success: function(result) {
                    console.log(result);
                },
                  error: function(error) {
                    //console.log(error);
                  }
                });
   		};

$scope.unitList;

   		$scope.pullUnits = function (){
   			var Units = Parse.Object.extend("Units");
			var query = new Parse.Query(Units);
			query.find({
			  success: function(results) {
			    $scope.unitList = results;

			    $scope.selectedUnit = $scope.unitList[0];
			    checkUnread(results);
			    //startTimer();
			    $scope.$apply();
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
   		};

   		$scope.pullUnits();

   		

   		$scope.select = function (i) {
   			console.log('got to the function' + i);
   			$scope.selectedUnit = $scope.unitList[i];
   			$scope.pullMessages();
   		};

   		$scope.pullMessages = function (){
   			var selectID = $scope.selectedUnit.id;
   			console.log(selectID);

   		var Messages = Parse.Object.extend("Messages");
			var query = new Parse.Query(Messages);
			query.equalTo("unit", $scope.selectedUnit.id);
			//query.limit(20);
         query.ascending("createdAt");
			query.find({
			  success: function(messages) {
			    $scope.messages = messages;
			    markAsRead(messages);
			    processDates(messages);
             processUrl(messages);
			    $scope.$apply();
			  },
			  error: function(object, error) {
			    // The object was not retrieved successfully.
			    // error is a Parse.Error with an error code and message.
			  }
			});
   		};

   		// function startTimer () {
   		// 	setTimeout(function() {
   		// 		$scope.pullMessages();
   		// 		checkUnread($scope.unitList);
   		// 		console.log('Did the timer');
   		// 		startTimer();
   		// 	}, 10000);
   		// };

   		function markAsRead (msgs) {
   			for (var i = msgs.length - 1; i >= 0; i--) {
   				if (msgs[i].get('unread') == true) {
   					updateStatus(msgs[i]);
   				};
   			};
   		};

   		function updateStatus(obj) {
   			console.log('updated a status');
   			// Create the object.
			var Messages = Parse.Object.extend("Messages");
			var message = obj;


			message.save(null, {
			  success: function(message) {
			    // Now let's update it with some new data. In this case, only cheatMode and score
			    // will get sent to the cloud. playerName hasn't changed.
			    message.set("unread", false);
			    message.save();
			  }
			});
   		};

   		function checkUnread (obj) {

   			console.log($scope.unitList[0]);
   			for (var i = 0; i <= obj.length -1; i++) {
 				findMsgs(i, obj[i].id);	
 			
   			};
   		};

   		function findMsgs (i,id) {
   				var idString = id;
   				//console.log(idString);

				var Messages = Parse.Object.extend("Messages");
				var query = new Parse.Query(Messages);
				query.equalTo("unit", idString);
				query.equalTo("unread", true);
				query.find({
				  success: function(results) {
				  	 //console.log(results);
				     //console.log(results.length);
				     //console.log(i);
				     addToList(i,results.length, 'unread');
				     
				  },
				  error: function(error) {
				    // There was an error.
				  }
				});
   		};

   	function addToList (i,d,v) {
   		if (v == 'unread') {
   			//console.log(i);
   		$scope.unitList[i].unreadLength = d;
   		} if (v == 'time') {
   			console.log('time - ' + i);
   			//console.log($scope.unitList[i]);
   			$scope.messages[i].friendlyTime = d;
   		} if (v == 'url') {
            $scope.messages[i].url = d;
         };
   		
   		$scope.$apply();
   	};

   	function processDates(msgs) {
   		for (var i = 0; i <= msgs.length - 1; i++) {
   			console.log(i);
   			var friendly = moment(msgs[i].createdAt).fromNow();
   			addToList(i,friendly, 'time');
   		};
   		

   	};

      function processUrl (msgs) {
         for (var i = 0; i <= msgs.length - 1; i++) {
            var url;

            if (msgs[i].get('type') == 'incoming') {
               var letter = $scope.selectedUnit.get('name').charAt(0);

               url = 'http://placehold.it/50/55C1E7/fff&text=' + letter;
            } if (msgs[i].get('type') == 'outgoing') {
               url = 'http://placehold.it/50/FA6F57/fff&text=ME'
            };
            addToList(i,url, 'url');
         };
      };


   	}]);
