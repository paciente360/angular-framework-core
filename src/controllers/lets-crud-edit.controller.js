/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud Edit Controller
*
* File:        controllers/lets-crud-edit.controller.js
* Version:     1.0.0
*
* Author:      Lets Comunica
* Info:        https://bitbucket.org/letscomunicadev/angular-framework-crud/src
* Contact:     fabio@letscomunica.com.br
*
* Copyright 2018 Lets Comunica, all rights reserved.
* Copyright 2018 Released under the MIT License
*
* This source file is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
* or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
*/

(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDEditController', function ($scope, Restangular, $stateParams, $timeout, $modal, module, $state, $rootScope, $q, ngToast, $http, Upload, fwModalService) {

        $scope.data = {};
        $scope.dataLoaded = false;
        $scope.module = module;
        $scope.$http = $http;

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
                    // console.log(data);
                    // @todo finish parsing detail data
                    for (var y in $scope.headers.fields) {
                        // console.log(data[$scope.headers.fields[y].name]);
                        var field = $scope.headers.fields[y];
                        if (field.type == 'date' && (data[field.name] != undefined && data[field.name] != null)) {
                            data[field.name] = new Date(data[field.name]);
                        }

                        if (field.customOptions.f) {

                        }
                    }
                    // Establish read-only on tab-sessions or masterdetails fields that are filled with data
                    var list = $scope.headers.tabs_session;
                    if (list === undefined) {
                        // Since masterdetails is an object, convert it to a list to be iterated
                        list = [];
                        for (var prop in $scope.headers.masterdetails) {
                            list.push($scope.headers.masterdetails[prop]);
                        }
                    }
                    for (var i in list) {
                        var label = list[i].label_stem;
                        if (data[label] !== undefined && data[label].length > 0) {
                            for (var j in data[label]) {
                                data[label][j].disabled = true;
                            }
                        }
                    }
                    $scope.data = data;
                    $scope.dataLoaded = true;
                    $scope.$emit('data-loaded');
                });
            } else {

                for (var y in $scope.headers.fields) {
                    // console.log(data[$scope.headers.fields[y].name]);
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
        })

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

            $scope._download(url, field);
        }

        $scope.downloadDetail = function (detail, field, id) {
            // window.open($rootScope.appSettings.API_URL + $scope.module + '/details/' + detail + '/download/' + field.name + '/' + id);
            var url = $rootScope.appSettings.API_URL + $scope.module + '/details/' + detail + '/download/' + field.name + '/' + id;

            $scope._download(url, field);
        }

        $scope._download = function (url, field) {
            this.$http({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer'
            }).success(function (data, status, headers) {
                headers = headers();
                if (field.customOptions.file.container != undefined) {
                    var filename = $scope.data[field.name];
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
                // console.log(e);
            }
        }

        $scope.submit = function () {
            var $_scope = this;
            // console.log(this.crudForm.$valid);
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
                // if (true) { //this.crudForm.$valid) {
                // console.log('jajajajaj');

                if (!$stateParams.id) {
                    var response = $scope.$parent.resource.post($scope.data);
                } else {
                    var response = $scope.data.put();
                }

                response.then(function () {
                    if ($scope.doAfterSave != undefined && typeof $scope.doAfterSave == 'function') {
                        $scope.doAfterSave();
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
                            // console.log(type[_x].$name);
                            // debugger;
                            // var label = $scope.headers.findLabel(type[_x].$name);

                            messages.push('O campo ' + label + ' é obrigatório');
                        } else if (errorTypes[t] == 'date' && pattern.test(type[_x].$viewValue) == false) {
                            messages.push('O campo ' + label + ' está com uma data inválida');
                        }
                    }
                }

                // var _fields = $(window.crudForm).parsley().fields;

                // for (var _x in _fields) {
                //     var _field = _fields[_x];
                //     // $_scope_field.$element.attr('name');
                //     // debugger;

                //     var errors = ParsleyUI.getErrorsMessages(_field);

                //     if (errors.length > 0) {
                //         var a = _field.$element[0].closest('.input-container')
                //         var name = a.attributes['data-name'].value;
                //         var label = $scope.headers.findLabel(name);

                //         // console.log(label, errors);
                //         for (var _y in errors) {

                //             messages.push(errors[_y].replace('Este campo ', 'O campo ' + label + ' '));

                //         }
                //     }


                // }
                if (messages.length > 0) {
                    ngToast.warning(messages.join("<br />"));
                }
                else {
                    if (!$stateParams.id) {
                        var response = $scope.$parent.resource.post($scope.data);
                    } else {
                        var response = $scope.data.put();
                    }

                    response.then(function () {
                        if ($scope.doAfterSave != undefined && typeof $scope.doAfterSave == 'function') {
                            $scope.doAfterSave();
                        } else {
                            $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'));
                        }
                    }, function errorCallback(error) {
                        console.log(error);

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

        // $scope.newDetail = function (tab, data) {
        //     // console.log(tab,data);
        //
        //     var modalInstance = $modal.open({
        //         animation: true,
        //         templateUrl: 'app/modules/core/utils/crud/crud-form.html',
        //         controller: 'CRUDEditDetailController',
        //         resolve: {
        //             headers: {
        //                 fields: tab.fields,
        //                 route: module + tab.route,
        //                 // route: module + '/:id/' + tab.name,
        //                 label_row: tab.label_row,
        //                 label: tab.label,
        //                 tabs: {}
        //             }
        //         }
        //         // size: size,
        //         // resolve: {
        //         //   items: function () {
        //         //     return $scope.items;
        //         //   }
        //         // }
        //     });
        //
        //     $rootScope.$$phase || $rootScope.$apply();
        //
        //     modalInstance.result.then(function (selectedItem) {
        //         $scope.selected = selectedItem;
        //     }, function () {
        //         // console.info('Modal dismissed at: ' + new Date());
        //     });
        // };
        // $scope.autocompleteWrapper = function(field, val) {
        //   console.log(field, val);
        // }

        $scope.autocompleteAdd = function (query) {
            // console.log(query);
        }

        $scope.autocomplete = function (field, val) {

            var queries = [];

            var deferred = $q.defer();

            if (field.autocomplete_dependencies.length > 0) {
                var deps = field.autocomplete_dependencies;
                for (var x in deps) {
                    var dep = deps[x];
                    if ($scope.data[dep.field] == undefined || $scope.data[dep.field] == null) {
                        // window.alert('missing ' + dep);
                        //            var text = 'missing ' + dep.field;


                        var text = 'Selecione antes o(a) ' + dep.label;

                        var data = [];
                        data.push({ id: -1, label: text });

                        deferred.resolve(data);

                        return deferred.promise;
                    } else {
                        queries[dep.field] = $scope.data[dep.field];
                        // queries.push(dep + "=" + $scope.data[dep]);
                    }

                    // console.log("?" + queries.join("&"));
                }
            }
            // return $scope.resource.customGET('autocomplete/' + field.name + '/' + val, queries);



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
                $scope.resource.customGET('autocomplete/' + field.name + '/' + val, queries).then(function (data) {

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

        $scope.autocompleteDetail = function (detail, field, val) {

            var queries = [];

            var deferred = $q.defer();

            if (field.autocomplete_dependencies.length > 0) {
                var deps = field.autocomplete_dependencies;
                for (var x in deps) {
                    var dep = deps[x];
                    if ($scope.data[dep.field] == undefined || $scope.data[dep.field] == null) {
                        // window.alert('missing ' + dep);
                        //            var text = 'missing ' + dep.field;

                        var text = 'Selecione antes o(a) ' + dep.label;

                        var data = [];
                        data.push({ id: -1, label: text });

                        deferred.resolve(data);

                        return deferred.promise;
                    } else {
                        queries[dep.field] = $scope.data[dep.field];
                        // queries.push(dep + "=" + $scope.data[dep]);
                    }

                    // console.log("?" + queries.join("&"));
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
            } else $scope.resource.customGET('details/' + detail + '/autocomplete/' + field.name + '/' + val, queries).then(function (data) {
                if (field.quickAdd && val != '[blank]') {
                    data.push({ id: -1, query: val, label: 'Adicionar novo: ' + val });
                }

                deferred.resolve(data);

            }, function errorCallback() {
                return deferred.reject();
            });

            return deferred.promise;
        }

        $scope.autocompleteSelect = function ($item, $model, $label) {
            $scope.$emit('selected-autocomplete', { type: this.field.name, data: $item });
            if (typeof $item.id != 'integer' || (typeof $item.id == 'integer' && $item.id > 0)) {
                this.data[this.field.name] = $item.id;
            } else {
                this.data[this.field.name + '.label'] = null;
                return false;
                // $scope.resource.customPOST('quickAdd/')
                // this.field.name
            }
        }

        $scope.doafterAutoCompleteSelect = function ($item, $model, $label) {

        }

        $scope.autocompleteDetailSelect = function (detail, $item, $model, $label) {
            if ($item.id != -1) {
                this.data[this.$parent.field.name] = $item.id;
            } else {
                $item.$scope = this;

                $scope.resource.customPOST({ query: $item.query }, 'quickAdd/' + this.field.name).then(function (data) {
                    $item.$scope.data[$item.$scope.field.name] = data.id;
                    $item.$scope.data[$item.$scope.field.name + '.label'] = $item.query;
                }, function errorCallback() {
                    ngToast.warning('Houve algum problema ao adicionar...');
                });
            }
            // this.$parent.data[detail][this.$parent.field] = $item.id;
            // this.data[this.$parent.field.name] = $item.id;

            $scope.doafterAutoCompleteSelect.call(this, this.data, $item, $model, $label)
        };

        $scope.openPopup = function ($event) {
            // console.log('tango');
            $event.preventDefault();
            $event.stopPropagation();
            this.popupOpen = true;
        };

        $scope.deleteDetailData = function (detail_data, detail_key) {
            // console.log(detail_data, detail_key);
            if (window.confirm('Deseja realmente excluir esse item?')) {
                this.data[detail_key].splice(this.data[detail_key].indexOf(detail_data), 1);
            }
        };

        $scope.deleteDetail = function (route, row) {
            // $http.delete($rootScope.appSettings.API_URL + route + '/' + row.id).then(function(response) {
            //   $rootScope.$broadcast('refreshGRID');
            // });
            var resource = Restangular.all(route);
            resource.customDELETE(row.id).then(function () {
                // $state.go($scope.$parent.path + '.list');
                $rootScope.$broadcast('refreshGRID');
                $rootScope.$broadcast('data-grid-updated', { type: route.split('/').pop() });
            });
        };

        $scope.editDetail = function (route, row, detail_key) {
            var origin = jQuery('.button-new').attr('origin');
            var headers = $scope.headers[origin][detail_key];
            var parentModel = $scope.headers.route.toLowerCase();
            if ($scope.headers.parent_route) parentModel = $scope.headers.parent_route;

            fwModalService.createCRUDModal(headers, parentModel, row, true)
              .then(function (response) {
                  var resource = Restangular.all(route);
                  resource.customPUT(response, row.id).then(function (data) {
                    // $state.go($scope.$parent.path + '.list');
                    $rootScope.$broadcast('refreshGRID');
                    $rootScope.$broadcast('data-grid-updated', { type: route.split('/').pop() });
                  });
              });
        };

        $scope.editDetailData = function (detail_data, detail_key) {

            var origin = jQuery('.button-new').attr('origin');
            var headers = $scope.headers[origin][detail_key];
            var parentModel = $scope.headers.route.toLowerCase();

            detail_data.disabled = false;

            function processResponse(response) {
                headers.fields.forEach(function(x) {
                    detail_data[x.name] = response[x.name];
                });

                detail_data.disabled = true;
            }

            fwModalService.createCRUDModal(headers, parentModel, detail_data, true)
                .then(function (response) {
                    // detail_data = response;

                    processResponse(response);

                });
        };

        $scope.buttonClick = function (method) {
          $scope[method]();
        };

    });

})();