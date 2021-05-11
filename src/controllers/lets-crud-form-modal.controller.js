(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDFormModalController', function ($controller, $scope, $modalInstance, headers, Restangular, $rootScope, data, fwErrorService) {
        $controller('CRUDEditController', { $scope: $scope, module:module });

        $scope.data = data || {};
        $scope.headers = headers;
        $scope.resource = Restangular.all(headers.route);

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
        
        $scope.submit = function () {

            // Validade Form
            if (!this.crudForm.$valid) {
                return false;
            }

            function nextBefore(){
                $modalInstance.close($scope.data);

                function nextAfter(){}
                $scope.$emit('after save', nextAfter, $scope.data);
                if (!$scope.$$listeners["after save"]){
                    nextAfter();
                }
            }

            $scope.$emit('before save', nextBefore);
            if (!$scope.$$listeners["before save"]){
                nextBefore();
            }

        };

        $rootScope.$on('cancel-modal', function (event, res) {
            $modalInstance.dismiss('cancel');
        });

        var parentScope = headers.parentScope;
        delete headers.parentScope;
        if(headers.modal_id){
            $rootScope.$emit('open:'+headers.modal_id+'', $scope); // @deprecated 

            if (parentScope){
                parentScope.$emit('open:'+headers.modal_id+'', $scope);
            }
        }

        $scope.fetchData();

    });

})();