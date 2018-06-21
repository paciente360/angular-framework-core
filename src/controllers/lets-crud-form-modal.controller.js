(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDFormModalController', function ($controller, $scope, $modalInstance, ngToast, headers, Restangular, $stateParams, $timeout, $state, $rootScope, $q, $http, Upload, $modal, data, fwStringService, auth, fwObjectService, fwErrorService) {
        $controller('CRUDEditController', { $scope: $scope, Restangular: Restangular, $stateParams: $stateParams, $timeout: $timeout, $modal: $modal, module: module, $state: $state, $rootScope: $rootScope, $q: $q, ngToast: ngToast, $http: $http, Upload: Upload });

        $scope.data = data || {};
        $scope.headers = headers;

        $scope.resource = Restangular.all(headers.route);

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
        
        $scope.submit = function () {
            if (this.crudForm.$valid) {
                $modalInstance.close($scope.data);
            } else {
                fwErrorService.emitFormErrors(this.crudForm)
            }
        };

        $rootScope.$on('cancel-modal', function (event, res) {
            $modalInstance.dismiss('cancel');
        });

    });

})();