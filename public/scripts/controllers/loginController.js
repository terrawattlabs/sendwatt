var sendwattApp = angular.module('sendwattApp');

sendwattApp.controller('LoginCtrl', 
   	['$scope', '$location', '$window', '$modal', '$log', '$timeout', 'growl',
   	function ($scope, $location, $window, $modal, $log, $timeout, growl) {
   		

   		$scope.newUser = function () {
   			var user = new Parse.User();
   			var userEmail = $scope.email;
	   		var userName = $scope.name;
	   		var userPass = $scope.password;

			user.set("username", userEmail);
			user.set("password", userPass);
			user.set("email", userEmail);
			user.set("name", userName);



			user.signUp(null, {
			  success: function(user) {
			  	gotoHome();
			  },
			  error: function(user, error) {
			    // Show the error message somewhere and let the user try again.
			    alert("Error: " + error.code + " " + error.message);
			  }
			});

   		};//end new user




   		function gotoHome (){
   			$scope.$apply( function() {
			    	$location.path('/home');
			     	});
			    $window.location.reload();
   		};
   		
   		
   		$scope.login = function () {
   			var myemail = $scope.loginEmail;
   			var mypass = $scope.loginPass
   			Parse.User.logIn(myemail, mypass, {

				  success: function(user) {

				    gotoHome();
			     	
				  },
				  error: function(user, error) {
				    // The login failed. Check error to see why.
				  }
			});
   		};

 

		$scope.forgotPass = function () {
			var email = $scope.loginEmail;
			if (email == undefined) {
				growl.addErrorMessage("Please fill out your email first");
			} else {
				// console.log('forgot pass sent to: ' + email);

				Parse.User.requestPasswordReset(email, {
				  success: function() {
				    // Password reset request was sent successfully
				    growl.addSuccessMessage("Great, check your email to reset password!");
				  },
				  error: function(error) {
				    // Show the error message somewhere
				    growl.addErrorMessage("Uh oh " + error.message);
				  }
				});
			};
			
		};


   	}]);