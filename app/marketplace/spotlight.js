"use strict";
app.controller("marketplaceSpotlightController", function($scope, $http, $window, $location, toaster, locationService, $uibModal) {
    $scope.header = "Marketplace Spotlight";
    $scope.load = false;
    $scope.is_active = false;
    $scope.queue = [];
    $scope.params = {};
    $scope.modalInstance = {};
    $scope.popover = {action: 'save()', text: 'Are you sure?'};
    $scope.cdn = "http://camtechmgh.org/cdn/marketplace/image/";    
    var data;
    
    $scope.init = function() {
        var spotlight = {};
        spotlight.service_name = 'GET_SPOTLIGHTED_MARKETPLACE_POSTS';
        spotlight.values = {};
        spotlight = locationService.fetch_data(spotlight);
        spotlight.then(function(result) {
           //console.log(result.data.success);           
           var temp = result.data.success;
           angular.forEach(temp, function(value, key){
              
              //value.marketplace_name =  "http://marketplace.makersinindia.in/" + value.marketplace_id;              
              //value.is_active = true;
              $scope.queue.push({position_no: key, is_active: true, marketplace_name: "http://marketplace.makersinindia.in/" + value.marketplace_id, marketplace_id: value.marketplace_id});
           });
           //console.log($scope.queue);
           $scope.load = true;
           
        });        
    };

    $scope.linkClick = function(item) {
        $window.open(item, '_blank');
    };
    $scope.change = function(item) {
        if (item.marketplace_name.indexOf('http://marketplace.makersinindia.in/') !== -1 && item.marketplace_name.length > 41 && ('http://marketplace.makersinindia.in/').lastIndexOf('/') === item.marketplace_name.lastIndexOf('/')) {
            item.is_active = true;
            item.id = item.url.substring(item.marketplace_name.lastIndexOf('/') + 1);
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
        var param = {list: []};
        $scope.params.values = {};
        angular.forEach($scope.queue, function(item, index) {
            var marketplace_array = item.marketplace_name.split("/");
            item.marketplace_id = marketplace_array[marketplace_array.length - 1];    

            param.list.push({marketplace_id: item.marketplace_id, position_no: (item.position_no).toString()});            
        });
        
        $scope.params.service_name = 'SAVE_MARKETPLACE_POSITION';
        $scope.params.values = param;
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result){
           console.log(result);
           if (angular.isUndefined(result.data.success)) {
                $scope.error = {show: true, text: result.data.error};
                angular.forEach(result.data.error, function(item, index) {
                    $scope.queue[item].is_active = false;
                });
                $scope.modalInstance.dismiss();
                toaster.pop('error', "Error", "Marketplace could not be updated successfully. Link broken or post is not a Marketplace post.");
            }
            else {
                $scope.success = {show: true, text: result.data.success};
                //$rootScope.page_error = {show: true, text: result.data.success};
                $scope.modalInstance.dismiss();
                toaster.pop('success', "Success", $scope.success.text);
                $location.path('/marketplace');
            }
            $scope.is_active = false;
        });
        /*
        var url = locationService.url('innovation');
        data = {values: json};
        $http.post(url, data).then(function(response) {
            data = angular.fromJson(response.data);
            if (!angular.isUndefined(data.success) && data.success === '1'){
                $scope.modalInstance.dismiss();
                toaster.pop('success', "Success", "Marketplace Spotlight Updated successfully");
            }
            else {
                angular.forEach(data.error, function(item, index) {
                    $scope.queue[item].is_active = false;
                });
                $scope.modalInstance.dismiss();
                toaster.pop('error', "Error", "Marketplace Spotlight could not be updated successfully. Please check the link of hghlighted marketplace post.");
            }
            $scope.is_active = false;
        }, function(response) {
            $scope.modalInstance.dismiss();
            toaster.pop('error', "Error", "Something went wrong, please try again after some time");
            $scope.is_active = false;
        });*/
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