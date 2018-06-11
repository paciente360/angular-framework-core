/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Input Directive
*
* File:        directives/framework/lets-fw-input.directive.js
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

    angular.module('letsAngular')
        .directive('fwInput', fwInput);

    fwInput.$inject = ['viaCEP', '$timeout', '$compile', 'jQuery', '$sce'];

    function fwInput(viaCEP, $timeout, $compile, jQuery, $sce) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'views/framework/input.html',
            replace: true,
            // priority: 99,
            link: {

                pre: function preLink(scope, $el, attrs, controller) {
                    var dataVar = $el.attr('fw-data');
                    if (scope.field.customOptions.events == undefined) {
                        scope.field.customOptions.events = {};
                    }

                    scope.fieldHtml = function () {
                        return $sce.trustAsHtml(scope.field.toString());
                    }

                    if (dataVar != 'data' && dataVar != 'modal_data') {
                        scope.data = scope[dataVar];
                    }

                    if (dataVar != 'data' && scope.field.autocomplete !== false) {
                        // Modal case
                        if (scope.detail_key === undefined) scope.detail_key = scope.headers.route;
                        var detail = scope.detail_key;

                        if (scope.acdetail) {
                            scope.autocomplete = function (field, val) {
                                return scope.autocompleteDetail(detail, field, val);
                            }
                        }

                        scope.autocompleteSelect = function ($item, $model, $label) {
                            return scope.autocompleteDetailSelect(detail, $item, $model, $label);
                        }

                    }

                    if (dataVar != 'data' && scope.field.customOptions.file != undefined) {
                        scope.download = function (field, id) {
                            var detail = scope.detail_key;
                            return scope.downloadDetail(detail, field, id, scope.data);
                        }
                    }

                    if (scope.field.customOptions.cep != undefined) {
                        // console.log(scope);

                        $el.find('input.main-input').blur(function () {
                            var $scope = angular.element(this).scope();
                            viaCEP.get(this.value).then(function (response) {
                                // console.log(response, $scope);
                                var map = $scope.field.customOptions.cep;
                                // $scope.$parent.headers

                                $scope.data[map.address] = response.logradouro;
                                $scope.data[map.district] = response.bairro;
                                $scope.data[map.city] = response.localidade;
                                $scope.data[map.state] = response.uf;

                                scope.$$phase || scope.$apply();
                            });
                        });
                    }
                    else if (scope.field.customOptions.multiple != undefined && scope.field.customOptions.multiple == true) {
                        var a = $compile($el.contents())(scope);
                        console.log(a);
                        // $el.replaceWith($compile($el.contents())(scope))
                    }

                    jQuery($el).on('blur', ':input[ng-model]', function (e) {
                        // $el.find(':input[ng-model]').blur(function() {

                        try {
                            if (angular.element(this).scope().field.customOptions.events.blur != undefined) {
                                angular.element(this).scope().field.customOptions.events.blur.call(this, e);
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }


                    });

                    scope.isEmpty = function (obj) {
                        return Object.keys(obj).length;
                    }
                }

            }

        }
    }
})();
