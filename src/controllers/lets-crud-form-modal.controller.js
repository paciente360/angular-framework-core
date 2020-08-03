(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDFormModalController', function ($controller, $scope, $modalInstance, headers, Restangular, $rootScope, data, fwErrorService) {
        $controller('CRUDEditController', { $scope: $scope, module:module });

        $scope.data = data || {};
        $scope.headers = headers;
        $scope.resource = Restangular.all(headers.route);

        var parentScope = headers.parentScope;
        delete headers.parentScope;
        if(headers.modal_id){
            $rootScope.$emit('open:'+headers.modal_id+'', $scope); // @deprecated 

            if (parentScope){
                parentScope.$emit('open:'+headers.modal_id+'', $scope);
            }
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
        
        $scope.submit = function () {
            if (this.crudForm.$valid) {
                $modalInstance.close($scope.data);
            }
        };

        $rootScope.$on('cancel-modal', function (event, res) {
            $modalInstance.dismiss('cancel');
        });

        $scope.fetchData();

    });

})();