(function () {
    'use strict';

    angular.module('letsAngular')
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
                    '<button type="button" class="btn btn-default bcalendar" ng-click="' + controllerName + '.openPopup($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
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
                setAttributeIfNotExists('show-button-bar', false);
                setAttributeIfNotExists('show-weeks', false);
                setAttributeIfNotExists('datepicker-options', 'datepickerOptions');

                element.addClass('form-control');
                element.removeAttr('fw-date-picker');
                element.after(wrapper);
                wrapper.prepend(element);

                return function (scope, element) {
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
                            scope.field.error = true;
                        } else {
                            scope.field.error = false;
                        }
                    });


                    element.find('input').click(function (e) {
                        element.find('button.bcalendar').click()
                        // scope.vm.openPopup(e);
                    });

                    scope.datepickerOptions = options;

                    $compile(element)(scope);
                };
            },
            controller: function ($scope) {
                this.popupOpen = false;
                
                this.openPopup = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    this.popupOpen = true;
                };
            },
            controllerAs: controllerName
        };
    }
})();
