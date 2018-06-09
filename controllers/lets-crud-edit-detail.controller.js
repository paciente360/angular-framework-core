/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud Edit Detail Controller
*
* File:        controllers/lets-crud-edit-detail.controller.js
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

    var module = angular.module('letsAngular.crud');

    module.controller('CRUDEditDetailController', function ($scope, Restangular, $stateParams, $timeout, headers, $rootScope, $modalInstance, $q, ngToast) {

        $scope.data = {};
        $scope.headers = headers;

        $scope.resource = Restangular.all(headers.route);

        $scope.datepickers = {};
        $scope.datepickerToggle = function (name) {
            if ($scope.datepickers[name] == undefined) {
                $scope.datepickers[name] = false;
            }
            $scope.datepickers[name] = !$scope.datepickers[name];
        }

        $timeout(function () { //@todo it must change

            $scope.submit = function () {
                if (this.crudForm.$valid) {
                    $scope.resource.customPOST($scope.data, $stateParams.id).then(function () {
                        $rootScope.$broadcast('refreshGRID');
                        $modalInstance.dismiss('success');

                    }, function errorCallback(error) {
                        var messages = [];

                        for (var name in error.data) {
                            for (var idx in error.data[name]) {
                                messages.push(error.data[name][idx]);
                            }
                        }
                        console.log('entrou nesse aqui');
                        ngToast.warning(messages.join("<br />"));
                    });
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.autocompleteModels = {};

            // $scope.autocompleteAdd = function(field, query) {
            //   // console.log(field, query);
            //
            //   return $scope.resource.customPOST('quickAdd/' + field.name + '/' + query);
            // }

            $scope.autocomplete = function (field, val) {

                var queries = [];
                if (field.autocomplete_dependencies.length > 0) {
                    var deps = field.autocomplete_dependencies;
                    for (var x in deps) {
                        var dep = deps[x];

                        if ($scope.data[dep] == undefined || $scope.data[dep] == null) {
                            ngToast.warning('missing ' + dep);
                            return;
                        } else {
                            queries[dep] = $scope.data[dep];
                            // queries.push(dep + "=" + $scope.data[dep]);
                        }

                        // console.log("?" + queries.join("&"));
                    }
                }

                var deferred = $q.defer();

                val = val.trim();
                if (val.length == 0) {
                    val = '[blank]';
                }

                if (field.customOptions.general !== undefined) {
                    var _resource = Restangular.all(headers.generalRoute);
                    _resource.customGET('general/autocomplete/' + field.customOptions.general + '/' + val, queries).then(function (data) {

                        if (field.quickAdd === true && val != '[blank]') {
                            data.push({ id: -1, label: 'Adicionar novo: ' + val });
                        }


                        deferred.resolve(data);

                    }, function errorCallback() {
                        return deferred.reject();
                    });
                } else {
                    $scope.resource.customGET('autocomplete/' + field.name + '/' + val, queries).then(function (data) {
                        if (field.quickAdd && val != '[blank]') {
                            data.push({ id: -1, query: val, label: 'Adicionar novo: ' + val });
                        }

                        deferred.resolve(data);

                    }, function errorCallback() {
                        return deferred.reject();
                    });
                }

                return deferred.promise;
            }

            // $scope.autocompleteDetail = function(detail, field, val) {
            //   return $scope.resource.customGET('details/autocomplete/' + detail + '/' + field.name + '/' + val);
            // }

            $scope.autocompleteSelect = function ($item, $model, $label) {
                $scope.$emit('selected-autocomplete', { type: this.field.name, data: $item });
                console.log($item)
                if ($item.id != -1) {
                    this.data[this.field.name] = $item.id;
                } else {
                    $item.$scope = this;

                    $scope.resource.customPOST({ query: $item.query }, 'quickAdd/' + this.field.name).then(function (data) {
                        $item.$scope.data[$item.$scope.field.name] = data.id;
                        $item.$scope.data[$item.$scope.field.name + '.label'] = $item.query;

                    }, function errorCallback() {
                        ngToast.warning('Houve algum problema ao adicionar...');
                    });
                }
            }

            // $scope.autocompleteDetailSelect = function(detail, $item, $model, $label) {
            //   // this.$parent.data[detail][this.$parent.field] = $item.id;
            //   this.detail_data[this.$parent.field.name] = $item.id;
            // }



        }, 500);

    });

})();