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
        'colorpicker-dr'
    ]);

    // ----------------------------
    // Module App Config
    // ----------------------------

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
});