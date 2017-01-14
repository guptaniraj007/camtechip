app.controller("opportunityController", function($scope, $http, $location, $filter, toaster, locationService) {
    "use strict";
    $scope.header = "Opportunities";
    $scope.load = false;
    $scope.queue = [];
    $scope.time = {time: new Date(1970, 1, 1, 0, 0, 0), show: false};
    $scope.popover = {action: 'removeItem(queue,$index)', text: 'Are you sure?'};
    $scope.init = function() {
        var url = locationService.url('opportunity?all=all');
        $http.get(url)
                .success(function(data) {
                    console.log(data);
                    if (data == 403) {
                        $location.path('/login');
                    }
                    else {
                        if (data !== '-1') {
                            $scope.queue = data.opportunity_list;
                            angular.forEach($scope.queue, function(item, index) {
                                $scope.queue[index].deadline = new Date(item.deadline);
                            });
                            $scope.load = true;
                        }
			else
				$scope.load = true;
                    }
                });
    };

    $scope.removeItem = function(item, index) {
        toaster.clear();
        var url = locationService.url('opportunity?set_id=') + $scope.queue[index].opportunity_id;
        $http.get(url).then(function(response) {
            if (response.data == '1') {
                item = item.splice(index, 1);
                toaster.pop('success', "Success", "Opportunity deleted successfully");
            }
            else {
                toaster.pop('error', "Error", "Opportunity could not be deleted successfully, Please try again later");
            }
        }, function(response) {
            toaster.pop('error', "Error", "Opportunity could not be deleted successfully, Please try again later");
        });
    };

    $scope.editItem = function(item) {
        var index = maxId();
        $location.path('opportunity/edit/' + item + '/' + index);
    };
    
    $scope.assignReviewers = function(item) {
        $location.path('opportunity/assign/' + item);
    };
    
    $scope.assignWinners = function(item) {
        $location.path('opportunity/winners/' + item);
    };

    $scope.addItem = function() {
        var index = maxId();
        $location.path('opportunity/edit/@' + '/' + index);
    };

    var maxId = function() {
        var index = 0;
        if ($scope.queue.length !== 0) {
            var index = Math.max.apply(Math, $scope.queue.map(function(o) {
                return o.opportunity_id;
            }));
        }
        return index + 1;
    };

    $scope.moveUp = function(item) {
        toaster.clear();
        var temp = $scope.queue[item];
//        $scope.queue[item-1].position_no = $scope.queue[item-1].position_no + 1; 
//        temp.position_no  = temp.position_no - 1;
        var url = locationService.url('opportunity');
        var data = {
            opp_1: $scope.queue[item - 1].opportunity_id,
            pos_1: $scope.queue[item].position_no,
            opp_2: $scope.queue[item].opportunity_id,
            pos_2: $scope.queue[item - 1].position_no
        };
        console.log(data);
        $http.post(url, data).then(function(response) {
            console.log(response.data);
            $scope.init();
            toaster.pop('success', "Success", "Opportunity saved successfully");
        }, function(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });


    };

    $scope.moveDown = function(item) {
        toaster.clear();
        var temp = $scope.queue[item];
        var url = locationService.url('opportunity');
        var data = {
            opp_1: $scope.queue[item + 1].opportunity_id,
            pos_1: $scope.queue[item].position_no,
            opp_2: $scope.queue[item].opportunity_id,
            pos_2: $scope.queue[item + 1].position_no
        };

        $http.post(url, data).then(function(response) {
            console.log(response.data);
            $scope.init();
            toaster.pop('success', "Success", "Opportunity saved successfully");
        }, function(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    };


    $scope.init();
});
    