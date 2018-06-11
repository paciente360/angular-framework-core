/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Upload Directive
*
* File:        directives/framework/lets-fw-upload.directive.js
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
        .directive('fwUpload', fwUpload);

    fwUpload.$inject = ['$timeout'];

    function fwUpload($timeout) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, element) {

                $scope.defaultProgress = 0;
                $scope.alreadySent = false;

                $timeout(function () { // replace this by $scope.$on('data-loaded')
                    if ($scope.data[$scope.field.name] != undefined && $scope.data[$scope.field.name] != null) {
                        $scope.defaultProgress = 100;
                        $scope.alreadySent = true;
                    }
                }, 200);

                $scope.upload = function (file, errFiles) {
                    $scope.f = file;
                    $scope.errFile = errFiles && errFiles[0];

                    if (file) {
                        file.upload = $scope._upload($scope.field, file);

                        file.upload.then(function (response) {
                            $timeout(function () {
                                file.result = response.data;
                                var _input = element.find('input[type="hidden"]');

                                _input.controller('ngModel').$setViewValue(file.name);
                                if (!response.data.file) response.data.file = { name: response.data.result.files.file[0].name } // Multiple file upload case
                                _input.scope().data[_input.scope().field.customOptions.file[0]] = response.data.file.name;
                            });
                        }, function (response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });
                    }
                };

                // element.click(function(e) {
                //
                //
                //   element.find('input[type="file"]').click();
                //
                //   console.log('tango');
                // });
                //
                //
                //
                // element.find('input[type="file"]').click(function(e) {
                //   e.stopPropagation();
                // }).change(function() {
                //   element.find('input[name="temp_filename"]').val(this.files[0].name);
                //
                //   scope.upload(this.files[0]);
                // })
            }
        }
    }
})();
