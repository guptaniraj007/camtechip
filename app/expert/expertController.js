"use strict";
app.controller("expertController", function($scope, $http, $window, $location, toaster, locationService, $uibModal) {
    $scope.header = "Experts";
    $scope.load = false;
    $scope.is_active = false;
    $scope.queue = [];
    $scope.modalInstance = {};
    $scope.popover = {action: 'save()', text: 'Are you sure?'};
    $scope.cdn = "http://camtechmgh.org/cdn/profile/";
    var data;
    $scope.init = function() {
        $scope.load = false;
        $scope.queue = [];
        var url = locationService.url('expert?all=all');
        data = {all: 'all'};
        $http.post(url, data).then(function(response) {
            data = response.data;
            if (data == 403) {
                $location.path('/login');
            }
            else {
                data = data.shortlisted_users;
                angular.forEach(data, function(item, index) {
                    $scope.queue.push({position_no: index, is_active: true, name: '', url: 'http://camtechmgh.org/expert/summary/' + item.user_id, id: item.user_id});
                });
                $scope.load = true;
            }
        }, function(response) {
            toaster.pop('error', "Error", "Something went wrong, please try again after some time");
            $scope.load = true;
        });
    };

    $scope.linkClick = function(item) {
        $window.open(item, '_blank');
    };

    $scope.change = function(item) {
        if (item.url.indexOf('http://camtechmgh.org/expert/summary/') !== -1 && item.url.length > 37 && ('http://camtechmgh.org/expert/summary/').lastIndexOf('/') === item.url.lastIndexOf('/')) {
            item.is_active = true;
            item.id = item.url.substring(item.url.lastIndexOf('/') + 1);
        }
        else {
            item.is_active = false;
        }
    };

    $scope.click = function(){
        $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'myModalContent.html',
                scope:$scope
            });
    };

    $scope.save = function(item) {
        if(item){
        $scope.is_active = true;
        var json = '{';
        angular.forEach($scope.queue, function(item, index) {
            json = json + '"' + item.position_no + '":"' + item.id + '"';
            if ($scope.queue.length - 1 != index)
                json = json + ',';
        });
        json = json + '}';
        var url = locationService.url('expert');
        data = {values: json};
        $http.post(url, data).then(function(response) {
            data = angular.fromJson(response.data);
            if (!angular.isUndefined(data.success) && data.success === '1'){
                toaster.pop('success', "Success", "Experts Updated successfully");
                $scope.modalInstance.dismiss();
            }
            else {
                angular.forEach(data.error, function(item, index) {
                    $scope.queue[item].is_active = false;
                });
                $scope.modalInstance.dismiss();
                toaster.pop('error', "Error", "Experts could not be updated successfully. Link broken or user is not an Expert.");
            }
            $scope.is_active = false;
        }, function(response) {
            $scope.modalInstance.dismiss();
            toaster.pop('error', "Error", "Something went wrong, please try again after some time");
            $scope.is_active = false;
        });
    }
    else {
            $scope.modalInstance.dismiss();
        }
    };

    $scope.moveUp = function(item) {
        var temp = $scope.queue[item];
        $scope.queue[item - 1].position_no = $scope.queue[item - 1].position_no + 1;
        temp.position_no = temp.position_no - 1;
        $scope.queue.splice(item, 1);
        $scope.queue.splice(item - 1, 0, temp);
    };

    $scope.moveDown = function(item) {
        var temp = $scope.queue[item];
        $scope.queue[item + 1].position_no = $scope.queue[item + 1].position_no - 1;
        temp.position_no = temp.position_no + 1;
        $scope.queue.splice(item, 1);
        $scope.queue.splice(item + 1, 0, temp);
    };

    $scope.init();
});

app.controller('ModalInstanceCtrl', function($scope, $modalInstance, locationService, toaster) {
    $scope.item = items;
    $scope.params = {};
    $scope.action = function(item) {
        if (item) {
            $scope.params.service_name = 'PROMOTE_USER_TO_REVIEWER';
            $scope.params.values = {user_id: items.userId};
            var temp = locationService.fetch_data($scope.params);
            temp.then(function(result) {
                console.log(result);
                if (angular.isUndefined(result.data.success)) {
                    toaster.pop('error', "Error", angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
                }
                else {
                    $modalInstance.dismiss('cancel');
                    toaster.pop('success', "Success", result.data.success);
                    $location.path("/user/reviewer/" + items.userId);
                }
            });
        }
        else {
            $modalInstance.dismiss('cancel');
        }
    };
});