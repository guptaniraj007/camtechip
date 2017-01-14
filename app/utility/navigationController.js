'use strict';
app.controller('navigationController', function ($scope, $location, $http, locationService, toaster) {

    $scope.isActive = function (path) {
        var status = locationService.path() === path;
        return status;
    };

    $scope.logout = function(){
        var url=locationService.url('logout');
        $http.post(url).then(function(response) {
                var data = response.data;
                if(data == 200)
                        $location.path('/login');
                else
                    toaster.pop('error', "Error", "Something went wrong, please try again after some time");
                }, function(response) {
                  toaster.pop('error', "Error", "Something went wrong, please try again after some time");
                });
    };
    //$scope.hasUserInCtx = function () {
        
    //    return (!placesDataService.getUserInContext()) ? true : false;
    //};
});