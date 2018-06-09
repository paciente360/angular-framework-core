/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core Module
*
* File:        lets-angular-framework-core.module.js
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

    var module = angular.module('letsAngular', [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'angular.viacep',
        'ngCpfCnpj',
        'ui.mask',
        'ui.jq',
        'ui.event',
        'ngFileUpload',
        'moment-filter',
        'checklist-model',
        'ui.toggle',
        'ui.select',
        'ngSanitize',
        'colorpicker-dr',
        'letsAngular.crud',
        'letsAngular.core'
    ]);

    module.config(appConfig);

    module.provider('headers', headersProvider);

    function headersProvider() {
        this.headers = {};

        var provider = {};

        this.set = function (name, headers) {
            this.headers[name] = headers;
        }

        this.get = function (name) {

            this.headers[name].findLabel = function (name) {
                for (var _x in this.fields) {
                    var field = this.fields[_x];

                    if (field.name == name) {
                        return field.label;
                    }
                }
            }

            return this.headers[name];
        }

        this.$get = function () {
            return this;
        };
    }

    appConfig.$inject = ['$stateProvider', '$httpProvider'];

    function appConfig($stateProvider, $httpProvider) {
        // $authProvider.loginUrl = '/auth/login';
        // $authProvider.baseUrl = 'http://192.168.1.112/';
    };

})();
