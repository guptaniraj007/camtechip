"use strict";
app.controller("loginController", function($scope, $http, $location, toaster, locationService) {
    $scope.load = false;
    $scope.email = '';
    $scope.password = '';
    $scope.is_active = false;
    var data;
    $scope.init = function() {
        var url = locationService.url('login');
        $http.post(url).then(function(response) {
            data = response.data;
            if (data == 200) {
                $location.path('/dashboard');
            }
            else {
                $scope.load = true;
            }
        }, function(response) {
            toaster.pop('error', "Error", "Something went wrong, please try again after some time");
            $scope.is_active = false;
        });
    };

    $scope.login = function() {
        $scope.is_active = true;
        var url = locationService.url('login');
        data = {
            email: $scope.email,
            password: $scope.password
        };
        $http.post(url, data).then(function(response) {
            data = response.data;
            if (data == 403)
                toaster.pop('error', "Error", "Incorrect Credentials");
            else if (data == 200)
                $location.path('/dashboard');
            else
                toaster.pop('error', "Error", "Something went wrong, please try again after some time");
            $scope.is_active = false;
        }, function(response) {
            toaster.pop('error', "Error", "Something went wrong, please try again after some time");
            $scope.is_active = false;
        });
    };

    $scope.init();
});