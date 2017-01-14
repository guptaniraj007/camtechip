app.controller("applicationDetailController", function ($scope, $http, $location, $filter, toaster, locationService, $routeParams) {
    "use strict";
    $scope.header = "Application";
    $scope.load =  false;
    $scope.params = {};
    $scope.innovation = {};
    
    $scope.init = function(){
            $scope.params.service_name = 'GET_APPLICATION_DETAILS';
        $scope.params.values = {application_id: $routeParams.application_id};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
    return temp.then(function(response){
        console.log(response);
        if(!angular.isUndefined(response.data)){
            $scope.innovation = response.data;
            $scope.load =  true;
        }
    });
    };
    
    $scope.init();
    
    });