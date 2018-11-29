(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDFormModalController', function ($controller, $scope, $modalInstance, ngToast, headers, Restangular, $stateParams, $timeout, $state, $rootScope, $q, $http, Upload, $modal, data, fwStringService, auth, fwObjectService, fwErrorService) {
        $controller('CRUDEditController', { $scope: $scope, Restangular: Restangular, $stateParams: $stateParams, $timeout: $timeout, $modal: $modal, module: module, $state: $state, $rootScope: $rootScope, $q: $q, ngToast: ngToast, $http: $http, Upload: Upload });

        $scope.data = data || {};
        $scope.headers = headers;

        $scope.resource = Restangular.all(headers.route);

        for (var y in $scope.headers.fields) {
            var field = $scope.headers.fields[y];
            if (field.type == 'boolean' && $scope.data[field.name]==undefined) {
                if (field.customOptions.default){
                    $scope.data[field.name] = true;
                }else{
                    $scope.data[field.name] = false;
                }
            }
        }

        if(headers.modal_id){
            $rootScope.$emit('open:'+headers.modal_id+'', $scope);
        }

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
        
        $timeout(function(){
            $scope.$broadcast('setProgressFile');
        });


    });

})();