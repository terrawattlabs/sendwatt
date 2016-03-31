'use strict';

var sendwattApp = angular.module('sendwattApp');


sendwattApp.controller('testCtrl', 
    ['$scope', '$timeout', '$routeParams', '$location', '$window', 'growl',
    function ($scope, $timeout, $routeParams, $location, $window, growl) {

      $scope.sendIt = function (){
        console.log('ran function');
        
        Parse.Cloud.run('frontAPP', {}, {
                  success: function(result) {
                    console.log(result);
                },
                  error: function(error) {
                    //console.log(error);
                  }
                });
      };


    }]);
