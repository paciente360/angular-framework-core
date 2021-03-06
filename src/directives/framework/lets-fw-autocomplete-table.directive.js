(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwAutoCompleteTable', fwAutoCompleteTable);

    fwAutoCompleteTable.$inject = ['$compile', '$rootScope', '$http', '$timeout'];

    function fwAutoCompleteTable($compile, $rootScope, $http, $timeout) {
        var controllerName = 'vm';
        return {
            restrict: 'A',
            priority: 1,
            link: function (scope, element) {
                var $scope = scope;
                $scope.tableSelected = function (event, table_name, dataFront) {

                    $scope.tableVisibily = false;

                    var elName = event.currentTarget.firstElementChild.firstChild.data.trim();
                    // add data to create

                    $scope.data[table_name] = dataFront.id;
                    // Adaptação técnica para escopo #558
                    $scope.data[table_name + '.labelCopy'] = { id: dataFront.id, label: elName };
                    $scope.data[table_name + '.label'] = elName;

                };
                $scope.loadDataAutoCompleteTable = function (table_name, search_field) {

                    //fazer a requisição para a API - /api/medicamentos
                    // /api/medicamentos?filter={"limit":5, "where": {"nome_apresentacao": {"regexp": "/^AM/"}}}

                    var input = element.find(':input').val().split(" ");

                    // init regex
                    var regex = "/^(" + input[0] + ")";

                    //remove index 0
                    input.splice(0, 1)

                    // Operator AND
                    input.forEach(function (element) {
                        regex += "(?=.*" + element + ")";
                    })

                    // insensitive case
                    regex += ".*/i";

                    var filter = '{"limit": 5,"where":{"' + search_field + '":{"regexp":"' + regex + '"}}}';

                    var route = $rootScope.appSettings.API_URL + table_name + '?filter=' + filter;

                    var route_crudGET = $rootScope.appSettings.API_URL + table_name + '/crudGET/';

                    //console.log($rootScope.appSettings.API_URL)

                    $http.get(route).then(function (response) {

                        $scope.autoCompleteTableData2 = [];

                        response.data.forEach(function (element) {

                            $http.get(route_crudGET + element.id).then(function (CGresponse) {

                                $scope.autoCompleteTableData2.push(CGresponse.data);

                            })

                        });

                    });

                }
            },
            controller: function ($scope) {
                $scope.autoCompleteTableFocus = function (table_name) {
                    $scope.tableVisibily = true;
                };
                $scope.autoCompleteTableLostFocus = function () {
                    setTimeout(function () {
                        $scope.$apply(function () {

                            $scope.tableVisibily = false;

                        });
                    }, 100);
                };
                $scope.updateAutoCompleteTable = function (table_name, search_field) {
                    $scope.loadDataAutoCompleteTable(table_name, search_field);
                }
            },
            controllerAs: controllerName
        };
    }
})();
