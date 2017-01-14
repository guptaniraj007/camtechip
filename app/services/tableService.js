'use strict';
app.factory('tableService', function ($resource, locationService, $http) {
    var tableFactory = {};
    
    var _get_data = function (item) {
        var url = locationService.url('get_table_data');
        var data = {
                    service_name: item.service_name,
                    values: angular.toJson(item)
                };
                console.log(data);
        var data = $http.post(url,data);
        return data;//returns response
        };
        
    var _get_headers = function (items) {
        var data = [];
        items = Object.keys(items);
        angular.forEach(items, function(item) {
            var header = "";
            var texts = item.split("_");
            angular.forEach(texts, function(text) {
                if(text === "id"){
                    header = header + text.toUpperCase();
                }
                else if(text === "of"){
                    header = header + text;
                }
                else{
                   header = header + text.charAt(0).toUpperCase() + text.substring(1) +  " ";
                }
            });
            data.push({key: item, value:header});
        });
        return data;
        };
    
    var _page_array = function(item){
        var array = [];
        var i;
        for(i = 1; i <= parseInt(item); i=i+1){
            array.push(i);
        }
        return array;
    };
    
    var _convert_to_csv = function(JSONData, ReportTitle, ShowLabel){
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
//    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var arrData = JSONData;
    var CSV = '';    
    var headers = JSONData[0];
//    headers = Object.keys(headers);
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in headers) {
            row += '"' + (angular.isUndefined(arrData[i][index])?'':arrData[i][index]) + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    return uri;
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
//    var link = $(document.createElement('a'));
//    link.href = uri;
//    
//    //set the visibility hidden so it will not effect on your web-layout
//    link.style = "visibility:hidden";
//    link.download = fileName + ".csv";
//    
//    //this part will append the anchor tag and remove it after automatic click
//    $(document.body.appendChild(link));
//    $(link.click());
//    $(document.body.removeChild(link));
};
    
    tableFactory.get_data = _get_data;
    tableFactory.get_headers = _get_headers;
    tableFactory.page_array = _page_array;
    tableFactory.convert_to_csv = _convert_to_csv;
    return tableFactory;
});