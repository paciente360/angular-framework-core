(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.directive('crudListTable', crudListTable);
    crudListTable.$inject = ['$q','Restangular', '$timeout', '$window', 'locale', '$state'];
    function crudListTable($q, Restangular, $timeout, $window, locale, $state) {
        return {
            templateUrl: 'lets/views/crud/crud-list-table.html',
            scope: {
                settings: '='
            },
            controller: function ($scope, $controller) {
                $controller('AutoCompleteController', {$scope:$scope});

                var headers = $scope.settings.headers;
                $scope.tab = $scope.settings.tab;
                $scope.filterdata = {};
                $scope.tableData = {total_count:0, total_entries:0, currentpage:1, data:[]};
                $scope.currentPage = 1;
                $scope.perPage = headers.perPage || 15;

                if( typeof(headers.get)!=="function" ){
                    headers.get = function(name){
                        for (var _x in headers.fields) {
                            var field = headers.fields[_x];
        
                            if (field.name == name) {
                                return field;
                            }
                        }
                    }
                }

                if( typeof(headers.getLabel)!=="function" ){
                    headers.getLabel = function(field, value){
                        var arrList = headers.get(field).customOptions.list;
                        var lbl=""; 
                        (arrList||[]).forEach(function(item){
                            if (item.id==value) lbl= item.label;
                        });
                        return lbl;
                    }
                }

                if ($scope.tab){
                    $scope.resource = Restangular.all($scope.settings.url);
                    if (!headers.settings){
                        headers.settings = {add:true, edit:true, delete:true}
                    }
                    $scope.sort = headers.sort;
                }else{
                    $scope.resource = Restangular.all(headers.route);
                    $scope.sort = headers.settings.sort;
                }

                $scope.getFilter = function(){
                    return decodeURIComponent($window.location.search).replace("?filter=","");
                }

                $scope.openBuscaAvancada = function(){
                    $scope.showBuscaAvancada = !$scope.showBuscaAvancada;
                    if (!$scope.showBuscaAvancada ){
                        $scope.refreshTable(true);
                    }
                }

                $scope.parseRecord = function(record, field){
                    if (field.type == 'boolean') {
                        if (record[field.name]){
                            return field.customOptions.statusTrueText;
                        }else{
                            return field.customOptions.statusFalseText;
                        }
                    }else if (field.type == 'custom') {
                        return ""; // Manter
                    }else if (field.type == 'date') {
                        if (record[field.name]){
                            if (field.customOptions.monthpicker !== undefined) {
                                return moment(record[field.name]).format('MM/YYYY');
                            }
                            else if (field.customOptions.timestamp) {
                                return moment(record[field.name]).format('L LTS');
                            }
                            else if (field.customOptions.format) {
                                return moment(record[field.name]).format(field.customOptions.format);
                            }
                            else {
                                return moment(record[field.name].replace('Z','')).format('L');
                            }
                        }
                    }else if (field.autocomplete == true) {
                        if (record[field.name]){
                            if (field.customOptions && field.customOptions.list!=undefined) {
                                for (var idx = 0; idx < field.customOptions.list.length; idx++) {
                                    const item = field.customOptions.list[idx];
                                    if (item.id==record[field.name]){
                                    return item.label;
                                    }
                                }
                            }else{
                                return record[field.name+'.label'];
                            }
                        }
                    }else if (field.type == 'float' && field.customOptions && field.customOptions.currency) {
                        if (record[field.name]!==null && record[field.name]!==undefined){
                            var rawData = parseFloat(record[field.name]);                                
                            var rawData = rawData.toFixed(2).split('.');
                            rawData[0] = "R$ " + rawData[0].split(/(?=(?:...)*$)/).join('.');
                            return rawData.join(',');
                        }
                    }else{
                        if (record[field.name]!==null && record[field.name]!==undefined){
                            return record[field.name];
                        }
                    }
                }

                $scope.getDateFormated = function(dt){
                    return moment(dt).format('L');
                }

                $scope.refreshTable = function(updateLocation){

                    $scope.tableData.data = undefined;

                    var route = (!headers.pagerGeneral ? 'pager' : 'pagerGeneral');
                    var queries = {page:$scope.currentPage, per_page:$scope.perPage};

                    if (headers.route_pager){
                        route = headers.route_pager;
                    }

                    if ($scope.tab){
                        queries.scope = headers.filterScope;
                    }else if (headers.settings && headers.settings.filterScope){
                        queries.scope = headers.settings.filterScope;
                    }

                    var str = [];

                    if ($scope.showBuscaAvancada){
                        $scope.filterdata.q = null;

                        for (var idx = 0; idx < $scope._fields.length; idx++) {
                            const field = $scope._fields[idx];

                            if ($scope.filterdata[field.name]){

                                queries["filter["+field.name+"]"] = $scope.filterdata[field.name];

                                if(field.customOptions && field.customOptions.telefone){
                                   queries["filter["+field.name+"]"] = $scope.filterdata[field.name].replace(/\D/g, '')
                                }

                                if(field.type=="date"){
                                   queries["filter["+field.name+"]"] = $scope.getDateFormated($scope.filterdata[field.name])
                                }

                                if(field.autocomplete){
                                    queries["filter["+field.name+"_label]"] = $scope.filterdata[field.name+".label"].label;
                                    str.push(field.name+"_label="+queries["filter["+field.name+"_label]"]);
                                }

                                str.push(field.name+"="+queries["filter["+field.name+"]"]);

                            }

                        }

                    }else if ($scope.filterdata.q){
                        queries.q = $scope.filterdata.q;
                        str.push("q="+queries.q);
                    }

                    if ($scope.currentPage!=1){
                        str.push("pg="+$scope.currentPage);
                    }

                    if ($scope.sort){
                        str.push("or="+$scope.sort.sortKey);
                        queries.sort_by = $scope.sort.sortKey;

                        if($scope.sort.sortKey){
                            var fld = headers.get($scope.sort.sortKey);
                            if (fld && fld.autocomplete && !fld.customOptions.list){
                                queries.sort_by +=".label";
                            }
                        }

                        str.push("by="+$scope.sort.order);
                        queries.order = $scope.sort.order;
                    }
                    
                    if(headers.updateLocation===false){
                        updateLocation = false;
                    }

                    if (updateLocation && !$scope.tab){
                        $state.transitionTo($state.$current.name, {filter: str.join("&")}, {
                            location: true,
                            inherit: true,
                            relative: $state.$current,
                            notify: false
                        });
                    }

                    if(typeof $scope.searchRecords !== "function"){
                        $scope.searching = true;
                        $scope.resource.customGET(route, queries).then(function(response) {
                            $timeout(function(){
                                $scope.searching = false;
                                $scope.tableData = response;
                                $scope.tableData.currentPage = $scope.currentPage;
                                $scope.$emit('refreshTable');
                            })
                        },function() {
                            $scope.tableData = {};
                        });
                    }else{
                        $scope.searchRecords(queries, route);
                    }

                }

                $scope.edit = function (row) {
                    if( $scope.tab ){
                        var _scope = $scope.settings.getscope();
                        _scope.newDetail(headers, null, row.id, $scope.settings.url);
                    }else{
                        $state.go($state.current.name.replace(/\.list$/, '.edit'), { id: row.id, page: null, filter:$scope.getFilter()});
                    }
                };

                $scope.delete = function (row) {
                    $window.customConfirm(
                        locale.translate('letsfw.message_delete'),
                        locale.translate('letsfw.ok'),
                        locale.translate('letsfw.cancelar'),
                        function(_confirm){
                            if(_confirm){
                                if($scope.tab){
                                    var _scope = $scope.settings.getscope();
                                    _scope.deleteDetail($scope.settings.url, row);
        
                                }else{
                                    $scope.resource.customDELETE(row.id).then(function () {
                                        $scope.refreshTable();
                                    });
                                }
                            }
                        }
                    );
                };

                $scope.newDetail = function(){
                    var _scope = $scope.settings.getscope();
                    _scope.newDetail(headers);
                }

                $scope.filterTable = function($this){

                    if (!$this.filterForm.$valid) {
                        return false;
                    }

                    $scope.currentPage = 1;
                    $scope.refreshTable(true);
                }

                $scope.startTable = function(){

                    if ($scope.tab){
                        $scope.settings.getscope().$emit('create:'+$scope.settings.tab_name, $scope)
                        $scope.refreshTable();
                        return;
                    }
                    
                    if($state.params.filter){

                        var params = {};
                        $state.params.filter.split('&').forEach(function(par){
                            var a = par.split("=");
                            params[a[0]] = a[1];
                        });

                        if(params.pg){
                            $scope.currentPage = params.pg;
                        }

                        if(params.or || params.by ){
                            $scope.sort = { sortKey:params.or, order:params.by}
                        }

                        if(params.q){
                            $scope.filterdata["q"] = params["q"];
                        }else{
                            for (var idx = 0; idx < $scope._fields.length; idx++) {
                                const field = $scope._fields[idx];

                                if (params[field.name]){
                                    if(field.type=="date"){
                                        $scope.filterdata[field.name] = moment(params[field.name],"L");

                                    }else if(field.autocomplete){
                                        $scope.filterdata[field.name] = params[field.name];
                                        $scope.filterdata[field.name+".label"] = {
                                            id:params[field.name],
                                            label:params[field.name+"_label"]
                                        };

                                    }else{
                                        $scope.filterdata[field.name] = params[field.name];
                                    }
                                }
                            }

                            if(Object.keys($scope.filterdata).length>0){
                                $scope.showBuscaAvancada = true;
                            }
                        }

                    }
                   
                    $scope.$emit('create:grid', $scope);
                    if (!headers.isReport){
                        $scope.refreshTable();
                    }
                    

                }

                $scope.gopage = function(page){
                    $scope.currentPage = page;
                    $scope.refreshTable(true);
                }

                $scope.order = function(field){

                    if (!$scope.sort || ($scope.sort && $scope.sort.sortKey!=field) ){
                        $scope.sort = {sortKey:field, order:"asc"}

                    }else if ($scope.sort.order=="asc"){
                        $scope.sort = {sortKey:field, order:"desc"}

                    }else if ($scope.sort.order=="desc"){
                        $scope.sort = undefined;
                    }



                    $scope.refreshTable(true);
                }

                $scope.getscope = function(){
                    return $scope;
                }

                $scope.$on('refreshGRID', function (event) {
                    $scope.refreshTable();
                });

            },
            link: function (scope, $el) {
                scope.headers = scope.settings.headers;
                scope._fields = angular.copy(scope.headers.fields);
                scope.fieldsFilter = [];

                // Ajustas os campos para o filtro
                for (var idx = 0; idx < scope._fields.length; idx++) {
                    const field = scope._fields[idx];

                    if (!field.filter)continue;

                    field.disabled = false;
                    field.quickAdd = false;
                    field.notnull = field.filter.required ? true : false;
                    field.name = field.name;
                    field.placeholder = field.filter.placeholder ? field.filter.placeholder : "";

                    if (field.customOptions.file){
                        delete field.customOptions.file;
                    }

                    if (field.type=="text"){
                        field.type = "string";

                    }else if (field.type=="boolean"){
                        field.type = "number";
                        field.autocomplete = true;
                        field.customOptions = {
                            "list":[
                                {"id":"false",  "label":field.customOptions.statusFalseText},
                                {"id":"true",  "label":field.customOptions.statusTrueText}
                            ],
                            "select":true
                        };

                    }

                    scope.fieldsFilter.push(field);

                }
                if(scope.headers.search=="fixed"){
                    scope.showBuscaAvancada = true;
                    scope.hideInputSearch = true;
                }

                // Start Table
                scope.startTable();

            }
        }
    }

    module.directive('fwCustomField', fwCustomField);
    fwCustomField.$inject = [];
    function fwCustomField(){
        return {
            scope: {
                data: '=',
                idx:'=',
                field: '=',
                getscope:'='
            },
            link: function ($scope, $el) {
                if( $scope.field.toString && typeof($scope.field.toString)=="function" ){
                    $el.append($scope.field.toString($scope.data, $scope.getscope(), $scope.idx))
                }
            }
        }
    }

    module.directive('filterForm', filterForm);
    filterForm.$inject = [];
    function filterForm() {
        return {
            replace: false,
            link: function (scope, $el) {
                $($el).parsley({
                    priorityEnabled: false,
                    errorsContainer: function (el) {
                        return el.$element.closest(".input-container");
                    }
                });
            }
        }
    }


})();
