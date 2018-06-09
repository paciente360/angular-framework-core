/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Error Service
*
* File:        services/framework/lets-fw-error.service.js
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
    angular
        .module('letsAngular.core')
        .service('fwErrorService', fwErrorService);

    fwErrorService.inject = ['ngToast'];

    function fwErrorService (ngToast) {

        var self = this;

        self.emitFormErrors = function (crudForm) {
            var messages = [];
            var errorTypes = Object.keys(crudForm.$error);
            var pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

            for (var t in errorTypes) {
                var type = crudForm.$error[errorTypes[t]];

                for (var _x in type) {
                    var label = type[_x].$options.fieldInfo.label;
                    if (errorTypes[t] == 'required') {
                        messages.push('O campo ' + label + ' é obrigatório');
                    } else if (errorTypes[t] == 'date' && pattern.test(type[_x].$viewValue) == false) {
                        messages.push('O campo ' + label + ' está com uma data inválida');
                    }
                }
            }

            if (messages.length > 0) ngToast.warning(messages.join("<br />"));
        };

        return {
            emitFormErrors: self.emitFormErrors
        };
    }

})();
