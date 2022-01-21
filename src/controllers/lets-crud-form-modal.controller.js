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
        
        $scope.submit = function ($this) {
            var _data = $scope.data;

            // Validade Form
            if (!$this.crudForm.$valid) {
                return false;
            }

            if($scope.data._edit){
                var typeSave = "edit";
            }else{
                var typeSave = "new";
            }

            _.each($scope.headers.fields, function (field, key) {
                field.error = undefined;

                // Number null
                if(!_data[field.name] && _data[field.name] != 0 && !field.notnull && field.type === 'number'){
                    _data[field.name] = null;
                }

                // Invalid Autocomplete
                if (field.autocomplete && _data[field.name+".label"] && "object"!==typeof(_data[field.name+".label"]) ){
                    field.error="Campo inválido, selecione novamente.";
                    $this.crudForm.$valid = false;
                }

            });

            // Validade Form
            if (!$this.crudForm.$valid) {
                return false;
            }

            function nextBefore(){
                $modalInstance.close($scope.data);

                function nextAfter(){}
                $scope.$emit('after save', nextAfter, $scope.data, typeSave);
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