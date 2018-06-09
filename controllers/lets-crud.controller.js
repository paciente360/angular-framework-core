/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud Controller
*
* File:        controllers/lets-crud.controller.js
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

    module.controller('CRUDController', function ($scope, Restangular, module, $state, $window, $stateParams, $rootScope, headers) {
        $scope.headersReady = false;

        // if ($window.localStorage.getItem('controllerHeaders') == undefined) {
        //   var controllerHeaders = {};
        // }
        // else {
        //   var controllerHeaders = JSON.parse($window.localStorage.getItem('controllerHeaders'));
        // }

        // if (controllerHeaders[module] == undefined) {
        // debugger;
        // console.log('312',headers.get(module));
        // $scope.resource.customGET('headers').then(function (data) {
        // console.log('module',module);
        var data = headers.get(module);
        $scope.headers = data;
        // console.log(data);

        $scope.resource = Restangular.all(data.route);
        // controllerHeaders[module] = data;

        // $window.localStorage.setItem('controllerHeaders', JSON.stringify(controllerHeaders));

        $scope.$broadcast('headers-set');
        $scope.headersReady = true;
        // });
        // }
        // else {
        //   $scope.headers = controllerHeaders[module];
        //   $scope.$broadcast('headers-set');
        //   $scope.headersReady = true;
        // }

        $scope.goNew = function () {
            $state.go($state.current.name.replace('.list', '.new'));
        };

        $scope.goToList = function () {
            if ($state.current.name.indexOf('.list') == -1) {
                $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'));
            }
        };

        $scope.edit = function (row) {
            $state.go($state.current.name.replace(/\.list$/, '.edit'), { id: row.id, page: null });
        };

        $scope.delete = function (row) {
            // console.log(row);
            return $scope.resource.customDELETE(row.id).then(function () {
                $rootScope.$broadcast('refreshGRID');
            });
            // row.remove().then(function() {
            //   $scope.refresh();
            // });
        };
    });

})();