(function () {
    'use strict';
    angular
        .module('letsAngular')
        .service('fwChartService', fwChartService);
  
    fwChartService.inject = [];
  
    function fwChartService() {
  
        var self = this;
    
        self.configD3chart = function (type, colors, limits) {
            var _config = null;
            var _margins = {left: 40, bottom: 28, right: 28, top: 28};
    
            if (!limits) {
            limits = { x: [], y: [0, 150] };
            }
    
            if (type === 'multibar') {
            _config = nv.models.multiBarChart()
                // .useInteractiveGuideline(true)
                .margin(_margins)
                .color(colors)
                .yDomain(limits.y);
            } else {
            _config = nv.models.lineChart()
                // .useInteractiveGuideline(true)
                .margin(_margins)
                .color(colors)
                .xDomain(limits.x)
                .yDomain(limits.y);
            }
    
            _config.xAxis
            .showMaxMin(false)
            .tickFormat(function(d) { return d3.time.format('%d/%m/%y')(new Date(d)); });
            _config.xScale(d3.time.scale());
            _config.yAxis
            .showMaxMin(false)
            .tickFormat(d3.format(',f'));
    
            _config.tooltip.enabled(false);
    
            return _config;
        };
        self.configD3chartData = function (areaStatus, key, data) {
            var _values = [];
    
            data.forEach(function (_data) {
            var _value = {
                x: new Date(moment(_data.data).format('MM/DD/YYYY')),
                y: _data.valor
            };
            _values.push(_value);
            });
    
            return [{
            area: areaStatus,
            key: key,
            values: _values
            }];
        };
        self.getMockD3chartsData = function (areaStatus) {
            if (!areaStatus) areaStatus = false;
            return {
            glicemiaCapilar: [
                {
                area: areaStatus,
                key: "Valor",
                values: [
                    { x: new Date('06/10/2017').getTime(), y: 77 },
                    { x: new Date('06/17/2017').getTime(), y: 70 },
                    { x: new Date('07/01/2017').getTime(), y: 121 },
                    { x: new Date('07/08/2017').getTime(), y: 84 },
                    { x: new Date('07/15/2017').getTime(), y: 75 },
                    { x: new Date('07/22/2017').getTime(), y: 80 },
                    { x: new Date('07/29/2017').getTime(), y: 76 },
                    { x: new Date('08/05/2017').getTime(), y: 120 },
                    { x: new Date('08/12/2017').getTime(), y: 77 },
                    { x: new Date('08/19/2017').getTime(), y: 85 }
                ]
                }
            ],
            pressao: [
            {
                area: areaStatus,
                key: "Sistólica",
                values: [
                { x: new Date('06/10/2017').getTime(), y: 125 },
                { x: new Date('06/17/2017').getTime(), y: 139 },
                { x: new Date('07/01/2017').getTime(), y: 129 },
                { x: new Date('07/08/2017').getTime(), y: 133 },
                { x: new Date('07/15/2017').getTime(), y: 134 },
                { x: new Date('07/22/2017').getTime(), y: 133 },
                { x: new Date('07/29/2017').getTime(), y: 143 },
                { x: new Date('08/05/2017').getTime(), y: 148 },
                { x: new Date('08/12/2017').getTime(), y: 139 },
                { x: new Date('08/19/2017').getTime(), y: 134 }
                ]
            },
            {
                area: areaStatus,
                key: "Diastólica",
                values: [
                { x: new Date('06/10/2017').getTime(), y: 78 },
                { x: new Date('06/17/2017').getTime(), y: 75 },
                { x: new Date('07/01/2017').getTime(), y: 83 },
                { x: new Date('07/08/2017').getTime(), y: 80 },
                { x: new Date('07/15/2017').getTime(), y: 77 },
                { x: new Date('07/22/2017').getTime(), y: 79 },
                { x: new Date('07/29/2017').getTime(), y: 83 },
                { x: new Date('08/05/2017').getTime(), y: 81 },
                { x: new Date('08/12/2017').getTime(), y: 74 },
                { x: new Date('08/19/2017').getTime(), y: 81 }
                ]
            }
            ],
            peso: [
            {
                area: areaStatus,
                key: "Quilos",
                values: [
                { x: new Date('06/10/2017').getTime(), y: 89 },
                { x: new Date('06/17/2017').getTime(), y: 90 },
                { x: new Date('07/01/2017').getTime(), y: 89 },
                { x: new Date('07/08/2017').getTime(), y: 92 },
                { x: new Date('07/15/2017').getTime(), y: 93 },
                { x: new Date('07/22/2017').getTime(), y: 94 },
                { x: new Date('07/29/2017').getTime(), y: 93 },
                { x: new Date('08/05/2017').getTime(), y: 93 },
                { x: new Date('08/12/2017').getTime(), y: 93 },
                { x: new Date('08/19/2017').getTime(), y: 92 }
                ]
            }
            ],
            altura: [
            {
                area: areaStatus,
                key: "Metros",
                values: [
                { x: new Date('06/10/2017').getTime(), y: 1.76 },
                { x: new Date('06/17/2017').getTime(), y: 1.76 },
                { x: new Date('07/01/2017').getTime(), y: 1.76 },
                { x: new Date('07/08/2017').getTime(), y: 1.76 },
                { x: new Date('07/15/2017').getTime(), y: 1.76 },
                { x: new Date('07/22/2017').getTime(), y: 1.76 },
                { x: new Date('07/29/2017').getTime(), y: 1.76 },
                { x: new Date('08/05/2017').getTime(), y: 1.76 },
                { x: new Date('08/12/2017').getTime(), y: 1.76 },
                { x: new Date('08/19/2017').getTime(), y: 1.76 }
                ]
            }
            ],
            imc: [
            {
                area: areaStatus,
                key: "Valor",
                values: [
                { x: new Date('06/10/2017').getTime(), y: 15.3 },
                { x: new Date('06/17/2017').getTime(), y: 15.5 },
                { x: new Date('07/01/2017').getTime(), y: 15.3 },
                { x: new Date('07/08/2017').getTime(), y: 15.8 },
                { x: new Date('07/15/2017').getTime(), y: 16.0 },
                { x: new Date('07/22/2017').getTime(), y: 16.2 },
                { x: new Date('07/29/2017').getTime(), y: 16.0 },
                { x: new Date('08/05/2017').getTime(), y: 16.0 },
                { x: new Date('08/12/2017').getTime(), y: 16.0 },
                { x: new Date('08/19/2017').getTime(), y: 15.8 }
                ]
            }
            ],
            hdlLdl: [
                {
                area: areaStatus,
                key: "HDL",
                values: [
                    { x: new Date('06/10/2017').getTime(), y: 43 },
                    { x: new Date('06/17/2017').getTime(), y: 41 },
                    { x: new Date('07/01/2017').getTime(), y: 42 },
                    { x: new Date('07/08/2017').getTime(), y: 45 },
                    { x: new Date('07/15/2017').getTime(), y: 46 },
                    { x: new Date('07/22/2017').getTime(), y: 48 },
                    { x: new Date('07/29/2017').getTime(), y: 44 },
                    { x: new Date('08/05/2017').getTime(), y: 41 },
                    { x: new Date('08/12/2017').getTime(), y: 42 },
                    { x: new Date('08/19/2017').getTime(), y: 40 }
                ]
                },
                {
                area: areaStatus,
                key: "LDL",
                values: [
                    { x: new Date('06/10/2017').getTime(), y: 121 },
                    { x: new Date('06/17/2017').getTime(), y: 130 },
                    { x: new Date('07/01/2017').getTime(), y: 137 },
                    { x: new Date('07/08/2017').getTime(), y: 138 },
                    { x: new Date('07/15/2017').getTime(), y: 120 },
                    { x: new Date('07/22/2017').getTime(), y: 122 },
                    { x: new Date('07/29/2017').getTime(), y: 123 },
                    { x: new Date('08/05/2017').getTime(), y: 124 },
                    { x: new Date('08/12/2017').getTime(), y: 122 },
                    { x: new Date('08/19/2017').getTime(), y: 120 }
                ]
                }
            ]
            };
        };
        self.getMockD3chartsConfig = function () {
            return {
            glicemiaCapilar: self.configD3chart('line', ['#092e64'], { x: [new Date('06/10/2017'), new Date('08/09/2017')], y: [50, 130] }),
            pressao: self.configD3chart('line', ['#092e64', '#008df5'], { x: [new Date('06/10/2017'), new Date('08/09/2017')], y: [50, 150] }),
            peso: self.configD3chart('line', ['#092e64'], { x: [new Date('06/10/2017'), new Date('08/09/2017')], y: [80, 100] }),
            altura: self.configD3chart('line', ['#092e64'], { x: [new Date('06/10/2017'), new Date('08/09/2017')], y: [0, 2] }),
            imc: self.configD3chart('line', ['#092e64'], { x: [new Date('06/10/2017'), new Date('08/09/2017')], y: [12, 20] }),
            hdlLdl: self.configD3chart('line', ['#092e64', '#008df5'], { x: [new Date('06/10/2017'), new Date('08/09/2017')], y: [30, 150] })
            };
        };
    
        return {
            getMockD3chartsData: self.getMockD3chartsData,
            getMockD3chartsConfig: self.getMockD3chartsConfig,
            configD3chart: self.configD3chart,
            configD3chartData: self.configD3chartData
        };
  
    }
  
})();
  