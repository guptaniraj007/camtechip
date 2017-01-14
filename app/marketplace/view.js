app.controller("marketplaceViewController", function($scope, $http, $location, $filter, toaster, $window, locationService, $routeParams) {
    "use strict";
    $scope.header = "Marketplace Details";
    $scope.load = true;
    $scope.params = {};
    $scope.details = {};
    $scope.marketplace_id = $routeParams.marketplaceId;

    $scope.cancel = function() {
        locationService.back();
    };
    
    

    $scope.init = function() {
        $scope.params.service_name = 'GET_MARKETPLACE_DETAILS';
        $scope.params.values = {marketplace_id: $routeParams.marketplaceId, user_id: '350'};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if (angular.isUndefined(result.data.success)) {
                toaster.pop('error', "Error", "Something went wrong while fetching data, please try after some time");
            }
            else {
                $scope.details = result.data.success;
                $scope.details.phone_number = $scope.details.phone_country_code_name + "-" + $scope.details.phone;
                $scope.details.updated_on = $filter('date')(new Date($scope.details.updated_on),'mediumDate');
            }
        });
    };

    $scope.init();
    
    $scope.check = function(){
        if($scope.details.status == "rejected")
            return true;
        else
            return false;
    };
    
});
