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
                $scope.data = {};
            },
            link: function (scope, $el) {

                var fields = angular.copy(scope.fields());

                scope.fieldsFilter = [];
                fields.forEach(function(field, idx){
                    // if (field.type=="custom" || field.name=="id" || field.type=="password")return;
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

                    if (field.type=="boolean"){
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
                    var filterData = {};
                    if (scope.showBuscaAvancada){
                        fields.forEach(function(field, idx){
                            if (scope.data[field.name]){
                                filterData[field.name] = scope.data[field.name];
                            }
                        });
                        $rootScope.$broadcast('refreshGRID', {data:{filter:filterData}} );
                    }else{
                        filterData.q = scope.data.q;
                        $rootScope.$broadcast('refreshGRID', {data:filterData} );
                    }
                }

                scope.openBuscaAvancada = function(){
                    scope.showBuscaAvancada = !scope.showBuscaAvancada;
                    scope.filterData();
                }

            }
        }
    }
})();