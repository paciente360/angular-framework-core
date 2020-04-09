(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDEditDetailController', function ($scope, Restangular, $http, $stateParams, $timeout, headers, $rootScope, $modalInstance, $q, ngToast, Upload) {

        $scope.data = {};
        $scope.headers = headers;
        $scope.resource = Restangular.all(headers.route);
        $scope.autocompleteModels = {};
        $scope.doafterAutoCompleteSelect = {};
        $scope.$http = $http;
       
        var parentScope = headers.parentScope;
        delete headers.parentScope;

        if(headers.modal_id){
            $rootScope.$emit('open:'+headers.modal_id+'', $scope); // @deprecated 

            if (parentScope){
                parentScope.$emit('open:'+headers.modal_id+'', $scope);
            }
        }

        $scope.datepickers = {};
        $scope.datepickerToggle = function (name) {
            if ($scope.datepickers[name] == undefined) {
                $scope.datepickers[name] = false;
            }
            $scope.datepickers[name] = !$scope.datepickers[name];
        }

        for (var y in $scope.headers.fields) {
            var field = $scope.headers.fields[y];
            if (field.type == 'boolean') {
                $scope.data[field.name] = false;
            }
        }

        if (headers.id) {
            $scope.resource.customGET(headers.id).then(function (data) {
                for (var y in $scope.headers.fields) {
                    var field = $scope.headers.fields[y];
                    if (field.type == 'date' && (data[field.name] != undefined && data[field.name] != null)) {
                        var dt = new Date(data[field.name]);
                        dt.setHours(dt.getHours() + (dt.getTimezoneOffset()/60) );
                        data[field.name] = dt;
                    }
                    
                    if (field.customOptions && field.customOptions.list!=undefined) {
                        field.customOptions.list.forEach(function(item){
                            if (item.id==data[field.name]){
                                data[field.name+'.label'] = item.label;
                            }
                        });
                    }

                    if (field.type == 'password'){
                        field.notnull = false;
                    }

                }
                $scope.data = data;
                
                $timeout(function(){
                    $scope.$broadcast('setProgressFile');
                });

                $scope.$emit('data-loaded-detail');
            });
        }else{
            $timeout(function(){
                $scope.$emit('data-new-detail'); 
            },50);

            for (var y in $scope.headers.fields) {
                var field = $scope.headers.fields[y];
                if (field.type == 'boolean') {
                    $scope.data[field.name] = field.customOptions.default ? field.customOptions.default : false;
                }
            }
        }

        $timeout(function () {
            
            $scope.submit = function () {

                var $_scope = this;
                var err = {};
                var _data = $_scope.data;

                _.each($_scope.headers.fields, function (field, key) {
                    if (field.type == 'password' && field.name.indexOf('confirm') != 0) {
                        if (_data['confirm_' + field.name] != _data[field.name]) {
                            err.password = 'Os campos "' + field.label + '" e "Confirmar ' + field.label + '" não são iguais';
                        }
                    }
                });

                if (Object.keys(err).length > 0) {
                    var _messages = new Array();
                    _.each(err, function (value, key) {
                        _messages.push(value);
                    });
                    ngToast.warning(_messages.join("<br />"));
                }
                else if (this.crudForm.$valid) {

                    function nextBefore(){
                        if (!$scope.data.id) {
                            var response = $scope.resource.customPOST($scope.data, $stateParams.id);
                            var typeSave = "new";
                        } else {
                            var response = $scope.resource.customPUT($scope.data, $scope.data.id);
                            var typeSave = "edit";
                        }

                        response.then(function (resp) {

                            function nextAfter(){
                                $rootScope.$broadcast('refreshGRID');
                                $modalInstance.dismiss('success');
                            }

                            $scope.$emit('after save', nextAfter, resp, typeSave);
                            if (!$scope.$$listeners["after save"]){
                                nextAfter();
                            }

                        }, function errorCallback(error) {
                            var messages = [];
                        
                            function findLabel(name) {
                                for (var _x in $_scope.headers.fields) {
                                    var field = $_scope.headers.fields[_x];
    
                                    if (field.name == name) {
                                        return field.label;
                                    }
                                }
                            }
    
                            if (error.status == 422) { //hook for loopback
                                if (error.data.error.code == 'CANT_SAVE_MODEL') {
                                    messages.push(error.data.error.message);
                                
                                } else if(error.data.error.details) {
                                    var codes = error.data.error.details.codes;
    
                                    var friendlyErrors = {
                                        presence: 'O campo %s é obrigatório',
                                        absence: 'O campo %s deve ser nulo',
                                        'unknown-property': 'O campo %s não foi definido',
                                        length: {
                                            min: 'O campo %s é muito curto',
                                            max: 'O campo %s é muito longo',
                                            is: 'O campo %s está com tamanho inválido',
                                        },
                                        common: {
                                            blank: 'O campo %s está em branco',
                                            'null': 'O campo %s está nulo',
                                        },
                                        numericality: {
                                            'int': 'O campo %s não é um número inteiro',
                                            'number': 'O campo %s não é um número',
                                        },
                                        inclusion: 'O campo %s não foi incluído na lista',
                                        exclusion: 'O campo %s não pode ser excluído',
                                        uniqueness: 'O campo %s está repetido com o de outro registro',
                                        'custom.email':'Este email não é válido'
                                    }
    
                                    // debugger;
                                    _.each(codes, function (code, key) {
                                        var _name = findLabel(key);
    
                                        if(typeof code === 'string'){
                                            code = [code];
                                        }
                                        
                                        _.each(code, function (type_err, key) {
                                            var _message = friendlyErrors[type_err].replace('%s', _name);                                
                                            messages.push(_message);
                                        })
    
                                    })
                                
                                }else{
                                    messages.push(error.data.error.message);
                                }
    
                            }
                            
                            ngToast.warning(messages.join("<br />"));
    
                            $scope.$emit('error save', error);
    
                        });
                    }

                    $scope.$emit('before save', nextBefore);
                    if (!$scope.$$listeners["before save"]){
                        nextBefore();
                    }
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('success');
            };

            $scope._upload = function (field, file) {
                var _url = $rootScope.appSettings.API_URL;

                if(field.customOptions.file.url != undefined && field.customOptions.file.container == undefined){
                    _url += field.customOptions.file.url;
                }else 
                    if (field.customOptions.file.url == undefined && field.customOptions.file.container != undefined) {
                    _url += 'upload/' + field.customOptions.file.container + '/upload'
                }else 
                    if (field.customOptions.file.url != undefined && field.customOptions.file.container != undefined) {
                    _url += 'upload/' + field.customOptions.file.container + '/' + field.customOptions.file.url
                }

                return Upload.upload({
                    url: _url,
                    data: { file: file }
                });
            }

            $scope.download = function (field, id) {

                if (field.customOptions.file.container != undefined) {
                    var url = $rootScope.appSettings.API_URL + 'upload/' + field.customOptions.file.container + '/download/' + $scope.data[field.name];
                } else {
                    var url = ($rootScope.appSettings.API_URL + $scope.module + '/download/' + field.name + '/' + id);
                }

                $scope._download(url, field, $scope.data);
            }

            $scope.downloadDetail = function (detail, field, id, data) {
                if (field.customOptions.file.container != undefined) {
                    var url = $rootScope.appSettings.API_URL + 'upload/' + field.customOptions.file.container + '/download/' + data[field.name];
                } else {
                    var url = $rootScope.appSettings.API_URL + $scope.module + '/details/' + detail + '/download/' + field.name + '/' + id;
                }

                $scope._download(url, field, data);
            }

            $scope._download = function (url, field, scopeData) {
                this.$http({
                    method: 'GET',
                    url: url,
                    responseType: 'arraybuffer'
                }).success(function (data, status, headers) {
                    headers = headers();
                    if (field.customOptions.file.container != undefined) {
                        var filename = scopeData[field.name];
                    } else {
                        var filename = headers['content-disposition'].split(';')[1].split('=')[1].split('"')[1];
                    }

                    var contentType = headers['content-type'];

                    var blob = new Blob([data], { type: contentType });

                    $scope.downloadFile(blob, filename);
                });
            }

            $scope.downloadFile = function (blob, filename) {
                var linkElement = document.createElement('a');
                try {

                    var url = window.URL.createObjectURL(blob);

                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);

                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                } catch (ex) {
                    // console.log(ex);
                }
            }

            $scope._autocomplete = function (field, val, detail) {
                var queries = [];

                var deferred = $q.defer();

                if (field.autocomplete_dependencies.length > 0) {
                    var deps = field.autocomplete_dependencies;
                    for (var x in deps) {
                        var dep = deps[x];

                        if ($scope.data[dep.field] == undefined || $scope.data[dep.field] == null) {

                            var text = 'Selecione o ' + dep.label;

                            var data = [];
                            data.push({ id: null, label: text });

                            deferred.resolve(data);

                            return deferred.promise;
                        } else {

                            if ($scope.data[dep.field].id) {
                                queries[dep.field] = $scope.data[dep.field].id;
                            } else {
                                queries[dep.field] = $scope.data[dep.field];
                            }

                        }
                    }
                }

                val = val.trim();
                if (val.length == 0 || field.customOptions.select == true) {
                    val = '[blank]';
                }

                if (field.customOptions.list == undefined) {

                    var route = 'autocomplete/' + field.name + '/' + val;

                    if (field.customOptions.select == true){
                        queries["limit"] = 0;
                    }else{
                        queries["limit"] = 20;
                    }

                    $scope.resource.customGET(route, queries).then(function (data) {

                        if (field.customOptions.select == true) {
                            data.unshift({ id: null, label: '--- Selecione ---' });
                        }

                        if (field.quickAdd === true && val != '[blank]') {
                            data.push({ id: null, label: 'Adicionar novo: ' + val });
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

            $scope._autocompleteSelect = function ($item, $model, $label, detail) {
                if ($item.id != null && typeof $item.id != 'integer' || (typeof $item.id == 'integer' && $item.id > 0)) {
                    this.data[this.field.name] = $item.id;
                }
                else if ($item.id == null) {
                    this.data[this.field.name] = this.data[this.field.name + '.label'] = null;
                }
                else {
                    this.data[this.field.name + '.label'] = null;
                    return false;
                }

                if (typeof $scope.doafterAutoCompleteSelect[this.field.name] == "function") {
                    $scope.doafterAutoCompleteSelect[this.field.name].call(this, this.data, $item, $model, $label);
                }

                var field = this.field;
                $timeout(function(){
                    jQuery('#'+field.name).trigger('keyup');
                });
            }

            $scope.autocomplete = function (field, val) {
                return this._autocomplete(field, val, null);
            }

            $scope.autocompleteDetail = function (detail, field, val) {
                return this._autocomplete(field, val, detail);
            }

            $scope.autocompleteSelect = function (detail, $item, $model, $label) {
                this._autocompleteSelect($item, $model, $label, null);
            };
    
            $scope.autocompleteDetailSelect = function (detail, $item, $model, $label) {
                this._autocompleteSelect($item, $model, $label, detail);
            }

        }, 500); 

    });

})();