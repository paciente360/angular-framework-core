/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud Tab List Directive
*
* File:        directives/crud/lets-crud-tab-list.directive.js
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
        .directive('crudTabList', crudTabList);

    crudTabList.$inject = ['jQuery'];

    function crudTabList(jQuery) {
        return {
            // restrict: 'E',
            // replace: false,
            // scope: true,
            scope: {
                crudTabListData: '=',
                crudTabListSettings: '&',
                parentData: '='
            },
            templateUrl: 'src/views/crud/crud-tab-list.html',
            link: function (scope, $el) {
                // scope.type = $el.attr('type');
                // scope.data = scope.parentData;
    
                setTimeout(function () {
                    var settings = scope.crudTabListSettings();
    
                    scope.data = scope.parentData;
                    scope.type = settings.type;
                    scope.headers = settings.headers;
                    scope.app = scope.$parent.app;
                    if (scope.crudTabListData) {
                        scope.extraData = scope.crudTabListData;
                    }
                }, 1000);
            }
        }
    }
})();


