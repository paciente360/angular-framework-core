(function () {
    'use strict';

    angular.module('letsAngular').directive('crudFilter', crudFilter);

    crudFilter.$inject = ['$q','Restangular', '$timeout', '$rootScope'];

    function crudFilter($q, Restangular, $timeout, $rootScope) {
        return {
            templateUrl: 'lets/views/crud/crud-filter.html',
            replace: true,
            scope: {
                fields: '&',
                route: '&'
            },
            controller: function ($scope) {
                
            },
            link: function (scope, $el) {

                scope.data = {};

                var fields = angular.copy(scope.fields());

                scope.fieldsFilter = [];
                fields.forEach(function(field, idx){
                    if (!field.filter)return;

                    field.disabled = false;
                    field.notnull = false;
                    field.name = field.name;

                    if (field.customOptions.file){
                        delete field.customOptions.file;
                    }

                    if (field.type=="text"){
                        field.type = "string";
                    }
                    else if (field.type=="boolean"){
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
                    else if (field.type=="date"){
                        
                        if (typeof(field.filter)=="object" && field.filter.range===true){
                            
                            var _ini = angular.copy(field);
                            _ini.name +="_ini";
                            _ini.label +=" (início)";
                            scope.fieldsFilter.push(_ini);

                            var _fim = angular.copy(field);
                            _fim.name +="_fim";
                            _fim.label +=" (Fim)";
                            scope.fieldsFilter.push(_fim);

                            return;
                        }

                    }

                    scope.fieldsFilter.push(field);
                });

                scope.autocomplete = function (field, val) {
                    scope.resource = Restangular.all(scope.route());

                    var queries = [];
        
                    var deferred = $q.defer();
        
                    if (field.autocomplete_dependencies.length > 0) {
                        var deps = field.autocomplete_dependencies;
                        for (var x in deps) {
                            var dep = deps[x];
                            if (scope.data[dep.field] == undefined || scope.data[dep.field] == null) {
        
                                var text = 'Selecione antes o(a) ' + dep.label;
        
                                var data = [];
                                data.push({ id: null, label: text });
        
                                deferred.resolve(data);
        
                                return deferred.promise;
                            } else {
                                queries[dep.field] = scope.data[dep.field];
                            }
                        }
                    }
        
                    val = val.trim();
                    if (val.length == 0 || field.customOptions.select == true) {
                        val = '[blank]';
                    }
        
                    if (field.customOptions.general !== undefined) {
                        
                        scope.resource.customGET('general/autocomplete/' + field.customOptions.general + '/' + val, queries).then(function (data) {
                            deferred.resolve(data);
                        }, function errorCallback() {
                            return deferred.reject();
                        });

                    } else if (field.customOptions.list == undefined) {
                        
                        var route = 'autocomplete/' + field.name+ '/' + val;
        
                        if (field.customOptions.select == true){
                            queries["limit"] = 0;
                        }else{
                            queries["limit"] = 20;
                        }
        
                        scope.resource.customGET(route, queries).then(function (data) {
                            if (field.customOptions.select == true) {
                                data.unshift({ id: null, label: '--- Selecione ---' });
                            }
                            deferred.resolve(data);
                        }, function errorCallback() {
                            return deferred.reject();
                        });

                    } else {
        
                        var options = angular.copy(field.customOptions.list) || [];
        
                        if (field.customOptions.select == true) {
                            options.unshift({ id: null, label: '--- Selecione ---' });
                        }
        
                        deferred.resolve(options);
                    }
                    return deferred.promise;
                }

                scope.autocompleteSelect = function ($item, $model, $label) {
            
                    var _data = this.data;
        
                    if (_data==undefined){
                        _data = {};
                    }
        
                    if ($item.id != null && typeof $item.id != 'integer' || (typeof $item.id == 'integer' && $item.id > 0)) {
                        _data[this.field.name] = $item.id;
                    }
                    else if ($item.id == null) {
                        _data[this.field.name] = _data[this.field.name + '.label'] = null;
                    }
                    else {
                        _data[this.field.name + '.label'] = null;
                        return false;
                    }
        
                    this.data = _data;
        
                    var field = this.field;
                    $timeout(function(){
                        jQuery('#'+field.name).trigger('keyup');
                    });
                }

                scope.filterData = function(){

                    scope.objFilter = undefined;

                    var filterData = {};
                    if (scope.showBuscaAvancada){
                        fields.forEach(function(field, idx){

                            if (typeof(field.filter)=="object" && field.filter.range===true){

                                var values = {};

                                if (scope.data[field.name+"_ini"]){
                                    values.ini = scope.data[field.name+"_ini"];
                                }

                                if (scope.data[field.name+"_fim"]){
                                    values.fim = scope.data[field.name+"_fim"];
                                }

                                if (Object.keys(values).length>0){
                                    filterData[field.name] = values;
                                }
                                
                            }

                            if (scope.data[field.name]){
                                filterData[field.name] = scope.data[field.name];
                                if(field.autocomplete){
                                    filterData[field.name+"_label"] = scope.data[field.name+".label"].label;
                                }
                            }
                        });
                        scope.objFilter = {data:{filter:filterData}};
                    }else{
                        filterData.q = scope.data.q;
                        scope.objFilter = {data:filterData};
                    }

                    $rootScope.$broadcast('refreshGRID', false, true);
                }

                scope.openBuscaAvancada = function(){
                    scope.showBuscaAvancada = !scope.showBuscaAvancada;
                    scope.filterData();
                }

            }
        }
    }
})();