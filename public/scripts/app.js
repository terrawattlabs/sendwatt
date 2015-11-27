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
    'luegg.directives',
    'internationalPhoneNumber'
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
      .when('/buildingdetail/:objID', {
        templateUrl: 'views/buildingdetail.html',
        controller: 'BuildingsCtrl'
      })
      .when('/messages', {
        templateUrl: 'views/messages.html',
        controller: 'MessagesCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/tips', {
        templateUrl: 'views/tips.html',
        controller: 'TipsCtrl'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
