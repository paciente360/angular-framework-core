(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwMultiSelect', fwMultiSelect);

    fwMultiSelect.$inject = ['$compile', '$timeout', 'Restangular', '$state'];

    function fwMultiSelect($compile, $timeout, Restangular) {
        return {
            restrict: 'A',
            priority: 1,
            link: function (scope, element) {

                scope.dataReference = $(element)

                // var _input = element.find('input');

                // var clickHandler = function () {
                //     var _oldVal = _input.val();
                //     var _val = _oldVal + ' ';
                //     _input.controller('ngModel').$setViewValue(_val);
                //     // scope.$digest;
                //     $timeout(function(){
                //         _input.controller('ngModel').$setViewValue(_oldVal);
                //     });
                // };

                // element.find('button').click(clickHandler);
                // _input.click(clickHandler);

                // _input.keyup(function(){
                //     if (this.value.trim()==""){
                //         _input.scope().data[_input.attr('name')] = null;
                //     }
                // })
                
                

            },
            controller: function ($scope, $state) {
                /*Multiselect*/ 
                $scope.initMultiSelect = false;
                $scope.msmodel = [];
                $scope.filter = {};
                $scope.msdata = [];
                $scope.setting = {}
                var field = ''

                $scope.$on('filter-init', function(scope){
                    var data = scope.targetScope.data || undefined
                    var filter = $($scope.dataReference).attr('data-reference') || undefined
                    field = filter
                    
                    if(filter && data){
                        $scope.msmodel = angular.copy(data[filter]) || []
                    }
                })

                // Eventos da biblioteca 'angularjs-dropdown-multiselect'

                $scope.changedMultiSelect = function (a) {
                    if ($scope.msmodel.length) {
                        angular.element('.fw-multiselect-button').css('color', '#555555')
                    } else {
                        angular.element('.fw-multiselect-button').css('color', '#CCC')
                    }
                }

                $scope.onItemSelect = function (item, $event) {
                    
                    $scope.data[field] = $scope.msmodel
                    var _label = $scope.msdata.find(function (_item) {
                        return _item.id ==  item.id
                    })
                    item.label = _label.label
                }

                $scope.onItemDeselect = function (item) {

                }

                // Fim dos eventos

                $scope.removeDuplicates= function (a, param){
                    return a.filter(function(item, pos, array){
                        return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
                    })
                }

                $scope.makeRequestAutocomplete = function (scope, value, route, isGeneral) {
                    $timeout(function() {
                        if(!value) value = '[blank]'
                        var prefix = isGeneral ? 'general/': ''
                        $scope.resource = Restangular.all($scope.route());
                        $scope.resource.customGET(prefix+'autocomplete/'+route+'/'+value+'?limit=10').then(function (data) {
                        scope.options = $scope.removeDuplicates(data.concat(scope.selectedModel),'id');  

                        $timeout(function() {},0)
                        }, function errorCallback() {
                        });
                    })
                }

                $scope._debounce = function(cb) {
                    var timeout = null;
                    return function(data) {
                        if (timeout) {
                        clearTimeout(timeout);
                        }
                        timeout = setTimeout(function() {
                        cb(data);
                        }, 200);
                    };
                };
                
                $scope.openDropdownByButton = function(name){
                    $timeout(function() {
                        $('[data-reference="'+name+'"] button').click()
                    })      
                }

                // Inicialização e set e eventos
                $scope.onInitMulti = function (event, field) {
                    var dropdown = $(event.target)
                    dropdown.scope().input.searchFilter = "";
                    var route = field.customOptions.general ? field.customOptions.general : field.name
                    var isGeneral = field.customOptions.general ? true : false

                    if (!dropdown.initMultiSelect) {
                        var _scope = dropdown.scope()
                        dropdown.initMultiSelect = true
                        // Popular o msdata pela depois de iniciado
                        $scope.makeRequestAutocomplete(_scope,'[blank]', route, isGeneral)        
                        dropdown.parent().find(".dropdown-header").append('<i class="glyphicon glyphicon-search" style=" position: absolute; top: 20px; right: 35px; "></i>')
                        
                        // Chamar autocomplete toda vez que alguma coisa é digitada no search-filter
                        _scope.$watch('input.searchFilter', $scope._debounce(function(data) {
                            $scope.makeRequestAutocomplete(_scope,data,route, isGeneral)
                        }))

                        // sim, precisa dessa gambiarra pra chumbar os evento e os textos

                        //set texts
                        _scope.texts.buttonDefaultText = "Selecione " + field.label
                        _scope.texts.searchPlaceholder = "Buscar " + field.label
                        _scope.texts.dynamicButtonTextSuffix = "selecionado(s)"

                        _scope.externalEvents.onItemSelect = $scope.onItemSelect
                        _scope.externalEvents.onSelectionChanged = $scope.changedMultiSelect
                        _scope.externalEvents.onItemDeselect = $scope.onItemDeselect
                    }
                }                

                // settings que foram chumbadas no html
                // TODO: fix this ... someday ...
                $scope.mssettings = {
                    scrollableHeight: '200px',
                    scrollable: true,
                    buttonDefaultText: 'Tipos de imóveis',
                    enableSearch: true,
                    styleActive: true,
                    showCheckAll: false,
                    showUncheckAll: false,
                    selectedToTop: true,
                    buttonClasses: 'btn btn-default fw-multiselect-button',
                    // smartButtonTextConverter: function (itemText, originalItem) {
                    //   // if (itemText === 'Jhon') {
                    //   //   return 'Jhonny!';
                    //   // }
                    //   return itemText;
                    // }
                };                

                /*Multiselect End*/ 
            },
        };
    }
})();
