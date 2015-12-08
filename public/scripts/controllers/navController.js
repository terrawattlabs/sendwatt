'use strict';

var sendwattApp = angular.module('sendwattApp');

sendwattApp.controller('NavCtrl', 
   	['$scope', '$timeout', '$routeParams', '$location', '$window',
   	function ($scope, $timeout, $routeParams, $location, $window) {
   		 var currentUser = Parse.User.current();
   		 $scope.fname = currentUser.get('name');
   		

   		 $scope.logOut = function () {
	    	Parse.User.logOut();
	    	console.log('logged out');
		
			 $scope.goToPage('/');

			 $timeout(reloadPage, 500);

    	};

      $scope.isActive = function (viewLocation) {
          return viewLocation === $location.path();
      };
    	

    	$scope.goToPage = function(path){
		$location.path(path);
		
	};

}]);