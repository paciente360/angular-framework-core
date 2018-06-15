/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud Form Directive
*
* File:        directives/crud/lets-crud-form.directive.js
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
        .directive('crudBreadcrumb', crudBreadcrumb);

    crudBreadcrumb.$inject = [];

    function crudBreadcrumb() {
        return {
            restrict: 'E',
            templateUrl: 'lets/views/framework/breadcrumb.html',
            replace: true,
            link: function (scope, $el) {

            }
        }
    }
})();