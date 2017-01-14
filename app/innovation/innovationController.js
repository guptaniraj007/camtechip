"use strict";
app.controller("innovationController", function($scope, $http, $window, $location, toaster, locationService, $uibModal) {
    $scope.header = "Innovations";
    $scope.load = false;
    $scope.is_active = false;
    $scope.queue = [];
    $scope.modalInstance = {};
    $scope.popover = {action: 'save()', text: 'Are you sure?'};
    $scope.cdn = "http://camtechmgh.org/cdn/innovation/";
    var data;
    $scope.init = function() {
        $scope.load = false;
        $scope.queue = [];
        var url = locationService.url('innovation?all=all');
        data = {all: 'all'};
        $http.post(url, data).then(function(response) {
            data = response.data;
            if (data == 403) {
                $location.path('/login');
            }
            else {
                data = data.spotlighted_innovations;
                angular.forEach(data, function(item, index) {
                    $scope.queue.push({position_no: index, is_active: true, name: '', url: 'http://camtechmgh.org/innovation/summary/' + item.innovation_id, id: item.innovation_id});
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
        if (item.url.indexOf('http://camtechmgh.org/innovation/summary/') !== -1 && item.url.length > 41 && ('http://camtechmgh.org/innovation/summary/').lastIndexOf('/') === item.url.lastIndexOf('/')) {
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
        var url = locationService.url('innovation');
        data = {values: json};
        $http.post(url, data).then(function(response) {
            data = angular.fromJson(response.data);
            if (!angular.isUndefined(data.success) && data.success === '1'){
                $scope.modalInstance.dismiss();
                toaster.pop('success', "Success", "Innovations Updated successfully");
            }
            else {
                angular.forEach(data.error, function(item, index) {
                    $scope.queue[item].is_active = false;
                });
                $scope.modalInstance.dismiss();
                toaster.pop('error', "Error", "Innovations could not be updated successfully. Please check the link of hghlighted innovation.");
            }
            $scope.is_active = false;
        }, function(response) {
            $scope.modalInstance.dismiss();
            toaster.pop('error', "Error", "Something went wrong, please try again after some time");
            $scope.is_active = false;
        });
    }
    else{
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