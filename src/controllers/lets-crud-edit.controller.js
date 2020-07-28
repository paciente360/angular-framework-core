(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDEditController', function ($scope, $controller, Restangular, $stateParams, $timeout, module, $state, $rootScope, ngToast, $http, Upload, fwModalService, $window, locale) {
        $controller('AutoCompleteController', {$scope:$scope});

        $scope.data = {};
        $scope.module = module;
        $scope.$http = $http;

        $scope.$emit('refresh-headers');

        $scope.datepickers = {};
        $scope.loading_http_request = false;
        $scope.datepickerToggle = function (name) {
            if ($scope.datepickers[name] == undefined) {
                $scope.datepickers[name] = false;
            }
            $scope.datepickers[name] = !$scope.datepickers[name];
        }

        $scope.fetchData = function (id, detail) {

            for (var y in $scope.headers.fields) {
                var field = $scope.headers.fields[y];
                if (field.type == 'boolean' && $scope.data[field.name]==undefined) {
                    if (field.customOptions.default){
                        $scope.data[field.name] = true;
                    }else{
                        $scope.data[field.name] = false;
                    }
                }
            }

            if(detail){
                var _resource = $scope.resource;
                var _route = $scope.headers.id;
                var _events = {new:"data-new-detail", edit:"data-loaded-detail"};
            }else{
                var _resource = $scope.$parent.resource;
                var _route = "crudGET/"+$stateParams.id;
                var _events = {new:"data-new", edit:"data-loaded"};
            }

            
            if (id) {
                _resource.customGET(_route).then(function (data) {
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

                        if (field.customOptions && field.customOptions.file != undefined) {
                            $scope.fileName = data[field.name];
                        }

                    }

                    $scope.data = data;
                    
                    $timeout(function(){
                        $scope.$broadcast('setProgressFile');
                    });

                    $scope.$emit(_events.edit);
                });
            } else {

                $timeout(function () {
                    $scope.$emit(_events.new);
                }, 50);

            }
        };

        if ($scope.headersReady) {
            $scope.fetchData($stateParams.id);
        }

        $scope.$on('headers-set', function () {
            $scope.fetchData($stateParams.id);
        });

        $scope.getscope = function(){
            return $scope;
        }

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
            } catch (e) {
            }
        }

        $scope.getFilter = function(){
            return decodeURIComponent($window.location.search).replace("?filter=","");
        }

        $scope.submit = function(){
            $scope._submit(this);
        }

        $scope._submit = function ($this, detail) {
            var $_scope = $this;
            var _data = $_scope.data;
            

            _.each($_scope.headers.fields, function (field, key) {
                field.error = undefined;

                // Number null
                if(!_data[field.name] && _data[field.name] != 0 && !field.notnull && field.type === 'number'){
                    _data[field.name] = null;
                }

                // Confirm Password
                if (field.type == 'password' && field.name.indexOf('confirm') != 0) {
                    if (_data['confirm_'+field.name] != _data[field.name]) {
                        field.error='Senha diferente da confirmação.'
                        $this.crudForm.$valid = false;
                    }
                }

                // Invalid Autocomplete
                if (field.autocomplete && _data[field.name+".label"] && "object"!==typeof(_data[field.name+".label"]) ){
                    field.error="Campo inválido, selecione novamente.";
                    $this.crudForm.$valid = false;
                }

                // Invalid Date
                if (field.name=="data_nascimento"){
                    var dataValue = _data[field.name];
                    if (moment(dataValue).isAfter(moment()) || moment(dataValue).isSame(moment(), "day")) {
                        field.error='Insira uma data de nascimento válida, anterior ao dia de hoje!';
                        $this.crudForm.$valid = false;
                    }
                }


            });

            // Validade Form
            if (!$this.crudForm.$valid) {
                return false;
            }
            
            function nextBefore(error_) {
                
                $_scope.loading_http_request = true;

                if(error_) {
                    $_scope.loading_http_request = false;
                    ngToast.warning( error_.message ? error_.message : "Confira seu formulário");
                    return false;
                }
                
                if($_scope.headers.tabs){
                    Object.keys($_scope.headers.tabs).forEach(function(tab){
                        if($_scope.data[tab]){
                            delete $_scope.data[tab];
                        }
                    });
                }
                
                if (detail){
                    if (!$scope.data.id) {
                        var response = $scope.resource.customPOST($scope.data, $stateParams.id);
                        var typeSave = "new";
                    } else {
                        var response = $scope.resource.customPUT($scope.data, $scope.data.id);
                        var typeSave = "edit";
                    }
                }else{
                    if (!$stateParams.id) {
                        response = $scope.$parent.resource.post($scope.data);
                        var typeSave = "new";
                    } else {
                        response = $scope.data.put();
                        var typeSave = "edit";
                    }
                }

                response.then(function (resp) {
                    $_scope.loading_http_request = false;

                    function nextAfter(){
                        if (detail){
                            $rootScope.$broadcast('refreshGRID');
                        }
                        $scope.cancel();
                    }

                    $scope.$emit('after save', nextAfter, resp, typeSave);
                    if (!$scope.$$listeners["after save"]){
                        nextAfter();
                    }

                }, function errorCallback(error) {
                    var messages = [];
                    $_scope.loading_http_request = false;
                    
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

        };

        $scope.cancel = function () {
            $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'), {filter:$scope.getFilter()});
        };

        $scope.openPopup = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.popupOpen = true;
        };

        $scope.buttonClick = function (method) {
            $scope[method]();
        };
        
        $scope.newDetail = function (tab, data, id, route) {

            if (!tab.fixedRoute){
                tab.fixedRoute = tab.route;
            }
            
            var parentModel = $scope.headers.parent_route ? $scope.headers.parent_route : $scope.headers.route.toLowerCase();
            tab.route = (id ? route : $scope.headers.route+tab.fixedRoute);
            tab.id = id ? id : null;

            fwModalService.createCRUDModal(tab, null, "CRUDEditDetailController", null, $scope);
        };

        $scope.deleteDetail = function (route, row) {
            var resource = Restangular.all(route);
            resource.customDELETE(row.id).then(function () {
                $rootScope.$broadcast('refreshGRID');
                $rootScope.$broadcast('data-grid-updated', { type: route.split('/').pop() });
            },function(err){
                ngToast.warning(err.data.error.message);
            });
        };

        $scope.newDetailData = function(origin, detail, modal){

            $scope.data[detail] = $scope.data[detail] || [];

            if (modal){
                var headers = $scope.headers[origin][detail];

                if (headers.route_detail){
                    headers.route = headers.route_detail;
                }else{
                    headers.route = $scope.headers.route+"/details/"+detail;
                }

                fwModalService.createCRUDModal(headers, null, null, null, $scope)
                .then(function (response) {
                    response.new = true;
                    $scope.data[detail].push(response);
                });
            }else{
                var _new = {};
                var fields = $scope.headers[origin][detail].fields;

                for (var x in fields) {
                    if (fields[x].type != 'boolean') {
                    _new[fields[x].name] = null;
                    } else {
                    _new[fields[x].name] = false;
                    }
                }

                _new.new = true;

                $scope.data[detail].push(_new);
                $scope.$apply();
            }

        }

        $scope.editDetailData = function (origin, detail, detail_data) {

            var headers = $scope.headers[origin][detail];

            if (headers.route_detail){
                headers.route = headers.route_detail;
            }else{
                headers.route = $scope.headers.route+"/details/"+detail;
            }

            fwModalService.createCRUDModal(headers, detail_data, null, null, $scope)
            .then(function (response) {
                $scope.data[detail][ $scope.data[detail].indexOf(detail_data)] = response;
            });

        };

        $scope.deleteDetailData = function (detail_data, detail_key) {
            if (window.confirm(locale.translate('letsfw.message_delete'))) {
                this.data[detail_key].splice(this.data[detail_key].indexOf(detail_data), 1);
            }
        };

    });

})();