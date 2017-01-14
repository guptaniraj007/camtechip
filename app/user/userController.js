"use strict";
app.controller("userController", function($scope, $http, $location, locationService, toaster, tableService, $q, $interpolate, $sce) {
    $scope.header = "Users";
    $scope.load = false;
    $scope.params = {search_param: '', filter_param: [], sort_param: 'user_id', sort_type: 'asc',row_index: 1, num_of_records: 20};
    $scope.headers = [];
    $scope.data = [];
    $scope.page_number = 1;
    $scope.total_count = 0;
    $scope.total_pages = 0;
    $scope.pages = [];
    $scope.records = [10, 20, 50];
    $scope.search_text = '';
    $scope.csv = '';
    $scope.filter = {all: true, cve: false, trc: false, innovator: false, expert: false};
    
    $scope.init = function() {
        console.log($scope.params);
        $scope.params.service_name = 'GET_REGISTERED_USERS';
        var temp = tableService.get_data($scope.params);
        temp.then(function(result) {
        if(result.data == 403){
                    $location.path('/login');
                }
        else if(result.data === "-1"){
            
        }
        else{
            $scope.total_count = result.data[0].total_count;
            $scope.total_pages = (parseInt($scope.total_count / $scope.params.num_of_records)) + 1;
            $scope.pages = tableService.page_array($scope.total_pages);
            $scope.headers = [{key:'user_id',value:'User ID', type:'number', sort:true},{key:'name',value:'Name', type:'string', sort:true},
                {key:'email',value:'Email', type:'string', sort:true},{key:'registered_on',value:'Registered On', type:'date', sort:true},
                {key:'is_expert',value:'Status', type:'boolean', sort:false},{key:'is_camtech_verified',value:'CVE', type:'boolean', sort:false},
                {key:'is_reviewer',value:'TRC', type:'boolean', sort:false},{key:'is_verified',value:'Verified', type:'boolean', sort:false}];
            $scope.data = result.data[1].registered_user;
            $scope.csv = tableService.convert_to_csv($scope.data,'Users', true);
            angular.forEach($scope.data, function(item, index) {
                    $scope.data[index].name = $sce.trustAsHtml('<a class="cursor" href="user/'+item.user_id+'">'+item.name+'</a>');
                    $scope.data[index].email = $sce.trustAsHtml('<a class="cursor" href="mailto:'+item.email+'?subject=Subject&body=message%20goes%20here">'+item.email+'</a>');
                });
            $scope.load = true;
        }
    });
    
    };
    
    
    $scope.next = function(){
        if($scope.page_number !== $scope.total_pages){
            $scope.page_number = $scope.page_number + 1;
            $scope.params.row_index = (($scope.page_number - 1) * $scope.params.num_of_records) + 1;
            $scope.init();
        }
    };
    
    $scope.previous = function(){
        if($scope.page_number !== 1){
            $scope.page_number = $scope.page_number - 1;
            $scope.params.row_index = (($scope.page_number - 1) * $scope.params.num_of_records) + 1;
            $scope.init();
        }
    };
    
    $scope.last = function(){
        if($scope.page_number !== $scope.total_pages){
            $scope.page_number = $scope.total_pages;
            $scope.params.row_index = (($scope.page_number - 1) * $scope.params.num_of_records) + 1;
            $scope.init();
        }
    };
    
    $scope.first = function(){
        if($scope.page_number !== 1){
            $scope.page_number = 1;
            $scope.params.row_index = 1;
            $scope.init();
        }
    };
    
    $scope.seek = function(){
        $scope.params.row_index = (($scope.page_number - 1) * $scope.params.num_of_records) + 1;
        $scope.init();
    };
    
    $scope.pageSizeChanged = function(){
        if(((($scope.page_number - 1) * $scope.params.num_of_records) + 1) > $scope.total_count)
            $scope.page_number = (parseInt($scope.total_count / $scope.params.num_of_records)) + 1;
        $scope.params.row_index = (($scope.page_number - 1) * $scope.params.num_of_records) + 1;
        $scope.init();
    };
    
    $scope.allClick = function(){
        $scope.filter = {all: true, cve: false, trc: false, innovator: false, expert: false};
        $scope.init();
    };
    
    $scope.search = function(){
        $scope.params.search_param = $scope.search_text;
        $scope.init();
    };
    
    $scope.filterClick = function(){
        $scope.params.filter_param = [];
        for (var property in $scope.filter) {
          if ($scope.filter.hasOwnProperty(property)) {
              if($scope.filter[property]){
                  if(property !== 'all')
                      $scope.params.filter_param.push(property);
              }
          }
      }  
      $scope.init();
    };
    
    $scope.sort = function(item,sort){
        if(sort){
        if($scope.params.sort_param === item){
            if($scope.params.sort_type === 'asc')
                $scope.params.sort_type = 'desc';
            else
                $scope.params.sort_type = 'asc';
        }
        else{
            $scope.params.sort_param = item;
            $scope.params.sort_type = 'asc';
        }
        $scope.init();
    }
    };
    
    $scope.init();
});