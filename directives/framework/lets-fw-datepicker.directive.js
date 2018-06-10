/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Date Picker Directive
*
* File:        directives/framework/lets-fw-datepicker.directive.js
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
        .directive('fwDatePicker', fwDatePicker);

    fwDatePicker.$inject = ['$compile', 'jQuery'];

    function fwDatePicker($compile, jQuery) {
        var controllerName = 'vm';
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: true,
            terminal: true,
            priority: 1,
            compile: function (element, attrs) {

                var wrapper = angular.element(
                    '<div class="input-group">' +
                    '<span class="input-group-btn">' +
                    '<button type="button" class="btn btn-default" ng-click="' + controllerName + '.openPopup($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
                    '</span>' +
                    '</div>');

                function setAttributeIfNotExists(name, value) {
                    var oldValue = element.attr(name);
                    if (!angular.isDefined(oldValue) || oldValue === false) {
                        element.attr(name, value);
                    }
                }



                setAttributeIfNotExists('type', 'text');
                setAttributeIfNotExists('is-open', controllerName + '.popupOpen');
                // setAttributeIfNotExists('datepicker-popup', 'MM/yyyy');
                setAttributeIfNotExists('show-button-bar', false);
                setAttributeIfNotExists('show-weeks', false);
                setAttributeIfNotExists('datepicker-options', 'datepickerOptions');

                // setAttributeIfNotExists('datepicker-options', { 'datepickerMode': "'month'",
                //   'minMode': 'month'});

                // setAttributeIfNotExists('close-text', 'Schließen');
                // setAttributeIfNotExists('clear-text', 'Löschen');
                // setAttributeIfNotExists('current-text', 'Heute');

                element.addClass('form-control');
                element.removeAttr('fw-date-picker');
                element.after(wrapper);
                wrapper.prepend(element);

                return function (scope, element) {
                    // console.log('left');

                    var options = {

                    };

                    if (scope.data === undefined) scope.data = {};

                    if (!scope.field) {
                        scope.field = { customOptions: [] };
                        if (attrs.fwDatePickerNgModelParent) {
                            options.initDate = new Date(scope.$parent[attrs.ngModel]);
                            scope.$parent[attrs.ngModel] = angular.copy(options.initDate);
                        } else {
                            options.initDate = new Date(scope[attrs.ngModel]);
                            scope[attrs.ngModel] = angular.copy(options.initDate);
                        }
                    }

                    else if (scope.data[scope.field.name] != null) {
                        options.initDate = new Date(scope.data[scope.field.name]);
                        scope.data[scope.field.name] = angular.copy(options.initDate);
                    }

                    var format = 'dd/MM/yyyy';

                    if (scope.field.customOptions.monthpicker !== undefined) {
                        options.datepickerMode = "'month'";
                        options.minMode = 'month';

                        format = 'MM/yyyy';
                    }

                    element.find('input').attr('datepicker-popup', format);

                    element.find('input').blur(function () {
                        if (!moment(this.value, format).isValid() && this.value !== '') {
                            // console.log('esta errado aqui');
                            // debugger;
                            scope.field.error = true;
                        } else {
                            scope.field.error = false;
                        }
                    });

                    scope.datepickerOptions = options;

                    // if (scope.data.disabled) jQuery('.input-group-btn').remove();

                    $compile(element)(scope);
                };
            },
            controller: function ($scope) {
                // this.datePickerOptions =

                // debugger;
                this.popupOpen = false;
                // console.log('down');
                this.openPopup = function ($event) {
                    // console.log('tango');
                    $event.preventDefault();
                    $event.stopPropagation();
                    this.popupOpen = true;
                };
            },
            controllerAs: controllerName
        };
    }
})();
