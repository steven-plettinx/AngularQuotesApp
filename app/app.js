'use strict'

angular.module('App', ['ngRoute'])

    .config(function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'assets/views/home.html',
                controller: 'homeCtrl'
            })
            .when('/persons', {
                templateUrl: 'assets/views/persons.html',
                controller: 'personsCtrl'
            })
            .when('/persons/:person_id', {
                templateUrl: 'assets/views/quotes.html',
                controller: 'quotesCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    })

    .controller('homeCtrl', ['$scope', function homeCtrl($scope) {

    }])
    
    .controller('personsCtrl', ['$scope', 'personSrv', function personsCtrl($scope, personSrv) {
        $scope.persons = personSrv.getAllPersons();
    }])

    .controller('quotesCtrl', ['$scope', '$routeparams', 'quotesSrv', function quotesCtrl($scope, $routeparams, quotesSrv) {
        var personJSON = quotesSrv.getPerson($routeparams.person_id);
        $scope.person = personJSON;
        $scope.quotes = personJSON.quotes;
    }])

    .factory('personSrv', [$http, $q, function ($http, $q) {
        return {
            getAllPersons: function () {

                $http.get('https://overlordkitten.cloudant.com/dashboard.html#/database/quotesapp/_all_docs')
                    .then(function(response) {
                        if(typeof response.data === JSON) {
                            console.log(response.data);
                            return response.data.rows;
                        }

                        else {
                            console.log("Error: " + response.data);
                            return $q.reject(response.data);
                        }
                    }, function (response) {
                            console.log("something went wrong");
                            return $q.reject(resonse.data);
                })

            }
        }
    }])

    .factory('quotesSrv', [$http, $q, function ($http, $q) {
        return {
            getPerson: function (person_id) {

                $http.get('https://overlordkitten.cloudant.com/quotesapp/' + person_id)
                    .then(function (response) {
                        if(typeof response.data === JSON) {
                            console.log(response.data);
                            return response.data;
                        }

                        else {
                            console.log('Error' + response.data);
                            return $q.reject(response.data);
                        }

                    }, function (response) {
                        console.log("Something went wrong");
                        return $q.reject(response.data);
                    })
            }
        }
    }])