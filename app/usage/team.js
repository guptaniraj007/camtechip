"use strict";

app.controller("usageTeamController", function($scope, $http, $location, locationService, toaster, tableService, $q) {
    $scope.header = "Team Composition";
    $scope.load = false;
    $scope.params = {search_param: '', sort_param: 'user_name', sort_type: 'asc',row_index: 1, num_of_records: 20};
    $scope.headers = [];
    $scope.data = [];
    $scope.page_number = 1;
    $scope.total_count = 0;
    $scope.total_pages = 0;
    $scope.pages = [];
    $scope.records = [10, 20, 50];
    $scope.search_text = '';
    
    
    $scope.init = function() {
        console.log($scope.params);
        $scope.params.service_name = 'GET_TEAM_COMPOSITION';
        var temp = tableService.get_data($scope.params);
        temp.then(function(result) {
        if(result.data === "-1"){
            
        }
        else{
            console.log(result);
            $scope.total_count = result.data[0].total_count;
            $scope.total_pages = (parseInt($scope.total_count / $scope.params.num_of_records)) + 1;
            $scope.pages = tableService.page_array($scope.total_pages);
            $scope.headers = [
                {key:'innovation_id',value:'Innovation ID', type:'number', sort:false},
                {key:'innovation_name',value:'Innovation Name', type:'string', sort:true},
                {key:'user_id',value:'User ID', type:'number', sort:false},
                {key:'user_name',value:'Team Member', type:'string', sort:true},                
                {key:'joined_on',value:'Joined On', type:'date', sort:false},
                {key:'left_on',value:'Left On', type:'date', sort:false},
                {key:'is_current',value:'Is current?', type:'string', sort:false}                
            ];
            $scope.data = result.data[1].all_team_composition;
        }
    });
    $scope.load = true;
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
    /*
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
    };*/
    
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


