var myApp = angular.module('myApp', ['ngRoute']);
console.log("route")
myApp.config(function($routeProvider,$locationProvider) {
    $routeProvider               
        .when('/',{
            templateUrl : 'pages/home.html',
            controller  : 'homeController'
        }).otherwise({
            redirectTo : '/'
        });
});

