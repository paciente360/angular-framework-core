/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Dynamic Directive
*
* File:        directives/framework/lets-fw-dynamic.directive.js
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
        .directive('fwDynamic', fwDynamic);

    fwDynamic.$inject = ['viaCEP', '$timeout', '$compile', 'jQuery', '$filter'];

    function fwDynamic(viaCEP, $timeout, $compile, jQuery, $filter) {
        var FLOAT_REGEXP_1 = /^\$?\d+.(\d{3})*(\,\d*)$/; //Numbers like: 1.123,56
        var FLOAT_REGEXP_2 = /^\$?\d+,(\d{3})*(\.\d*)$/; //Numbers like: 1,123.56
        var FLOAT_REGEXP_3 = /^\$?\d+(\.\d*)?$/; //Numbers like: 1123.56
        var FLOAT_REGEXP_4 = /^\$?\d+(\,\d*)?$/; //Numbers like: 1123,56

        return {
            restrict: 'A',
            // controller: function($scope, ) {
            //
            // },
            link: {
                // pre: function preLink(scope, $el, attrs, controller) {
                // },


                post: function postLink(scope, $el, attrs, controller) {
                    if (!controller) {
                        controller = $el.controller('ngModel');
                    }

                    if (scope.field.customOptions.cpf != undefined) {
                        $el.mask('999.999.999-99');
                        // } else if (scope.field.customOptions.email != undefined) {
                        //     $el.attr('data-parsley-type', "email");
                    } else if (scope.field.customOptions.cnpj != undefined) {
                        $el.mask('99.999.999/9999-99');
                    } else if (scope.field.type == 'float') {



                        // controller.$parsers.unshift(function(viewValue) {
                        //     if (FLOAT_REGEXP_1.test(viewValue)) {
                        //         controller.$setValidity('float', true);
                        //         return parseFloat(viewValue.replace('.', '').replace(',', '.'));
                        //     } else if (FLOAT_REGEXP_2.test(viewValue)) {
                        //         controller.$setValidity('float', true);
                        //         return parseFloat(viewValue.replace(',', ''));
                        //     } else if (FLOAT_REGEXP_3.test(viewValue)) {
                        //         controller.$setValidity('float', true);
                        //         return parseFloat(viewValue);
                        //     } else if (FLOAT_REGEXP_4.test(viewValue)) {
                        //         controller.$setValidity('float', true);
                        //         return parseFloat(viewValue.replace(',', '.'));
                        //     } else {
                        //         controller.$setValidity('float', false);
                        //         return undefined;
                        //     }
                        // });

                        // controller.$formatters.unshift(
                        //     function(modelValue) {
                        //         return $filter('number')(parseFloat(modelValue), 2);
                        //     }
                        // );

                        if (scope.field.customOptions.currency != undefined) {
                            $el.mask("#.##0,00", { reverse: true });
                        } else {
                            // $el.mask("##0,00", { reverse: true });
                            // var o = {
                            //   // min: 1,
                            //   // max: 9,
                            //   step: 1,
                            //   decimals: 2
                            // };

                            // $el.keydown(function(e) {-1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190, 188]) || /65|67|86|88/.test(e.keyCode) && (!0 === e.ctrlKey || !0 === e.metaKey) || 35 <= e.keyCode && 40 >= e.keyCode || (e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) && (96 > e.keyCode || 105 < e.keyCode) && e.preventDefault() });

                            // var options = angular.extend(o, scope.touchspinOptions);

                            // if (options.umed != 'UN') {
                            //   options.postfix = options.umed;
                            // }

                            // $el.TouchSpin(o);
                        }
                    } else if (scope.field.customOptions.telefone != undefined) {
                        // $el.mask("(99) 9999-9999?9")
                        // .focusout(function (event) {
                        //   var target, phone, element;
                        //   target = (event.currentTarget) ? event.currentTarget : event.srcElement;
                        //   phone = target.value.replace(/\D/g, '');
                        //   element = $(target);
                        //   element.unmask();
                        //   if(phone.length > 10) {
                        //     element.mask("(99) 99999-999?9");
                        //   } else {
                        //     element.mask("(99) 9999-9999");
                        //   }
                        // });

                        // var val = $el.val();
                        // if (val.replace(/\D/g, '').length === 11) {
                        //
                        // } '(00) 00000-0000' : '(00) 0000-00009'


                        var SPMaskBehavior = function (val) {
                            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
                        },
                            spOptions = {
                                onKeyPress: function (val, e, field, options) {
                                    field.mask(SPMaskBehavior.apply({}, arguments), options);
                                }
                            };

                        $timeout(function () {
                            $el.mask(SPMaskBehavior, spOptions);
                        }, 100);

                        // $el.keyup();
                        // $el.val($el.masked());
                    } else if (scope.field.type == 'date') {
                        $el.mask('99/99/9999');
                    } else if (scope.field.customOptions.cep != undefined) {

                        $el.blur(function () {
                            var $scope = angular.element(this).scope();
                            var dataVar = jQuery(this).parent().attr('fw-data');
                            viaCEP.get(this.value).then(function (response) {
                                var map = $scope.field.customOptions.cep;

                                $scope.data[map.address] = response.logradouro;
                                $scope.data[map.district] = response.bairro;
                                $scope.data[map.city] = response.localidade;
                                $scope.data[map.state] = response.uf;
                            });
                        });
                    }
                }
            }
        }
    }
})();
