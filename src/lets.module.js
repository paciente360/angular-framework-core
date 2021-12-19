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
        'ui.toggle',
        'ngSanitize',
        'ckeditor',
        'swangular'
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

            this.headers[name].get = function (name) {
                for (var _x in this.fields) {
                    var field = this.fields[_x];

                    if (field.name == name) {
                        return field;
                    }
                }
            }

            if(this.headers[name].tabs){
                for (var _x in this.headers[name].tabs) {
                    this.headers[name].tabs[_x].get = function(name){
                        if(this.fields && this.fields.length){
                            for (var _y in this.fields){
                                var field = this.fields[_y];
                                if (field.name == name){
                                    return field;
                                }
                            }
                        }else{
                            return null;
                        }
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
    function appConfig($stateProvider, $httpProvider) { };

    module.run(function($window, swangular){
        $window.customConfirm = function(msg, _true, _false, cb){
            swangular.confirm(null,{
                html:msg,
                title:"",
                type: 'warning',
                showCancelButton:true,
                confirmButtonText: _true,
                cancelButtonText: _false,
                reverseButtons: true,
            }).then(function(result){
                if ("function" == typeof cb){
                    cb(!!result.value)
                }
            });
        }
    })


})();

