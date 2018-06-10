/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Auto Complete Directive
*
* File:        directives/framework/lets-fw-auto-complete.directive.js
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

    angular.module('letsAngular.core')
        .directive('fwAutoComplete', fwAutoComplete);

    fwAutoComplete.$inject = ['$compile'];

    function fwAutoComplete($compile) {
        var controllerName = 'vm';
        return {
            restrict: 'A',
            priority: 1,
            link: function (scope, element) {
                var _input = element.find('input');

                var clickHandler = function () {
                    var _oldVal = _input.val();
                    var _val = _oldVal + ' ';
                    // if (_val.length == 0) {
                    //   _val = (' ');
                    //
                    //   // _input.focus();
                    //
                    //   // scope.$apply();
                    // }
                    // _input.trigger('change');
                    _input.controller('ngModel').$setViewValue(_val);
                    // _input.trigger('input');
                    // _input.trigger('change');
                    scope.$digest;
                    _input.controller('ngModel').$setViewValue(_oldVal);
                };

                element.find('button').click(clickHandler);
                _input.click(clickHandler);
            },
            controller: function () {
                // this.datePickerOptions =
            },
            controllerAs: controllerName
        };
    }
})();
