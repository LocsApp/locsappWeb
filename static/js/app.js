var locsApp = angular.module('locsApp', ['ngRoute']);

locsApp.config(function($routeProvider){


    $routeProvider
        .when('/', {
            templateUrl : "/static/templates/home.html"
        })
        .when('/about', {
            templateUrl : "/static/templates/about.html"
        });
});