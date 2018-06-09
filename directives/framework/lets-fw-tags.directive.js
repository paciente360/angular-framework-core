/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Tags Directive
*
* File:        directives/framework/lets-fw-tags.directive.js
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
        .directive('fwTags', fwTags);

    fwTags.$inject = [];

    function fwTags() {
        return {
            restrict: 'E',
            scope: {
                tags: '=',
                // autocomplete: '=autocomplete'
            },
            template:

            '<div class="input-group fw-input-group"><input type="text" class="form-control" placeholder="add a tag..." ng-model="newValue" /> ' +
            '<span class="input-group-btn"><a class="btn btn-default" ng-click="add()">Add</a></span></div>' +
            '<div class="tags">' +
            '<div ng-repeat="(idx, tag) in tags" class="tag label label-success">{{tag}} <a class="close" href ng-click="remove(idx)">×</a></div>' +
            '</div>',
            link: function ($scope, $element) {
                // $scope.tags = [];

                // $scope.tags = $element.attr('tags');

                if ($scope.tags == null) {
                    $scope.tags = [];
                }

                var input = angular.element($element).find('input');

                // setup autocomplete
                if ($scope.autocomplete) {
                    // $scope.autocompleteFocus = function (event, ui) {
                    //     input.val(ui.item.value);
                    //     return false;
                    // };
                    // $scope.autocompleteSelect = function (event, ui) {
                    //     $scope.newValue = ui.item.value;
                    //     $scope.$apply($scope.add);

                    //     return false;
                    // };
                    // $($element).find('input').autocomplete({
                    //     minLength: 0,
                    //     source: function (request, response) {
                    //         var item;
                    //         return response((function () {
                    //             var _i, _len, _ref, _results;
                    //             _ref = $scope.autocomplete;
                    //             _results = [];
                    //             for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    //                 item = _ref[_i];
                    //                 if (item.toLowerCase().indexOf(request.term.toLowerCase()) !== -1) {
                    //                     _results.push(item);
                    //                 }
                    //             }
                    //             return _results;
                    //         })());
                    //     },
                    //     focus: (function (_this) {
                    //         return function (event, ui) {
                    //             return $scope.autocompleteFocus(event, ui);
                    //         };
                    //     })(this),
                    //     select: (function (_this) {
                    //         return function (event, ui) {
                    //             return $scope.autocompleteSelect(event, ui);
                    //         };
                    //     })(this)
                    // });
                }


                // adds the new tag to the array
                $scope.add = function () {
                    // if not dupe, add it
                    if ($scope.tags.indexOf($scope.newValue) == -1) {
                        $scope.tags.push($scope.newValue);
                    }
                    $scope.newValue = "";
                };

                // remove an item
                $scope.remove = function (idx) {
                    $scope.tags.splice(idx, 1);
                };

                // capture keypresses
                input.bind('keypress', function (event) {

                    // enter was pressed
                    if (event.keyCode == 13) {
                        event.stopPropagation();
                        event.preventDefault();
                        $scope.$apply($scope.add);
                    }
                });
            }
        };
    };
})();
