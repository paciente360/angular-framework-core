/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud Form Modal Controller
*
* File:        controllers/lets-crud-form-modal.controller.js
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

    var module = angular.module('letsAngular.crud');

    module.controller('CRUDFormModalController', function ($controller, $scope, $modalInstance, ngToast, headers, Restangular, $stateParams, $timeout, $state, $rootScope, $q, $http, Upload, $modal, parentModel, autocompleteDetail, data, fwStringService, auth, fwObjectService, fwErrorService) {
        $controller('CRUDEditController', { $scope: $scope, Restangular: Restangular, $stateParams: $stateParams, $timeout: $timeout, $modal: $modal, module: module, $state: $state, $rootScope: $rootScope, $q: $q, ngToast: ngToast, $http: $http, Upload: Upload });

        $scope.data = data || {};
        $scope.data.emp_id = auth.getUser().emp_id;
        headers.modal_tab = true;
        $scope.headers = headers;
        $scope.acdetail = autocompleteDetail;

        parentModel = fwStringService.lemmatize(parentModel);
        $scope.resource = Restangular.all(parentModel);

        $scope.cancel = function () {
            if ($scope.data.disabled !== undefined) data.disabled = true;
            $modalInstance.dismiss('cancel');
        }
        $scope.submit = function () {
            if (this.crudForm.$valid) {
                $modalInstance.close($scope.data);
            } else {
                fwErrorService.emitFormErrors(this.crudForm)
            }
        };
        $scope.$on('selected-autocomplete', function (event, res) {
            
        });
        $rootScope.$on('cancel-modal', function (event, res) {
            $modalInstance.dismiss('cancel');
        });

    });

})();