app.controller("opportunityEditController", function($scope, $http, $location, $filter, toaster, locationService, $routeParams) {
    "use strict";
    $scope.header = $routeParams.opportunityId === '@' ? "Add opportunity" : "Edit opportunity";
    $scope.load = false;
    $scope.category_list = [];
    $scope.opportunity = {};
    $scope.time = {time: new Date(1970, 1, 1, 0, 0, 0), show: false};
    $scope.cdn = "http://camtechmgh.org/cdn/opportunity/image/";
    $scope.disbled = false;
	$scope.external_required = false;
	//$scope.external = true;
	//$scope.opportunity.is_external = false;
	
	$scope.stateChanged = function(){
		if ($scope.opportunity.external)
		{
			$scope.opportunity.external = false;
			$scope.opportunity.is_external = true;
		}
		else
		{
			$scope.opportunity.external = true;
			$scope.opportunity.is_external = false;
		}
	};

    $scope.init = function() {
        var params = {};
        params.service_name = 'GET_CATEGORY_LIST';
        params.values = '';
        var temp = locationService.fetch_data(params);
        temp.then(function(result) {
            $scope.category_list = result.data[1].category_list;
            if ($routeParams.opportunityId === '@') {
                $scope.time = {application_time: new Date(1970, 1, 1, 23, 59, 0), review_time: new Date(1970, 1, 1, 23, 59, 0), final_time: new Date(1970, 1, 1, 23, 59, 0), show: false};
                $scope.opportunity = {action: 'create', opportunity_id: '@', category_id: '', award_amount: '', headline: '',is_external: false, external_link: '', application_date: '', application_time: $scope.time, application_deadline: '', review_date: '', review_time: $scope.time, review_deadline: '', final_date: '', final_time: $scope.time, final_deadline: '', status: '', image_name: '', description: '', attachment_name_1: '', attachment_name_2: '', attachment_display_name_1: '', attachment_display_name_2: '', external: true};				
                $scope.load = true;
            }
            else {

                var url = locationService.url('opportunity?get_id=') + $routeParams.opportunityId;
                $http.get(url).then(function(response) {
                    console.log(response);
					//$scope.opportunity.is_external = $scope.checked;
                    $scope.opportunity = response.data.opportunity_detail[0];
					if ($scope.opportunity.is_external)
						$scope.opportunity.external = false;
					else
						$scope.opportunity.external = true;
                    console.log($scope.opportunity);
                    $scope.opportunity.application_date = new Date($scope.opportunity.application_deadline);
                    $scope.time.application_time = new Date($scope.opportunity.application_deadline);
                    $scope.opportunity.review_date = new Date($scope.opportunity.review_deadline);
                    $scope.time.review_time = new Date($scope.opportunity.review_deadline);
                    $scope.opportunity.final_date = new Date($scope.opportunity.final_deadline);
                    $scope.time.final_time = new Date($scope.opportunity.final_deadline);
                    $scope.load = true;
                }, function(response) {
                });
            }
        });
    };

$scope.removeItem = function(item) {
        toaster.clear();
        var url = locationService.url('opportunity?set_id=') + item;
        $http.get(url).then(function(response) {
            if (!angular.isUndefined(response.data.success)) {
                toaster.pop('success', "Success", response.data.success);
		$location.path('/opportunity');
            }
            else {
                toaster.pop('error', "Error", response.data.error);
            }
        }, function(response) {
            toaster.pop('error', "Error", "Opportunity could not be deleted successfully, Please try again later");
        });
    };

    $scope.validate = function() {
        $scope.disbled = true;
        var status = true;
        var temp = $scope.opportunity;
        if (angular.isUndefined(temp.award_amount) || temp.award_amount == '' || angular.isUndefined(temp.headline) ||temp.headline == '' || angular.isUndefined(temp.category_id) || temp.category_id == '' || angular.isUndefined(temp.application_date) || temp.application_date == '' || angular.isUndefined(temp.final_date) || temp.final_date == '' || angular.isUndefined(temp.review_date) || temp.review_date == '' || angular.isUndefined(temp.description) || temp.description == '')
			status = false;
		else if (temp.is_external)
			if (angular.isUndefined(temp.external_link))
			{		
				status = false;			
				$scope.external_required = true;
			}			
        return status;
    };

    $scope.save = function(item) {
        if ($scope.validate()) {
        toaster.clear();
        var url = locationService.url('opportunity');
        if (item === 'open' || item === 'draft') {
            var temp = new Date($scope.opportunity.application_date);
            var month = (temp.getMonth() + 1) <= 9 ? ('0' + (temp.getMonth() + 1).toString()) : ((temp.getMonth() + 1).toString());
            var date = temp.getDate() <= 9 ? ('0' + temp.getDate().toString()) : (temp.getDate().toString());
            var time = $scope.time.application_time;
            $scope.opportunity.application_deadline = temp.getFullYear().toString() + '/' + month + '/' + date + ' ' + time.getHours().toString() + ':' + time.getMinutes().toString() + ':' + time.getSeconds().toString();
            temp = new Date($scope.opportunity.review_date);
            month = (temp.getMonth() + 1) <= 9 ? ('0' + (temp.getMonth() + 1).toString()) : ((temp.getMonth() + 1).toString());
            date = temp.getDate() <= 9 ? ('0' + temp.getDate().toString()) : (temp.getDate().toString());
            time = $scope.time.review_time;
            $scope.opportunity.review_deadline = temp.getFullYear().toString() + '/' + month + '/' + date + ' ' + time.getHours().toString() + ':' + time.getMinutes().toString() + ':' + time.getSeconds().toString();
            temp = new Date($scope.opportunity.final_date);
            month = (temp.getMonth() + 1) <= 9 ? ('0' + (temp.getMonth() + 1).toString()) : ((temp.getMonth() + 1).toString());
            date = temp.getDate() <= 9 ? ('0' + temp.getDate().toString()) : (temp.getDate().toString());
            time = $scope.time.final_time;
            $scope.opportunity.final_deadline = temp.getFullYear().toString() + '/' + month + '/' + date + ' ' + time.getHours().toString() + ':' + time.getMinutes().toString() + ':' + time.getSeconds().toString();			
            $scope.opportunity.status = item;
			if (!$scope.opportunity.is_external)
				$scope.opportunity.external_link = "";
            $scope.opportunity.action = $scope.opportunity.opportunity_id === '@' ? 'create' : 'update';
            var data = {
                values: angular.toJson($scope.opportunity)
            };
            console.log(data);
            $http.post(url, data).then(function(response) {
                console.log(response);
                $scope.disbled = false;
                if(angular.isUndefined(response.data.success)){
                    toaster.pop('error', "Error", (angular.isUndefined(response.data.error) ? "Something went wrong. Please try again later" : response.data.error));
                }else{
                    toaster.pop('success', "Success", response.data.success);
                }
            }, function(response) {
                $scope.disbled = false;
            toaster.pop('error', "Error", "Something went wrong. Please try again later.");
            });
        }
    }
        else {
            $scope.disbled = false;
            toaster.pop('error', "Error", "Please fill all required fields");
        }
    };

    $scope.uploadFile = function(item, service, index) {
        var file = item;
        var uploadUrl = locationService.url(service + '/opportunity/') + index;
        var fd = new FormData();

        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            headers: {'Content-Type': undefined}
        })
                .success(function(data) {
                    if (data === '.error') {
                        toaster.pop('error', "Error", "There was some problem while uploading the file, Please try again after some time");
                    }
                    else {
                        if (service === 'upload_image')
                            $scope.opportunity.image_name = data;
                        else if (service === 'upload_document') {
                            uploadUrl = data.substring(data.indexOf('_') + 1, data.lastIndexOf('_'));
                            if (uploadUrl === 'attach1') {
                                uploadUrl = 'attachment_name_1';
                            }
                            else if (uploadUrl === 'attach2') {
                                uploadUrl = 'attachment_name_2';
                            }
                            $scope.opportunity[uploadUrl] = data;
                            uploadUrl = data.substring(data.indexOf('_') + 1, data.lastIndexOf('_'));
                            if (uploadUrl === 'attach1') {
                                uploadUrl = 'attachment_display_name_1';
                            }
                            else if (uploadUrl === 'attach2') {
                                uploadUrl = 'attachment_display_name_2';
                            }
                            $scope.opportunity[uploadUrl] = file.name;
                            console.log($scope.opportunity);
                        }
                        toaster.pop('success', "Success", "File Uploaded successfully");
                    }
                })
                .error(function() {
                    toaster.pop('error', "Error", "There was some problem while uploading the file, Please try again after some time");
                });
    };

    $scope.browse = function(temp) {
        $(temp).click();
    };

    $scope.changeFile = function(index) {
        toaster.clear();
        var input = index;
        index = index.getAttribute("data-index");
        if (angular.isUndefined(index) || index === '@') {
            index = $routeParams.maxId;
        }
        console.log(index);
        if (input.files && input.files[0]) {
            index = index + '_' + input.getAttribute("id") + '_' + input.files[0].name.substring(input.files[0].name.lastIndexOf('.'));
            $scope.uploadFile(input.files[0], 'upload_document', index);
        }
    };

    $scope.change = function(index) {
        toaster.clear();
        var input = index;
        index = index.getAttribute("data-index");
        console.log(index);
        if (angular.isUndefined(index) || index === '@') {
            index = $routeParams.maxId;
        }
        console.log(index);
        var temp = '#user-av';
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var img = new Image;
            reader.onload = function(e) {
                var img = new Image;

                img.onload = function() {
                    if (img.width == 800 && img.height == 600) {
                        $(temp).attr('src', e.target.result);
                        $scope.uploadFile(input.files[0], 'upload_image', index);
                    }
                    else {
                        $scope.$apply(function() {
                            toaster.pop('error', "Error", "Please upload a picture with dimensions equal to 800px by 600px");
                        });
                    }
                };
                img.src = reader.result;
            };
            if ((input.files[0].size / 1048576) <= 2) {
                reader.readAsDataURL(input.files[0]);
            } else {
                toaster.pop('error', "Error", "Please upload a picture of size less than 2MB.");
            }


        }
    };
    $scope.init();

});