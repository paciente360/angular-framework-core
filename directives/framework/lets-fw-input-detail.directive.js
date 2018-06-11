/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Input Detail Directive
*
* File:        directives/framework/lets-fw-input-detail.directive.js
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
        .directive('fwInputDetail', fwInputDetail);

    fwInputDetail.$inject = ['viaCEP', '$timeout', '$compile', 'jQuery'];

    function fwInputDetail(viaCEP, $timeout, $compile, jQuery) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'views/framework/input-detail.html',
            replace: true,
            // controller: function($scope) {
            //   $scope.data = $scope.detail_data;
            // }
            link: {
                post: function preLink(scope, $el, attrs, controller) {


                },
            }
        }
    }
})();
