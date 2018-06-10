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

    angular.module('letsAngular.crud')
        .directive('crudForm', crudForm);

    crudForm.$inject = ['jQuery', '$timeout', 'fwModalService'];

    function crudForm(jQuery, $timeout, fwModalService) {
        return {
            replace: false,
            link: function (scope, $el) {
                // var internalCounter = -1;

                // if(scope.$parent.headers !== undefined) scope.headers = angular.copy(scope.$parent.headers);

                // var newFields = [];

                // scope.$parent.$watch('headers.fields', function() {
                //     console.log(arguments);
                // })

                // $timeout(function () {
                //     _.each(scope.headers.fields, function (field, key) {
                //         newFields.push(field);
                //         if (field.type == 'password') {
                //             var newField = angular.copy(field);
                //             newField.name = 'confirm_' + field.name;
                //             newField.label = 'Confirmar ' + field.label;
                //             newFields.push(newField);
                //         }
                //     });

                //     scope.headers.fields = newFields;
                // }, 500);

                jQuery($el).on('click', '.button-new', function () {
                    var detail = jQuery(this).attr('detail');
                    var origin = jQuery(this).attr('origin');
                    // var _new = {};
                    //
                    // var fields = scope.headers[origin][detail].fields;
                    //
                    // for (var x in fields) {
                    //   if (fields[x].type != 'boolean') {
                    //     _new[fields[x].name] = null;
                    //   } else {
                    //     _new[fields[x].name] = false;
                    //   }
                    // }

                    // _new.new = true;

                    // _new['ppho_id'] = internalCounter--;

                    // console.log(_new);
                    if (scope.data[detail] == undefined) {
                        scope.data[detail] = [];
                    }

                    var headers = scope.headers[origin][detail];
                    var parentModel = scope.headers.route.toLowerCase();
                    var autocompleteDetail = true;

                    if (headers.autocompleteDetail !== undefined) autocompleteDetail = headers.autocompleteDetail;

                    fwModalService.createCRUDModal(headers, parentModel, null, autocompleteDetail)
                        .then(function (response) {
                            response.new = true;
                            response.disabled = true;
                            scope.data[detail].push(response);
                        });

                });


                // debugger;
                $timeout(function () {
                    // debugger;
                    $el.find('.tab-group .nav-tabs li:first').find('a').click();
                    $el.find(':input[type!="hidden"]:first').focus();

                    // ,
                    // post: function postLink(scope, $el, attrs, controller) {
                    // debugger;
                    // $timeout(function() {

                    // }, 500);

                    // }
                }, 500);


                $($el).parsley({
                    priorityEnabled: false,
                    errorsContainer: function (el) {
                        return el.$element.closest(".input-container");
                    }
                });

                // data-ui-jq="parsley" data-parsley-errors-container=".input-container" data-parsley-priority-enabled="false"
            }
        }
    }
})();
