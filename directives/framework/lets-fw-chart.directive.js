/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Chart Directive
*
* File:        directives/framework/lets-fw-chart.directive.js
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
        .directive('fwChart', fwChart);

    fwChart.$inject = ['fwChartService', 'fwComparatorService', '$rootScope'];

    function fwChart(fwChartService, fwComparatorService, $rootScope) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                crudChartSettings: '&',
                crudChartData: '&'
            },
            templateUrl: 'views/framework/chart.html',
            // compile: function (el, attr) {
            //     return {
            //         pre: function (scope, el, attr, controller, transcludeFn) {
            //             var crudChartSettings = scope.crudChartSettings();
            //             var crudChartData = scope.crudChartData();
            //
            //             scope.key = crudChartSettings.key;
            //
            //             scope.d3chartConfig = fwChartService.configD3chart('line', ['#092e64']);
            //             scope.d3chartData = fwChartService.configD3chartData(crudChartSettings.fillArea, crudChartSettings.key, crudChartData);
            //
            //         }
            //     }
            // },
            controller: function ($scope) {
                var crudChartSettings = $scope.crudChartSettings();
                var chartLimitSettings = crudChartSettings.chart_settings;
                var crudChartData = $scope.crudChartData();

                $scope.key = crudChartSettings.key;
                $scope.d3chartUpdate = false;

                var minMaxValues = fwComparatorService.getMinMaxValues(chartLimitSettings.xType, chartLimitSettings.xLabel, chartLimitSettings.xOffset, chartLimitSettings.yType, chartLimitSettings.yLabel, chartLimitSettings.yOffset, crudChartData)
                var limits = { x: [minMaxValues.min.x, minMaxValues.max.x], y: [minMaxValues.min.y, minMaxValues.max.y] };

                $scope.d3chartStartDate = minMaxValues.min.x;
                $scope.d3chartEndDate = minMaxValues.max.x;

                $scope.d3chartConfig = fwChartService.configD3chart('line', ['#092e64'], limits);
                $scope.d3chartData = fwChartService.configD3chartData(crudChartSettings.fillArea || false, crudChartSettings.key, crudChartData);

                $scope.$watch('d3chartStartDate', function(newValue, oldValue) {
                    minMaxValues.min.x = newValue;
                    limits = { x: [minMaxValues.min.x, minMaxValues.max.x], y: [minMaxValues.min.y, minMaxValues.max.y] };
                    $scope.d3chartConfig = fwChartService.configD3chart('line', ['#092e64'], limits);
                    if (newValue != oldValue) $rootScope.$broadcast('update-chart', { type: 'filter' });
                });

                $scope.$watch('d3chartEndDate', function(newValue, oldValue) {
                    minMaxValues.max.x = newValue;
                    limits = { x: [minMaxValues.min.x, minMaxValues.max.x], y: [minMaxValues.min.y, minMaxValues.max.y] };
                    $scope.d3chartConfig = fwChartService.configD3chart('line', ['#092e64'], limits);
                    if (newValue != oldValue) $rootScope.$broadcast('update-chart', { type: 'filter' });
                });

            },
            link: function (scope, $el, attrs, ctrls, transclude) {
                scope.$el = $el;
            }
        }
    }
})();
