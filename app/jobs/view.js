app.controller("jobViewController", function($scope, $http, $location, $filter, toaster, $window, locationService, $routeParams) {
    "use strict";
    $scope.header = "Job Board Details";
    $scope.load = true;
    $scope.params = {};
    $scope.details = {};
    $scope.job_id = $routeParams.jobId;

    $scope.cancel = function() {
        locationService.back();
    };

    $scope.init = function() {
        $scope.params.service_name = 'GET_JOB_POST_DETAILS';
        $scope.params.values = {job_post_id: $routeParams.jobId, user_id: '350'};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if (angular.isUndefined(result.data.success)) {
                toaster.pop('error', "Error", "Something went wrong while fetching data, please try after some time");
            }
            else {
                $scope.details = result.data.success;
                $scope.details.location = $scope.details.city_name + ", " + $scope.details.location_name;
            }
        });
    };

    $scope.init();
});
