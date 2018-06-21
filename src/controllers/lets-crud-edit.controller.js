(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDEditController', function ($scope, Restangular, $stateParams, $timeout, $modal, module, $state, $rootScope, $q, ngToast, $http, Upload, fwModalService) {
        $scope.data = {};
        $scope.dataLoaded = false;
        $scope.module = module;
        $scope.$http = $http;

        $scope.$emit('refresh-headers');

        $scope.datepickers = {};
        $scope.datepickerToggle = function (name) {
            if ($scope.datepickers[name] == undefined) {
                $scope.datepickers[name] = false;
            }
            $scope.datepickers[name] = !$scope.datepickers[name];
        }

        $scope.fetchData = function () {
            if ($stateParams.id) {
                $scope.$parent.resource.customGET('crudGET/' + $stateParams.id).then(function (data) {
                    for (var y in $scope.headers.fields) {
                        var field = $scope.headers.fields[y];
                        if (field.type == 'date' && (data[field.name] != undefined && data[field.name] != null)) {
                            data[field.name] = new Date(data[field.name]);
                        }
                    }

                    $scope.data = data;
                    $scope.dataLoaded = true;

                    if (typeof(window.setProgressFile)=="function"){
                        $timeout(function(){
                            window.setProgressFile();
                        });
                    }

                    $scope.$emit('data-loaded');
                });
            } else {

                $timeout(function () {
                    $scope.$emit('data-new');
                }, 50);

                for (var y in $scope.headers.fields) {
                    var field = $scope.headers.fields[y];
                    if (field.type == 'boolean') {
                        $scope.data[field.name] = field.customOptions.default ? field.customOptions.default : false;
                    }
                }

                $scope.dataLoaded = true;
                $scope.$emit('data-loaded');
            }
        };

        if ($scope.headersReady) {
            $scope.fetchData();
        }

        $scope.$on('headers-set', function () {
            $scope.fetchData();
        });

        $scope._upload = function (field, file) {
            var _url = $rootScope.appSettings.API_URL + 'upload';

            if (field.customOptions.file.container != undefined) {
                _url += '/' + field.customOptions.file.container + '/upload'
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

            _.each($_scope.data, function (dataValue, key) {
                if (key.indexOf('.label') !== -1 && _data.id === undefined) {
                    if (typeof dataValue !== 'object' && dataValue !== '') {
                        err[key] = 'Adicione o(a) ' + key.split('.')[0] + ' no sistema antes de escolher nesse formulário!';
                    }
                }
                if (key === 'data_nascimento') {
                    if (moment(dataValue).isAfter(moment()) || moment(dataValue).isSame(moment(), "day")) {
                        err[key] = 'Insira uma data de nascimento válida, anterior ao dia de hoje!';
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

                if($_scope.headers.tabs){
                    Object.keys($_scope.headers.tabs).forEach(function(tab){
                        if($_scope.data[tab]){
                            delete $_scope.data[tab];
                        }
                    });
                }

                if (!$stateParams.id) {
                    var response = $scope.$parent.resource.post($scope.data);
                    var typeSave = "new";
                } else {
                    var response = $scope.data.put();
                    var typeSave = "edit";
                }

                response.then(function (resp) {
                    if ($scope.doAfterSave != undefined && typeof $scope.doAfterSave == 'function') {
                        $scope.doAfterSave(resp, typeSave);
                    } else {
                        $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'));
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
                        } else {
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
                            }

                            // debugger;
                            _.each(codes, function (code, key) {
                                var _name = findLabel(key);

                                var _message = friendlyErrors[code].replace('%s', _name);
                                // debugger;
                                // console.log(code, key);
                                messages.push(_message);
                            })
                        }

                    }

                    ngToast.warning(messages.join("<br />"));
                });
            } else {
                // debugger;
                var messages = [];
                var errorTypes = Object.keys(this.crudForm.$error);
                var pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

                for (var t in errorTypes) {
                    var type = this.crudForm.$error[errorTypes[t]];

                    for (var _x in type) {
                        var label = type[_x].$options.fieldInfo.label;
                        if (errorTypes[t] == 'required') {
                            messages.push('O campo ' + label + ' é obrigatório');
                        } else if (errorTypes[t] == 'date' && pattern.test(type[_x].$viewValue) == false) {
                            messages.push('O campo ' + label + ' está com uma data inválida');
                        }
                    }
                }

                if (messages.length > 0) {
                    ngToast.warning(messages.join("<br />"));
                }
                else {

                    if (!$stateParams.id) {
                        var response = $scope.$parent.resource.post($scope.data);
                        var typeSave = "new";
                    } else {
                        var response = $scope.data.put();
                        var typeSave = "edit";
                    }

                    response.then(function () {
                        if ($scope.doAfterSave != undefined && typeof $scope.doAfterSave == 'function') {
                            $scope.doAfterSave(resp, typeSave);
                        } else {
                            $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'));
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
                            } else {
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
                                }

                                // debugger;
                                _.each(codes, function (code, key) {
                                    var _name = findLabel(key);

                                    var _message = friendlyErrors[code].replace('%s', _name);
                                    // debugger;
                                    // console.log(code, key);
                                    messages.push(_message);
                                })
                            }

                        }

                        ngToast.warning(messages.join("<br />"));
                    });
                }

            }
        };

        $scope.cancel = function () {
            $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'));
        };

        $scope.autocompleteModels = {};

        $scope.autocompleteAdd = function (query) {
            // console.log(query);
        }

        $scope._autocomplete = function (field, val, detail) {

            var queries = [];

            var deferred = $q.defer();

            if (field.autocomplete_dependencies.length > 0) {
                var deps = field.autocomplete_dependencies;
                for (var x in deps) {
                    var dep = deps[x];
                    if ($scope.data[dep.field] == undefined || $scope.data[dep.field] == null) {

                        var text = 'Selecione antes o(a) ' + dep.label;

                        var data = [];
                        data.push({ id: null, label: text });

                        deferred.resolve(data);

                        return deferred.promise;
                    } else {
                        queries[dep.field] = $scope.data[dep.field];
                    }
                }
            }

            val = val.trim();
            if (val.length == 0 || field.customOptions.select == true) {
                val = '[blank]';
            }

            if (field.customOptions.general !== undefined) {
                $scope.resource.customGET('general/autocomplete/' + field.customOptions.general + '/' + val, queries).then(function (data) {

                    if (field.quickAdd === true && val != '[blank]') {
                        data.push({ id: -1, label: 'Adicionar novo: ' + val });
                    }

                    deferred.resolve(data);

                }, function errorCallback() {
                    return deferred.reject();
                });
            } else if (field.customOptions.list == undefined) {
                
                if (detail) {
                    var route = 'details/' + detail + '/autocomplete/' + field.name + '/' + val;
                } else {
                    var route = 'autocomplete/' + field.name + '/' + val;
                }

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
                        data.push({ id: -1, label: 'Adicionar novo: ' + val });
                    }

                    deferred.resolve(data);

                }, function errorCallback() {
                    return deferred.reject();
                });
            } else {
                deferred.resolve(field.customOptions.list);
            }
            return deferred.promise;
        }

        $scope.autocomplete = function (field, val) {
            return this._autocomplete(field, val, null);
        }

        $scope.autocompleteDetail = function (detail, field, val) {
            return this._autocomplete(field, val, detail);
        }

        $scope.doafterAutoCompleteSelect = {};

        $scope._autocompleteSelect = function ($item, $model, $label, detail) {
            
            var _data = detail ? this.detail_data : this.data;

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

            if (typeof $scope.doafterAutoCompleteSelect[this.field.name] == "function") {
                $scope.doafterAutoCompleteSelect[this.field.name].call(this, _data, $item, $model, $label);
            }

            if (detail) {
                this.detail_data = _data;
            } else {
                this.data = _data;
            }
        }

        $scope.autocompleteSelect = function (detail, $item, $model, $label) {
            this._autocompleteSelect($item, $model, $label, null);
        };

        $scope.autocompleteDetailSelect = function (detail, $item, $model, $label) {
            this._autocompleteSelect($item, $model, $label, detail);
        }

        $scope.openPopup = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.popupOpen = true;
        };

        $scope.buttonClick = function (method) {
            $scope[method]();
        };
        
        $scope.newDetail = function (tab, data, id, route) {
            
            var parentModel = $scope.headers.parent_route ? $scope.headers.parent_route : $scope.headers.route.toLowerCase();
            tab.route = (id ? route : module+tab.route);
            tab.id = id ? id : null;

            fwModalService.createCRUDModal(tab, null, "CRUDEditDetailController");
        };

        $scope.deleteDetail = function (route, row) {
            var resource = Restangular.all(route);
            resource.customDELETE(row.id).then(function () {
                $rootScope.$broadcast('refreshGRID');
                $rootScope.$broadcast('data-grid-updated', { type: route.split('/').pop() });
            });
        };


        $scope.newDetailData = function(origin, detail, modal){

            $scope.data[detail] = $scope.data[detail] || [];

            if (modal){
                var headers = $scope.headers[origin][detail];
                headers.route = $scope.headers.route+"/details/"+detail;

                fwModalService.createCRUDModal(headers)
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
            headers.route = $scope.headers.route+"/details/"+detail;

            fwModalService.createCRUDModal(headers, detail_data)
            .then(function (response) {
                $scope.data[detail][ $scope.data[detail].indexOf(detail_data)] = response;
            });

        };

        $scope.deleteDetailData = function (detail_data, detail_key) {
            if (window.confirm('Deseja realmente excluir esse item?')) {
                this.data[detail_key].splice(this.data[detail_key].indexOf(detail_data), 1);
            }
        };

    });

})();