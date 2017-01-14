app.controller("userEditController", function($scope, $http, $location, $filter, toaster, $window, locationService, $routeParams) {
    "use strict";
    $scope.header = "Edit user";
    $scope.load = true;
    $scope.params = {};
    $scope.details = {};
    console.log($routeParams.userId);

    $scope.cancel = function() {
        locationService.back();
    };

    $scope.init = function() {
        $scope.params.service_name = 'GET_USER_DETAILS';
        $scope.params.values = {user_id: $routeParams.userId};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if (angular.isUndefined(result.data.success)) {
                toaster.pop('error', "Error", "Something went wrong while fetching data, please try after some time");
            }
            else {
                $scope.details = result.data.success;
                $scope.details.full_name = $scope.details.first_name + " " + $scope.details.last_name;
                $scope.details.last_login_date = $filter('date')(new Date($scope.details.last_login_date), 'dd-MMMM-yyyy');
                ;
                $scope.details.innovation_count = 'Draft : ' + (angular.isUndefined($scope.details.innovation_count.draft)? '0': $scope.details.innovation_count.draft) + ', Pubilshed : ' + (angular.isUndefined($scope.details.innovation_count.published)? '0': $scope.details.innovation_count.published);
            }
        });
    };

    $scope.save = function() {
        $scope.params.service_name = 'UPDATE_USER_STATUS';
        $scope.params.values = {user_id: $routeParams.userId, page_number: '1', is_camtech_verified: $scope.details.is_camtech_verified};
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if (angular.isUndefined(result.data.success)) {
                toaster.pop('error', "Error", "Something went wrong while saving data, please try after some time");
            }
            else {
                toaster.pop('success', "Success", result.data.success);
            }
        });
    };

    $scope.cancel = function() {

    };

    $scope.saveContinue = function() {
        $scope.params.service_name = 'UPDATE_USER_STATUS';
        $scope.params.values = {user_id: $routeParams.userId, page_number: '1', is_camtech_verified: $scope.details.is_camtech_verified};
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if (angular.isUndefined(result.data.success)) {
                toaster.pop('error', "Error", "Something went wrong while saving data, please try after some time");
            }
            else{
                
        $scope.params.service_name = 'PROMOTE_USER_TO_REVIEWER';
            $scope.params.values = {user_id: $routeParams.userId};
            var temp = locationService.fetch_data($scope.params);
            temp.then(function(result) {
                console.log(result);
                if (angular.isUndefined(result.data.success) && !angular.isUndefined($scope.details.reviewer_details.is_reviewer) && !$scope.details.reviewer_details.is_reviewer) {
                    toaster.pop('error', "Error", angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
                }
                else {
                    toaster.pop('success', "Success", angular.isUndefined(result.data.success)?'Saved Successfully':result.data.success);
                    $location.path("/user/reviewer/" + $routeParams.userId);
                }
            });
            }
        });
        
        
    };

    $scope.init();
});
