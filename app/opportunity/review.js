app.controller("reviewController", function ($scope, $http, $location, $filter, toaster, locationService, $routeParams) {
    "use strict";
    $scope.header = "Review";
    $scope.load =  false;
    $scope.params = {};
    $scope.queue = {};
    
    $scope.init = function(){
            $scope.params.service_name = 'GET_REVIEW_DETAILS';
        $scope.params.values = {review_id: $routeParams.reviewId};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
    return temp.then(function(response){
        console.log(response);
        if(!angular.isUndefined(response.data.success)){
            $scope.queue = response.data.success;
            $scope.load =  true;
        }
    });
    };
    
    $scope.init();
    
    });