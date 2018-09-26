(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDController', function ($scope, Restangular, module, $state, $window, $stateParams, $rootScope, headers) {
        $scope.headersReady = false;

        function getHeaders() {
            var data = angular.copy(headers.get(module));
            $scope.headers = data;
        }

        getHeaders();

        $scope.$on('refresh-headers', function () {
            getHeaders();
        })

        $scope.resource = Restangular.all($scope.headers.route);

        $scope.$broadcast('headers-set');
        $scope.headersReady = true;

        $scope.getFilter = function(){
            return decodeURIComponent($window.location.search).replace("?filter=","");
        }

        $scope.goNew = function () {
            $state.go($state.current.name.replace('.list', '.new'), {filter:$scope.getFilter()});
        };

        $scope.goToList = function () {
            if ($state.current.name.indexOf('.list') == -1) {
                $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'), {filter:$scope.getFilter()});
            }
        };

        $scope.edit = function (row) {
            $state.go($state.current.name.replace(/\.list$/, '.edit'), { id: row.id, page: null, filter:$scope.getFilter()});
        };

        $scope.delete = function (row) {
            return $scope.resource.customDELETE(row.id).then(function () {
                $rootScope.$broadcast('refreshGRID');
            });
        };
    });

})();