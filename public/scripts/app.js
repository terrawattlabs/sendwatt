'use strict';

angular
  .module('sendwattApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'angular-growl',
    'ui.select',
    'chart.js',
    'luegg.directives'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/properties', {
        templateUrl: 'views/properties.html',
        controller: 'PropertiesCtrl'
      })
      .when('/propertydetail/:objID', {
        templateUrl: 'views/propertydetail.html',
        controller: 'PropertyDetailCtrl'
      })
      .when('/unitdetail/:objID', {
        templateUrl: 'views/unitdetail.html',
        controller: 'UnitDetailCtrl'
      })
      .when('/messages', {
        templateUrl: 'views/messages.html',
        controller: 'MessagesCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
