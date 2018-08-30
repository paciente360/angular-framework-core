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
            link: {
                post: function postLink(scope, $el, attrs, controller) {
                    if (!controller) {
                        controller = $el.controller('ngModel');
                    }

                    if (scope.field.type == 'date') {
                        $el.mask('99/99/9999');

                    } else if (scope.field.customOptions.cpf != undefined) {
                        $el.mask('999.999.999-99');

                    } else if (scope.field.customOptions.cnpj != undefined) {
                        $el.mask('99.999.999/9999-99');

                    } else if (scope.field.type == 'float') {
                        if (scope.field.customOptions.currency != undefined) {
                            $el.mask("#.##0,00", { reverse: true });
                            controller.$parsers.unshift(function (value) {
                                return parseFloat($el.cleanVal(),10)/100;
                            });
                            controller.$formatters.unshift(function (value) {
                                return $el.masked(value*100);
                            });
                        } else {
                            
                        }
                    }else if (scope.field.customOptions.documento !== undefined) {

                        var cpfOrCnpj = function (val) {
                            return val.replace(/\D/g, '').length >= 12 ? '00.000.000/0000-00' : '000.000.000-009' ;
                        },
                            docOptions = {
                                onKeyPress: function (val, e, field,  options) {
                                    field.mask(cpfOrCnpj.apply({}, arguments), options);
                                }
                            };
     
                        $timeout(function () {
                            $el.mask(cpfOrCnpj, docOptions);
                        }, 10);


                    } else if (scope.field.customOptions.telefone != undefined) {
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

                    } else if (scope.field.customOptions.cep != undefined) {

                        $el.blur(function () {

                            if (!this.value){
                                return false;
                            }

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
