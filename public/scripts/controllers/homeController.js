'use strict';

var sendwattApp = angular.module('sendwattApp');


sendwattApp.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(5000);
}]);



sendwattApp.controller('HomeCtrl', 
   	['$scope', '$timeout', '$routeParams', '$location', '$window',
   	function ($scope, $timeout, $routeParams, $location, $window) {
   		

   	}]);
