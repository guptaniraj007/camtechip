"use strict";
app.controller("sliderController", function($scope, $http, $location, $position, toaster, locationService) {
    $scope.header = "Sliders";
    $scope.load = false;
    $scope.is_active = false;
    $scope.show_add_button = true;
    $scope.popover = {action: 'removeItem(queue,$index)', text: 'Are you sure?'};
    $scope.queue = [{position_no: 0, image_name: '', tagline: '', title: '', is_active: false, left_button_text: '', url_text_left: '', right_button_text: '', url_text_right: '', is_right_button_visible: false, alert: false}];
    $scope.preview = {text: '', image_src: ''};
    $scope.cdn = "http://camtechmgh.org/cdn/templates/CIP/home/";
    var data;
    $scope.init = function() {
        var url = locationService.url('slider?all=all');
        data = {all: 'all'};
        $http.post(url, data).then(function(response) {
            data = response.data;
            if (data == 403) {
                $location.path('/login');
            }
            else {
                if (data !== '-1') {
                    $scope.queue = data.homepage_slider_info;
                    $scope.load = true;
                }
		else
			$scope.load = true;
            }
        }, function(response) {
            toaster.pop('error', "Error", "Something went wrong, please try again after some time");
            $scope.load = true;
        });
    };

    $scope.addSlide = function() {
        $scope.queue.push({
            position_no: $scope.queue.length,
            image_name: '',
            tagline: '',
            title: '',
            is_active: false,
            left_button_text: '',
            url_text_left: '', 
            right_button_text: '',
            url_text_right: '', 
            is_right_button_visible: false,
            alert: false
        });
    };

    $scope.active_click = function(item) {
        var active = findWithAttr($scope.queue, 'is_active', true);
        if (!active) {
            toaster.pop('warning', "Warning", "More than 5 sliders cannot be activated at a time");
            item.is_active = false;
        }
    };

    $scope.removeItem = function(item, index) {
        item = item.splice(index, 1);
    };
    $scope.hideError = function(item) {
        item.show = false;
    };
    $scope.save = function() {
        $scope.is_active = true;
        var json = '{"homepage_slider_info":';
        json = json + angular.toJson($scope.queue);
        json = json + '}';
        var url = locationService.url('slider');
        data = {homepage_slider_info: json};
                    console.log(data);
        $http.post(url, data).then(function(response) {
            data = response.data;
            if (data === '1')
                toaster.pop('success', "Success", "Sliders Updated successfully");
            else
                toaster.pop('error', "Error", "Sliders could not be updated successfully");
            $scope.is_active = false;
        }, function(response) {
            toaster.pop('error', "Error", "Something went wrong, please try again after some time");
            $scope.is_active = false;
        });
    };
    $scope.uploadFile = function(item, index) {
        var file = item;
        var uploadUrl = locationService.url('upload_image/home/') + index;
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            headers: {'Content-Type': undefined}
        })
                .success(function(data) {
                    $scope.queue[index].image_name = data;
                    $scope.queue[index].alert = true;
                })
                .error(function() {
                    $scope.queue[index].image_name = '.error';
                    $scope.queue[index].alert = true;
                });
    };
    $scope.browse = function(index) {
        $scope.queue[index].alert = false;
        var temp = '#imgInp' + index;
        $(temp).click();
    };
    $scope.change = function(index) {
        var input = index;
        index = index.getAttribute("data-index");
        var temp = index;

        temp = '#user-av' + index;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var img = new Image;
            reader.onload = function(e) {
                var img = new Image;

                img.onload = function() {
                    if (img.width === 1920 && img.height === 1080) {
                        $(temp).attr('src', e.target.result);
                        $scope.uploadFile(input.files[0], index);
                    }
                    else {
                        $scope.$apply(function() {
                            $scope.queue[index].image_name = '.size';
                            $scope.queue[index].alert = true;
                        });
                    }
                };
                img.src = reader.result;
            };
            if ((input.files[0].size / 1048576) <= 2) {
                reader.readAsDataURL(input.files[0]);
            } else {
                $scope.queue[index].image_name = '.size';
                $scope.queue[index].alert = true;
            }


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

    $scope.picturePreview = function(item) {
        $scope.preview = {text: 'Preview', item: item};
        $("#picturePreview").modal();

    };

    function findWithAttr(array, attr, value) {
        var count = 0;
        for (var i = 0; i < array.length; i += 1) {

            if (array[i][attr] === value) {
                count = count + 1;
            }
        }
        if (count > 5)
            return false;
        else
            return true;

    }
    $scope.init();
});