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
            templateUrl: 'lets/views/framework/chart.html',
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
