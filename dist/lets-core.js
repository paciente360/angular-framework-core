(function () {
    'use strict';

    var module = angular.module('letsAngular', [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'angular.viacep',
        'ngCpfCnpj',
        'ui.mask',
        'ui.jq',
        'ui.event',
        'ngFileUpload',
        'moment-filter',
        'checklist-model',
        'ui.toggle',
        'ui.select',
        'ngSanitize',
        'colorpicker-dr'
    ]);

    // ----------------------------
    // Module App Config
    // ----------------------------

    module.config(appConfig);
    module.provider('headers', headersProvider);
    function headersProvider() {
        this.headers = {};

        var provider = {};

        this.set = function (name, headers) {
            this.headers[name] = headers;
        }

        this.get = function (name) {

            this.headers[name].findLabel = function (name) {
                for (var _x in this.fields) {
                    var field = this.fields[_x];

                    if (field.name == name) {
                        return field.label;
                    }
                }
            }

            return this.headers[name];
        }

        this.$get = function () {
            return this;
        };
    }
    appConfig.$inject = ['$stateProvider', '$httpProvider'];
    function appConfig($stateProvider, $httpProvider) {
        // $authProvider.loginUrl = '/auth/login';
        // $authProvider.baseUrl = 'http://192.168.1.112/';
    };
})();
/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud Tab List Directive
*
* File:        directives/crud/lets-crud-tab-list.directive.js
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
        .directive('crudTabList', crudTabList);

    crudTabList.$inject = ['jQuery'];

    function crudTabList(jQuery) {
        return {
            // restrict: 'E',
            // replace: false,
            // scope: true,
            scope: {
                crudTabListData: '=',
                crudTabListSettings: '&',
                parentData: '='
            },
            templateUrl: 'src/views/crud/crud-tab-list.html',
            link: function (scope, $el) {
                // scope.type = $el.attr('type');
                // scope.data = scope.parentData;
    
                setTimeout(function () {
                    var settings = scope.crudTabListSettings();
    
                    scope.data = scope.parentData;
                    scope.type = settings.type;
                    scope.headers = settings.headers;
                    scope.app = scope.$parent.app;
                    if (scope.crudTabListData) {
                        scope.extraData = scope.crudTabListData;
                    }
                }, 1000);
            }
        }
    }
})();



/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud List Directive
*
* File:        directives/crud/lets-crud-list.directive.js
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
        .directive('crudList', crudList);

    crudList.$inject = ['$window', 'jQuery', 'Backbone', 'Backgrid', 'appSettings', 'fwObjectService'];

    function crudList($window, jQuery, Backbone, Backgrid, appSettings, fwObjectService) {
        return {
            scope: {
                crudListSettings: '&',
                crudListDependenciesData: '&',
                app: '=',
            },
            controller: ["$scope", function ($scope) {
                $scope.route = null;

                $scope.$on('refreshGRID', function () {
                    console.log('Refreshing grid...')
                    $scope.pageableCRUDModel.fetch();
                });
            }],
            link: function (scope, $el, attrs) {

                scope.$el = $el;

                function render() {
                    // console.log(attrs);
                    // var settings = scope.crudListSettings;
                    var settings = scope.crudListSettings();
                    settings.route = appSettings.API_URL + settings.url;
                    // if (settings.pagerGeneral && settings.type) {
                    //     var _t = settings.type[0].toUpperCase() + settings.type.slice(1);
                    //     settings.route = appSettings.API_URL + settings.mainRoute + _t + '/pagerGeneral';
                    // }
                    scope.route = settings.route;

                    Backgrid.InputCellEditor.prototype.attributes.class = 'form-control input-sm';

                    var CRUDModel = Backbone.Model.extend({});

                    var PageableCRUDModel = Backbone.PageableCollection.extend({
                        model: CRUDModel,
                        //            url: './assets/json/pageable-territories.json',
                        // url: settings.route + '/pager', //'http://192.168.1.104/' + scope.headers.route,
                        url: settings.route + (!settings.pagerGeneral ? '/pager' : '/pagerGeneral'), //'http://192.168.1.104/' + scope.headers.route,
                        state: {
                            pageSize: 20
                        },
                        mode: 'server', // page entirely on the client side
                        // get the actual records
                        parseRecords: function (resp, options) {
                            // if (settings.pagerGeneral) {
                            //     var extraData = scope.$parent.extraData;
                            //     console.log('atualizado extraData from parent: ', extraData)
                            //     var resultado = fwObjectService.convertCrudTabListExtraData(settings.type.toLowerCase(), extraData.structure, extraData.values);
                            //     if (resultado) resp.data = resultado;
                            // }
                            return resp.data;
                        },
                        parseState: function (resp, queryParams, state, options) {
                            return { totalRecords: resp.total_count };
                        },
                    });

                    var pageableCRUDModel = new PageableCRUDModel(),
                        initialCRUDModel = pageableCRUDModel;

                    scope.pageableCRUDModel = pageableCRUDModel;

                    var serverSideFilter = new Backgrid.Extension.ServerSideFilter({
                        collection: pageableCRUDModel,
                        // the name of the URL query parameter
                        name: "q",
                        placeholder: "Buscar por..." // HTML5 placeholder for the search box
                    });

                    function createBackgrid(collection) {
                        var columns = [];

                        var StringFormatter = function () { };
                        StringFormatter.prototype = new Backgrid.StringFormatter();

                        _.extend(StringFormatter.prototype, {
                            fromRaw: function (rawValue, b, c, d, e) {
                                // var args = [].slice.call(arguments, 1);
                                // args.unshift(rawValue * this.multiplier);
                                // return NumberFormatter.prototype.fromRaw.apply(this, args) || "0" + this.symbol;

                                // console.log(rawValue);
                                return rawValue;
                            }
                        });

                        // for (var idx in settings.fields) {
                        _.each(settings.fields, function (field, idx) {


                            // var field = settings.fields[idx];

                            if (field.viewable) {
                                var cellOptions = {
                                    name: field.name,
                                    label: field.label,
                                    cell: 'string',
                                    editable: false,
                                    headers: field
                                };


                                if (field.type == 'boolean') {
                                    // cellOptions.cell = 'boolean';
                                    cellOptions.sortable = false;
                                    cellOptions.cell = Backgrid.Cell.extend({

                                        // Cell default class names are the lower-cased and dasherized
                                        // form of the the cell class names by convention.
                                        className: "custom-situation-cell",

                                        formatter: {
                                            fromRaw: function (rawData, model) {
                                                return rawData ? field.customOptions.statusTrueText : field.customOptions.statusFalseText;
                                            },
                                            toRaw: function (formattedData, model) {
                                                return 'down';
                                            }
                                        }

                                    });
                                }
                                if (field.type == 'simplecolor') {
                                    // cellOptions.cell = 'boolean';
                                    cellOptions.sortable = false;

                                    // var customFormatter = {
                                    //     fromRaw: function (rawData, model) {
                                    //         debugger;
                                    //         return angular.element('<cp-color class="color-picker" color="'+rawData+'"></cp-color>');
                                    //     },
                                    //     toRaw: function (formattedData, model) {
                                    //         return 'down';
                                    //     }
                                    // };

                                    cellOptions.cell = Backgrid.Cell.extend({

                                        // Cell default class names are the lower-cased and dasherized
                                        // form of the the cell class names by convention.
                                        className: "custom-situation-cell",

                                        // formatter: customFormatter,

                                        initialize: function () {
                                            Backgrid.Cell.prototype.initialize.apply(this, arguments);
                                        },
                                        render: function () {
                                            this.$el.empty();
                                            // var formattedValue = customFormatter.fromRaw();
                                            var formattedValue = '<cp-color class="color-picker" style="background-color: ' + this.model.attributes.cor + '"></cp-color>';

                                            this.$el.append(formattedValue);
                                            this.delegateEvents();
                                            return this;
                                        }

                                    });
                                }
                                else if (field.type == 'custom') {
                                    // console.log('uopiuiopasfd');
                                    var customFormatter = {
                                        // function (*, Backbone.Model): string
                                        fromRaw: field.toString,
                                        // fromRaw: function (rawData, model) {
                                        //   // return (rawData, model);
                                        // },
                                        // function (string, Backbone.Model): *|undefined
                                        toRaw: function (formattedData, model) {
                                            return 'down';
                                        }
                                    };

                                    cellOptions.sortable = false;
                                    var _backgridCellExtend = {
                                        // Cell default class names are the lower-cased and dasherized
                                        // form of the the cell class names by convention.
                                        className: "custom-cell",
                                        formatter: customFormatter
                                    };

                                    if (field.name === 'download' || field.name === 'print') {
                                        _backgridCellExtend.initialize = function () {
                                            Backgrid.Cell.prototype.initialize.apply(this, arguments);
                                        };
                                        _backgridCellExtend.render = function () {
                                            this.$el.empty();
                                            var formattedValue = customFormatter.fromRaw();
                                            this.$el.append(formattedValue);
                                            this.delegateEvents();
                                            return this;
                                        };
                                    }
                                    cellOptions.cell = Backgrid.Cell.extend(_backgridCellExtend);
                                } else if (field.type == 'address') {

                                    var addressFormatter = {
                                        // function (*, Backbone.Model): string
                                        fromRaw: function (rawData, model) {
                                            //     "address" : {
                                            //     "state" : "PR",
                                            //     "city" : "Londrina",
                                            //     "country" : "Brasil",
                                            //     "street_number" : "3",
                                            //     "neighborhood" : "Boa Vista",
                                            //     "zipcode" : "86020200",
                                            //     "geo_location" : {
                                            //         "lat" : -23.3021531,
                                            //         "lng" : -51.1731098
                                            //     },
                                            //     "location" : "",
                                            //     "number" : "",
                                            //     "complement" : "",
                                            //     "street" : "Rua Maceió"
                                            // }
                                            try {
                                                return rawData.city + ' - ' + rawData.state;
                                            } catch (err) {
                                                return '';
                                            }

                                        },
                                        // function (string, Backbone.Model): *|undefined
                                        toRaw: function (formattedData, model) {
                                            return 'down';
                                        }
                                    };

                                    var AddressCell = Backgrid.Cell.extend({

                                        // Cell default class names are the lower-cased and dasherized
                                        // form of the the cell class names by convention.
                                        className: "address-cell",

                                        formatter: addressFormatter

                                    });

                                    cellOptions.cell = AddressCell;

                                } else if (field.type == 'float') {
                                    cellOptions.cell = Backgrid.NumberCell.extend({
                                        decimalSeparator: ',',
                                        orderSeparator: '.'
                                    });
                                } else if (field.type == 'date') {
                                    // console.log('tango');
                                    var format = "DD/MM/YYYY";
                                    if (field.customOptions.monthpicker !== undefined) {
                                        format = "MM/YYYY";
                                    }

                                    cellOptions.cell = Backgrid.Extension.MomentCell.extend({
                                        modelFormat: "YYYY/M/D",
                                        // You can specify the locales of the model and display formats too
                                        displayLang: "pt-br",
                                        displayFormat: format
                                    });
                                } else if (field.customOptions.enum != undefined) {

                                    var enumOptions = [];
                                    for (var _idx in field.customOptions.enum) {
                                        var opt = field.customOptions.enum[_idx];
                                        enumOptions.push([opt, _idx]);
                                    }

                                    cellOptions.cell = Backgrid.SelectCell.extend({
                                        optionValues: enumOptions
                                    });

                                } else if (field.autocomplete == true) {
                                    // if (field.customOptions.list != undefined) {
                                    //     var customFormatter = {
                                    //         // function (*, Backbone.Model): string
                                    //         fromRaw: function(rawData, model) {
                                    //             console.log('hehe');
                                    //             var _list = field.customOptions.list;
                                    //             console.log(field, rawData, model);
                                    //             for (var _x in _list) {
                                    //                 if (_list[_x].id == rawData) {
                                    //                     return _list[_x].label;
                                    //                 }
                                    //             }
                                    //         },
                                    //         // fromRaw: function (rawData, model) {
                                    //         //   // return (rawData, model);
                                    //         // },
                                    //         // function (string, Backbone.Model): *|undefined
                                    //         toRaw: function(formattedData, model) {
                                    //             return 'not implemented';
                                    //         }
                                    //     };

                                    //     var customCell = Backgrid.Cell.extend({

                                    //         formatter: customFormatter

                                    //     });

                                    //     cellOptions.cell = customCell;
                                    //     console.log('entrou aqui');

                                    // } else {
                                    cellOptions.name = cellOptions.name + '.label';
                                    // }

                                }

                                columns.push(cellOptions);
                            }
                        });
                        // }


                        var ActionCell = Backgrid.Cell.extend({
                            className: 'text-right btn-column' + (settings.tab == true ? ' detail' : ''),
                            template: function () {
                                var _buttons = [];
                                if (!settings.tab) {
                                    if (settings.settings.edit) {
                                        _buttons.push(jQuery('<button type="button" class="btn btn-default btn-edit"><span class="glyphicon glyphicon-pencil"></span></button>'));
                                    }
                                    if (settings.settings.delete) {
                                        _buttons.push(jQuery('<button type="button" class="btn btn-default btn-delete"><span class="glyphicon glyphicon-remove"></span></button>'));
                                    }
                                } else {
                                    if (settings.settings) {
                                        if (settings.settings.edit) {
                                            var _btnEditDetail = jQuery('<button type="button" class="btn btn-default btn-edit-detail-data"><span class="glyphicon glyphicon-pencil"></span></button>');
                                            _btnEditDetail.attr('data-route', settings.url);
                                            _buttons.push(_btnEditDetail);
                                        }
                                        if (settings.settings.delete) {
                                            var _btnDeleteDetail = jQuery('<button type="button" class="btn btn-default btn-delete-detail"><span class="glyphicon glyphicon-remove"></span></button>');
                                            _btnDeleteDetail.attr('data-route', settings.url);
                                            _buttons.push(_btnDeleteDetail);
                                        }
                                    } else {
                                        var _btnDeleteDetail = jQuery('<button type="button" class="btn btn-default btn-delete-detail"><span class="glyphicon glyphicon-remove"></span></button>');
                                        // _btnDeleteDetail.data('settings', settings);
                                        _btnDeleteDetail.attr('data-route', settings.url);
                                        _buttons.push(_btnDeleteDetail);
                                    }
                                }

                                var _group = jQuery('<div class="btn-group" role="group">');
                                _group.append(_buttons);

                                return _group;
                            }, //_.template(_buttons),
                            events: {
                                // "click": "editRow"
                            },
                            editRow: function (e) {
                                e.preventDefault();
                                //Enable the occupation cell for editing
                                //Save the changes
                                //Render the changes.
                                // console.log('tango')
                            },
                            render: function () {
                                var _html = this.template(this.model.toJSON());
                                // var _model = this.model;
                                this.$el.html(_html);
                                this.$el.data('model', this.model);
                                this.$el.find('button.btn-edit').click(function (e) {
                                    e.stopPropagation();

                                    var $scope = angular.element(this).scope();
                                    if (settings.tab) {
                                        $scope.$parent.edit($(this).closest('td').data('model').attributes);
                                    } else {
                                        $scope.edit($(this).closest('td').data('model').attributes);
                                    }


                                });

                                this.$el.find('button.btn-delete').click(function (e) {
                                    // e.stopPropagation();

                                    var _confirm = window.confirm('Deseja realmente excluir esse registro?');

                                    if (_confirm) {
                                        var $scope = angular.element(this).scope();
                                        if (settings.tab) {
                                            $scope.$parent.delete($(this).closest('td').data('model').attributes);
                                        } else {
                                            $scope.delete($(this).closest('td').data('model').attributes);
                                        }
                                    }



                                    // response.then(function(data) {
                                    //   console.log('asjkdlfç');
                                    // });


                                });

                                this.$el.find('button.btn-delete-detail').click(function (e) {
                                    e.stopPropagation();

                                    var $scope = angular.element(this).scope();
                                    // var settings = this.$el.data('settings');
                                    // console.log(settings.route);
                                    var route = jQuery(this).attr('data-route');

                                    if (settings.tab) {
                                        $scope.$parent.deleteDetail(route, $(this).closest('td').data('model').attributes);
                                    } else {
                                        $scope.deleteDetail(route, $(this).closest('td').data('model').attributes);
                                    }
                                });

                                this.$el.find('button.btn-edit-detail-data').click(function (e) {
                                    e.stopPropagation();

                                    var $scope = angular.element(this).scope();
                                    // var settings = this.$el.data('settings');
                                    // console.log(settings.route);
                                    var route = jQuery(this).attr('data-route');

                                    if (settings.tab) {
                                        $scope.$parent.editDetail(route, $(this).closest('td').data('model').attributes, $scope.type);
                                    } else {
                                        $scope.editDetail(route, $(this).closest('td').data('model').attributes, $scope.type);
                                    }
                                });

                                this.delegateEvents();
                                // console.log(_html);
                                return this;
                            }
                        });

                        columns.push({
                            name: "actions",
                            label: "Ações",
                            sortable: false,
                            cell: ActionCell
                        });

                        if (scope.$parent.app.helpers.isScreen('xs')) {

                            columns.splice(3, 1);
                        }

                        var rowClasses = [];
                        if (settings.tab == true) {
                            rowClasses.push('detail');
                        }
                        if (settings.settings != undefined && !settings.settings.edit) {
                            rowClasses.push('cant-edit');
                        }

                        var ClickableRow = Backgrid.Row.extend({
                            className: rowClasses.join(' '),
                            // events: {
                            //   "click": "onClick"
                            // },
                            // onClick: function () {
                            //   // Backbone.trigger("rowclicked", this.model);
                            //   if (!this.$el.is('.detail') && !this.$el.is('.cant-edit')) {
                            //     this.$el.scope().$parent.edit(this.model);
                            //   }

                            // }
                        });

                        // Backbone.on("rowclicked", function (model) {
                        //   console.log('clicou', model);
                        //   // $scope.$parent.edit(model.id);
                        // });

                        var pageableGrid = new Backgrid.Grid({
                            row: ClickableRow,
                            columns: columns,
                            collection: collection,
                            className: 'table table-striped table-editable no-margin mb-sm'
                        });

                        var paginator = new Backgrid.Extension.Paginator({

                            slideScale: 0.25, // Default is 0.5

                            // Whether sorting should go back to the first page
                            goBackFirstOnSort: false, // Default is true

                            collection: collection,

                            controls: {
                                rewind: {
                                    label: '<i class="fa fa-angle-double-left fa-lg"></i>',
                                    title: 'First'
                                },
                                back: {
                                    label: '<i class="fa fa-angle-left fa-lg"></i>',
                                    title: 'Previous'
                                },
                                forward: {
                                    label: '<i class="fa fa-angle-right fa-lg"></i>',
                                    title: 'Next'
                                },
                                fastForward: {
                                    label: '<i class="fa fa-angle-double-right fa-lg"></i>',
                                    title: 'Last'
                                }
                            }
                        });

                        // var serverSideFilter = new Backgrid.Extension.ServerSideFilter({
                        //   collection: pageableCRUDModel,
                        //   // the name of the URL query parameter
                        //   name: "q",
                        //   placeholder: "Busca..."
                        // });
                        //
                        // jQuery('#table-dynamic').before(serverSideFilter.render().el);

                        var _filter = serverSideFilter.render().$el;

                        angular.element('.crud-list-header h4').css({
                            'vertical-align': 'middle',
                            'line-height': '34px',
                            'flex': 1
                        });

                        _filter.css({
                            'margin': '0px',
                            'float': 'none',
                            'display': 'inline-block',
                            'vertical-align': 'middle',
                            'line-height': '34px',
                            'height': '34px',
                            'padding': '0px',
                            'width': '300px'
                        });

                        _filter.find('span').css({

                            'top': 0,
                            'bottom': 0,
                            'height': '34px',
                            'font-size': '34px',
                            'vertical-align': 'middle',
                            'left': '10px',
                            'margin-top': '0px'

                        });

                        _filter.find('.clear').css({
                            // 'display': 'block',
                            'height': '34px',
                            'line-height': '35px',
                            'top': 0,
                            'bottom': 0,
                            'margin-top': '0px',
                            // 'margin-right': '-5px'
                        });

                        _filter.find('input[type="search"]').css({

                            'height': '34px',
                            'padding-top': 0,
                            'padding-bottom': 0,
                            'vertical-align': 'middle',
                            'line-height': '34px',
                            'padding-left': '30px',
                            'padding-right': '30px',
                            'width': '80%'

                        })

                        scope.$el.find('.crud-list-header').append(_filter)

                        function _returnPageGridWithSort() {
                            if (settings.fields[1]) {
                                if (settings.fields[1].type === 'string') return pageableGrid.render().sort(settings.fields[1].name, 'ascending').$el;
                                return pageableGrid.render().$el;
                            }
                            else return pageableGrid.render().$el;
                        }

                        scope.$el.find('.table-container').html('').append(_returnPageGridWithSort()).append(paginator.render().$el);
                    }

                    jQuery($window).on('sn:resize', function () {
                        createBackgrid(pageableCRUDModel);
                    });

                    createBackgrid(pageableCRUDModel);

                    /*
                    jQuery('#search-countries').keyup(function(){

                      var $that = jQuery(this),
                        filteredCollection = initialCRUDModel.fullCollection.filter(function(el){
                          return ~el.get('name').toUpperCase().indexOf($that.val().toUpperCase());
                        });
                      createBackgrid(new PageableCRUDModel(filteredCollection, {
                        state: {
                          firstPage: 1,
                          currentPage: 1
                        }
                      }));
                    });
                    */

                    pageableCRUDModel.fetch();
                }

                var listener = scope.$parent.$watch('headers', function (newValue, oldValue) {
                    // console.log('tango', newValue);
                    if (newValue != null) {
                        var settings = scope.crudListSettings();
                        if (settings.tab == true) {
                            var listenerData = scope.$parent.$watch('data', function (newValue, oldValue) {
                                  if (newValue.id != undefined) {
                                      // console.log('tango', newValue);
                                      render();
                                      listenerData();
                                      listener();
                                  }
                            });
                        } else {
                            render();
                            listener();
                        }

                    }
                });
            }
        }
    }
})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud Form Directive
*
* File:        directives/crud/lets-crud-form.directive.js
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
        .directive('crudForm', crudForm);

    crudForm.$inject = ['jQuery', '$timeout', 'fwModalService'];

    function crudForm(jQuery, $timeout, fwModalService) {
        return {
            replace: false,
            link: function (scope, $el) {
                // var internalCounter = -1;

                // if(scope.$parent.headers !== undefined) scope.headers = angular.copy(scope.$parent.headers);

                // var newFields = [];

                // scope.$parent.$watch('headers.fields', function() {
                //     console.log(arguments);
                // })

                // $timeout(function () {
                //     _.each(scope.headers.fields, function (field, key) {
                //         newFields.push(field);
                //         if (field.type == 'password') {
                //             var newField = angular.copy(field);
                //             newField.name = 'confirm_' + field.name;
                //             newField.label = 'Confirmar ' + field.label;
                //             newFields.push(newField);
                //         }
                //     });

                //     scope.headers.fields = newFields;
                // }, 500);

                jQuery($el).on('click', '.button-new', function () {
                    var detail = jQuery(this).attr('detail');
                    var origin = jQuery(this).attr('origin');
                    // var _new = {};
                    //
                    // var fields = scope.headers[origin][detail].fields;
                    //
                    // for (var x in fields) {
                    //   if (fields[x].type != 'boolean') {
                    //     _new[fields[x].name] = null;
                    //   } else {
                    //     _new[fields[x].name] = false;
                    //   }
                    // }

                    // _new.new = true;

                    // _new['ppho_id'] = internalCounter--;

                    // console.log(_new);
                    if (scope.data[detail] == undefined) {
                        scope.data[detail] = [];
                    }

                    var headers = scope.headers[origin][detail];
                    var parentModel = scope.headers.route.toLowerCase();
                    var autocompleteDetail = true;

                    if (headers.autocompleteDetail !== undefined) autocompleteDetail = headers.autocompleteDetail;

                    fwModalService.createCRUDModal(headers, parentModel, null, autocompleteDetail)
                        .then(function (response) {
                            response.new = true;
                            response.disabled = true;
                            scope.data[detail].push(response);
                        });

                });


                // debugger;
                $timeout(function () {
                    // debugger;
                    $el.find('.tab-group .nav-tabs li:first').find('a').click();
                    $el.find(':input[type!="hidden"]:first').focus();

                    // ,
                    // post: function postLink(scope, $el, attrs, controller) {
                    // debugger;
                    // $timeout(function() {

                    // }, 500);

                    // }
                }, 500);


                $($el).parsley({
                    priorityEnabled: false,
                    errorsContainer: function (el) {
                        return el.$element.closest(".input-container");
                    }
                });

                // data-ui-jq="parsley" data-parsley-errors-container=".input-container" data-parsley-priority-enabled="false"
            }
        }
    }
})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Upload Directive
*
* File:        directives/framework/lets-fw-upload.directive.js
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
        .directive('fwUpload', fwUpload);

    fwUpload.$inject = ['$timeout'];

    function fwUpload($timeout) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, element) {

                $scope.defaultProgress = 0;
                $scope.alreadySent = false;

                $timeout(function () { // replace this by $scope.$on('data-loaded')
                    if ($scope.data[$scope.field.name] != undefined && $scope.data[$scope.field.name] != null) {
                        $scope.defaultProgress = 100;
                        $scope.alreadySent = true;
                    }
                }, 200);

                $scope.upload = function (file, errFiles) {
                    $scope.f = file;
                    $scope.errFile = errFiles && errFiles[0];

                    if (file) {
                        file.upload = $scope._upload($scope.field, file);

                        file.upload.then(function (response) {
                            $timeout(function () {
                                file.result = response.data;
                                var _input = element.find('input[type="hidden"]');

                                _input.controller('ngModel').$setViewValue(file.name);
                                if (!response.data.file) response.data.file = { name: response.data.result.files.file[0].name } // Multiple file upload case
                                _input.scope().data[_input.scope().field.customOptions.file[0]] = response.data.file.name;
                            });
                        }, function (response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });
                    }
                };

                // element.click(function(e) {
                //
                //
                //   element.find('input[type="file"]').click();
                //
                //   console.log('tango');
                // });
                //
                //
                //
                // element.find('input[type="file"]').click(function(e) {
                //   e.stopPropagation();
                // }).change(function() {
                //   element.find('input[name="temp_filename"]').val(this.files[0].name);
                //
                //   scope.upload(this.files[0]);
                // })
            }
        }
    }
})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Tags Directive
*
* File:        directives/framework/lets-fw-tags.directive.js
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
        .directive('fwTags', fwTags);

    fwTags.$inject = [];

    function fwTags() {
        return {
            restrict: 'E',
            scope: {
                tags: '=',
                // autocomplete: '=autocomplete'
            },
            template:

            '<div class="input-group fw-input-group"><input type="text" class="form-control" placeholder="add a tag..." ng-model="newValue" /> ' +
            '<span class="input-group-btn"><a class="btn btn-default" ng-click="add()">Add</a></span></div>' +
            '<div class="tags">' +
            '<div ng-repeat="(idx, tag) in tags" class="tag label label-success">{{tag}} <a class="close" href ng-click="remove(idx)">×</a></div>' +
            '</div>',
            link: function ($scope, $element) {
                // $scope.tags = [];

                // $scope.tags = $element.attr('tags');

                if ($scope.tags == null) {
                    $scope.tags = [];
                }

                var input = angular.element($element).find('input');

                // setup autocomplete
                if ($scope.autocomplete) {
                    // $scope.autocompleteFocus = function (event, ui) {
                    //     input.val(ui.item.value);
                    //     return false;
                    // };
                    // $scope.autocompleteSelect = function (event, ui) {
                    //     $scope.newValue = ui.item.value;
                    //     $scope.$apply($scope.add);

                    //     return false;
                    // };
                    // $($element).find('input').autocomplete({
                    //     minLength: 0,
                    //     source: function (request, response) {
                    //         var item;
                    //         return response((function () {
                    //             var _i, _len, _ref, _results;
                    //             _ref = $scope.autocomplete;
                    //             _results = [];
                    //             for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    //                 item = _ref[_i];
                    //                 if (item.toLowerCase().indexOf(request.term.toLowerCase()) !== -1) {
                    //                     _results.push(item);
                    //                 }
                    //             }
                    //             return _results;
                    //         })());
                    //     },
                    //     focus: (function (_this) {
                    //         return function (event, ui) {
                    //             return $scope.autocompleteFocus(event, ui);
                    //         };
                    //     })(this),
                    //     select: (function (_this) {
                    //         return function (event, ui) {
                    //             return $scope.autocompleteSelect(event, ui);
                    //         };
                    //     })(this)
                    // });
                }


                // adds the new tag to the array
                $scope.add = function () {
                    // if not dupe, add it
                    if ($scope.tags.indexOf($scope.newValue) == -1) {
                        $scope.tags.push($scope.newValue);
                    }
                    $scope.newValue = "";
                };

                // remove an item
                $scope.remove = function (idx) {
                    $scope.tags.splice(idx, 1);
                };

                // capture keypresses
                input.bind('keypress', function (event) {

                    // enter was pressed
                    if (event.keyCode == 13) {
                        event.stopPropagation();
                        event.preventDefault();
                        $scope.$apply($scope.add);
                    }
                });
            }
        };
    };
})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Input Directive
*
* File:        directives/framework/lets-fw-input.directive.js
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
        .directive('fwInput', fwInput);

    fwInput.$inject = ['viaCEP', '$timeout', '$compile', 'jQuery', '$sce'];

    function fwInput(viaCEP, $timeout, $compile, jQuery, $sce) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'src/views/framework/input.html',
            replace: true,
            // priority: 99,
            link: {

                pre: function preLink(scope, $el, attrs, controller) {
                    var dataVar = $el.attr('fw-data');
                    if (scope.field.customOptions.events == undefined) {
                        scope.field.customOptions.events = {};
                    }

                    scope.fieldHtml = function () {
                        return $sce.trustAsHtml(scope.field.toString());
                    }

                    if (dataVar != 'data' && dataVar != 'modal_data') {
                        scope.data = scope[dataVar];
                    }

                    if (dataVar != 'data' && scope.field.autocomplete !== false) {
                        // Modal case
                        if (scope.detail_key === undefined) scope.detail_key = scope.headers.route;
                        var detail = scope.detail_key;

                        if (scope.acdetail) {
                            scope.autocomplete = function (field, val) {
                                return scope.autocompleteDetail(detail, field, val);
                            }
                        }

                        scope.autocompleteSelect = function ($item, $model, $label) {
                            return scope.autocompleteDetailSelect(detail, $item, $model, $label);
                        }

                    }

                    if (dataVar != 'data' && scope.field.customOptions.file != undefined) {
                        scope.download = function (field, id) {
                            var detail = scope.detail_key;
                            return scope.downloadDetail(detail, field, id, scope.data);
                        }
                    }

                    if (scope.field.customOptions.cep != undefined) {
                        // console.log(scope);

                        $el.find('input.main-input').blur(function () {
                            var $scope = angular.element(this).scope();
                            viaCEP.get(this.value).then(function (response) {
                                // console.log(response, $scope);
                                var map = $scope.field.customOptions.cep;
                                // $scope.$parent.headers

                                $scope.data[map.address] = response.logradouro;
                                $scope.data[map.district] = response.bairro;
                                $scope.data[map.city] = response.localidade;
                                $scope.data[map.state] = response.uf;

                                scope.$$phase || scope.$apply();
                            });
                        });
                    }
                    else if (scope.field.customOptions.multiple != undefined && scope.field.customOptions.multiple == true) {
                        var a = $compile($el.contents())(scope);
                        console.log(a);
                        // $el.replaceWith($compile($el.contents())(scope))
                    }

                    jQuery($el).on('blur', ':input[ng-model]', function (e) {
                        // $el.find(':input[ng-model]').blur(function() {

                        try {
                            if (angular.element(this).scope().field.customOptions.events.blur != undefined) {
                                angular.element(this).scope().field.customOptions.events.blur.call(this, e);
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }


                    });

                    scope.isEmpty = function (obj) {
                        return Object.keys(obj).length;
                    }
                }

            }

        }
    }
})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Input Detail Directive
*
* File:        directives/framework/lets-fw-input-detail.directive.js
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
        .directive('fwInputDetail', fwInputDetail);

    fwInputDetail.$inject = ['viaCEP', '$timeout', '$compile', 'jQuery'];

    function fwInputDetail(viaCEP, $timeout, $compile, jQuery) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'src/views/framework/input-detail.html',
            replace: true,
            // controller: function($scope) {
            //   $scope.data = $scope.detail_data;
            // }
            link: {
                post: function preLink(scope, $el, attrs, controller) {


                },
            }
        }
    }
})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Dynamic Directive
*
* File:        directives/framework/lets-fw-dynamic.directive.js
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
        .directive('fwDynamic', fwDynamic);

    fwDynamic.$inject = ['viaCEP', '$timeout', '$compile', 'jQuery', '$filter'];

    function fwDynamic(viaCEP, $timeout, $compile, jQuery, $filter) {
        var FLOAT_REGEXP_1 = /^\$?\d+.(\d{3})*(\,\d*)$/; //Numbers like: 1.123,56
        var FLOAT_REGEXP_2 = /^\$?\d+,(\d{3})*(\.\d*)$/; //Numbers like: 1,123.56
        var FLOAT_REGEXP_3 = /^\$?\d+(\.\d*)?$/; //Numbers like: 1123.56
        var FLOAT_REGEXP_4 = /^\$?\d+(\,\d*)?$/; //Numbers like: 1123,56

        return {
            restrict: 'A',
            // controller: function($scope, ) {
            //
            // },
            link: {
                // pre: function preLink(scope, $el, attrs, controller) {
                // },


                post: function postLink(scope, $el, attrs, controller) {
                    if (!controller) {
                        controller = $el.controller('ngModel');
                    }

                    if (scope.field.customOptions.cpf != undefined) {
                        $el.mask('999.999.999-99');
                        // } else if (scope.field.customOptions.email != undefined) {
                        //     $el.attr('data-parsley-type', "email");
                    } else if (scope.field.customOptions.cnpj != undefined) {
                        $el.mask('99.999.999/9999-99');
                    } else if (scope.field.type == 'float') {



                        // controller.$parsers.unshift(function(viewValue) {
                        //     if (FLOAT_REGEXP_1.test(viewValue)) {
                        //         controller.$setValidity('float', true);
                        //         return parseFloat(viewValue.replace('.', '').replace(',', '.'));
                        //     } else if (FLOAT_REGEXP_2.test(viewValue)) {
                        //         controller.$setValidity('float', true);
                        //         return parseFloat(viewValue.replace(',', ''));
                        //     } else if (FLOAT_REGEXP_3.test(viewValue)) {
                        //         controller.$setValidity('float', true);
                        //         return parseFloat(viewValue);
                        //     } else if (FLOAT_REGEXP_4.test(viewValue)) {
                        //         controller.$setValidity('float', true);
                        //         return parseFloat(viewValue.replace(',', '.'));
                        //     } else {
                        //         controller.$setValidity('float', false);
                        //         return undefined;
                        //     }
                        // });

                        // controller.$formatters.unshift(
                        //     function(modelValue) {
                        //         return $filter('number')(parseFloat(modelValue), 2);
                        //     }
                        // );

                        if (scope.field.customOptions.currency != undefined) {
                            $el.mask("#.##0,00", { reverse: true });
                        } else {
                            // $el.mask("##0,00", { reverse: true });
                            // var o = {
                            //   // min: 1,
                            //   // max: 9,
                            //   step: 1,
                            //   decimals: 2
                            // };

                            // $el.keydown(function(e) {-1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190, 188]) || /65|67|86|88/.test(e.keyCode) && (!0 === e.ctrlKey || !0 === e.metaKey) || 35 <= e.keyCode && 40 >= e.keyCode || (e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) && (96 > e.keyCode || 105 < e.keyCode) && e.preventDefault() });

                            // var options = angular.extend(o, scope.touchspinOptions);

                            // if (options.umed != 'UN') {
                            //   options.postfix = options.umed;
                            // }

                            // $el.TouchSpin(o);
                        }
                    } else if (scope.field.customOptions.telefone != undefined) {
                        // $el.mask("(99) 9999-9999?9")
                        // .focusout(function (event) {
                        //   var target, phone, element;
                        //   target = (event.currentTarget) ? event.currentTarget : event.srcElement;
                        //   phone = target.value.replace(/\D/g, '');
                        //   element = $(target);
                        //   element.unmask();
                        //   if(phone.length > 10) {
                        //     element.mask("(99) 99999-999?9");
                        //   } else {
                        //     element.mask("(99) 9999-9999");
                        //   }
                        // });

                        // var val = $el.val();
                        // if (val.replace(/\D/g, '').length === 11) {
                        //
                        // } '(00) 00000-0000' : '(00) 0000-00009'


                        var SPMaskBehavior = function (val) {
                            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
                        },
                            spOptions = {
                                onKeyPress: function (val, e, field, options) {
                                    field.mask(SPMaskBehavior.apply({}, arguments), options);
                                }
                            };

                        $timeout(function () {
                            $el.mask(SPMaskBehavior, spOptions);
                        }, 100);

                        // $el.keyup();
                        // $el.val($el.masked());
                    } else if (scope.field.type == 'date') {
                        $el.mask('99/99/9999');
                    } else if (scope.field.customOptions.cep != undefined) {

                        $el.blur(function () {
                            var $scope = angular.element(this).scope();
                            var dataVar = jQuery(this).parent().attr('fw-data');
                            viaCEP.get(this.value).then(function (response) {
                                var map = $scope.field.customOptions.cep;

                                $scope.data[map.address] = response.logradouro;
                                $scope.data[map.district] = response.bairro;
                                $scope.data[map.city] = response.localidade;
                                $scope.data[map.state] = response.uf;
                            });
                        });
                    }
                }
            }
        }
    }
})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Date Picker Directive
*
* File:        directives/framework/lets-fw-datepicker.directive.js
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
        .directive('fwDatePicker', fwDatePicker);

    fwDatePicker.$inject = ['$compile', 'jQuery'];

    function fwDatePicker($compile, jQuery) {
        var controllerName = 'vm';
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: true,
            terminal: true,
            priority: 1,
            compile: function (element, attrs) {

                var wrapper = angular.element(
                    '<div class="input-group">' +
                    '<span class="input-group-btn">' +
                    '<button type="button" class="btn btn-default" ng-click="' + controllerName + '.openPopup($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
                    '</span>' +
                    '</div>');

                function setAttributeIfNotExists(name, value) {
                    var oldValue = element.attr(name);
                    if (!angular.isDefined(oldValue) || oldValue === false) {
                        element.attr(name, value);
                    }
                }



                setAttributeIfNotExists('type', 'text');
                setAttributeIfNotExists('is-open', controllerName + '.popupOpen');
                // setAttributeIfNotExists('datepicker-popup', 'MM/yyyy');
                setAttributeIfNotExists('show-button-bar', false);
                setAttributeIfNotExists('show-weeks', false);
                setAttributeIfNotExists('datepicker-options', 'datepickerOptions');

                // setAttributeIfNotExists('datepicker-options', { 'datepickerMode': "'month'",
                //   'minMode': 'month'});

                // setAttributeIfNotExists('close-text', 'Schließen');
                // setAttributeIfNotExists('clear-text', 'Löschen');
                // setAttributeIfNotExists('current-text', 'Heute');

                element.addClass('form-control');
                element.removeAttr('fw-date-picker');
                element.after(wrapper);
                wrapper.prepend(element);

                return function (scope, element) {
                    // console.log('left');

                    var options = {

                    };

                    if (scope.data === undefined) scope.data = {};

                    if (!scope.field) {
                        scope.field = { customOptions: [] };
                        if (attrs.fwDatePickerNgModelParent) {
                            options.initDate = new Date(scope.$parent[attrs.ngModel]);
                            scope.$parent[attrs.ngModel] = angular.copy(options.initDate);
                        } else {
                            options.initDate = new Date(scope[attrs.ngModel]);
                            scope[attrs.ngModel] = angular.copy(options.initDate);
                        }
                    }

                    else if (scope.data[scope.field.name] != null) {
                        options.initDate = new Date(scope.data[scope.field.name]);
                        scope.data[scope.field.name] = angular.copy(options.initDate);
                    }

                    var format = 'dd/MM/yyyy';

                    if (scope.field.customOptions.monthpicker !== undefined) {
                        options.datepickerMode = "'month'";
                        options.minMode = 'month';

                        format = 'MM/yyyy';
                    }

                    element.find('input').attr('datepicker-popup', format);

                    element.find('input').blur(function () {
                        if (!moment(this.value, format).isValid() && this.value !== '') {
                            // console.log('esta errado aqui');
                            // debugger;
                            scope.field.error = true;
                        } else {
                            scope.field.error = false;
                        }
                    });

                    scope.datepickerOptions = options;

                    // if (scope.data.disabled) jQuery('.input-group-btn').remove();

                    $compile(element)(scope);
                };
            },
            controller: ["$scope", function ($scope) {
                // this.datePickerOptions =

                // debugger;
                this.popupOpen = false;
                // console.log('down');
                this.openPopup = function ($event) {
                    // console.log('tango');
                    $event.preventDefault();
                    $event.stopPropagation();
                    this.popupOpen = true;
                };
            }],
            controllerAs: controllerName
        };
    }
})();

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
            templateUrl: 'src/views/framework/chart.html',
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
            controller: ["$scope", function ($scope) {
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

            }],
            link: function (scope, $el, attrs, ctrls, transclude) {
                scope.$el = $el;
            }
        }
    }
})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Auto Complete Directive
*
* File:        directives/framework/lets-fw-auto-complete.directive.js
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
        .directive('fwAutoComplete', fwAutoComplete);

    fwAutoComplete.$inject = ['$compile'];

    function fwAutoComplete($compile) {
        var controllerName = 'vm';
        return {
            restrict: 'A',
            priority: 1,
            link: function (scope, element) {
                var _input = element.find('input');

                var clickHandler = function () {
                    var _oldVal = _input.val();
                    var _val = _oldVal + ' ';
                    // if (_val.length == 0) {
                    //   _val = (' ');
                    //
                    //   // _input.focus();
                    //
                    //   // scope.$apply();
                    // }
                    // _input.trigger('change');
                    _input.controller('ngModel').$setViewValue(_val);
                    // _input.trigger('input');
                    // _input.trigger('change');
                    scope.$digest;
                    _input.controller('ngModel').$setViewValue(_oldVal);
                };

                element.find('button').click(clickHandler);
                _input.click(clickHandler);
            },
            controller: function () {
                // this.datePickerOptions =
            },
            controllerAs: controllerName
        };
    }
})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Auto Complete Table Directive
*
* File:        directives/framework/lets-fw-auto-complete-table.directive.js
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
            controller: ["$scope", function ($scope) {
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
            }],
            controllerAs: controllerName
        };
    }
})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - String Service
*
* File:        services/utils/lets-utils-string.service.js
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
    angular
        .module('letsAngular')
        .service('utilsStringService', utilsStringService);
  
    utilsStringService.inject = [];
  
    function utilsStringService() {
  
        var self = this;
    
        self._placeholderList = ['paciente'];
        self._placeholderAttr = ['nome'];
    
        self.removeAccents = function(str) {
            var accents    = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
            var accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
            str = str.split('');
            var strLen = str.length;
            var i, x;
            for (i = 0; i < strLen; i++) {
            if ((x = accents.indexOf(str[i])) != -1) {
                str[i] = accentsOut[x];
            }
            }
            return str.join('');
        };
        self._removeSpecialChars = function(str) {
            var specialChars = '!@#$%*()-_+=/.,:;?[{]}`~^|';
            str = str.split('');
            var strLen = str.length;
            var i;
            for (i = 0; i < strLen; i++) {
            if (specialChars.indexOf(str[i]) != -1) {
                str[i] = '';
            }
            }
            return str.join('');
        };
        self.lemmatize = function (str) {
            str = self.removeAccents(str);
            return self._removeSpecialChars(str);
        };
        self.changePlaceholders = function (texto, data) {
            self._placeholderList.forEach(function (placeholder, i) {
                if (data[placeholder]) {
                    var _place = '[' + placeholder.toUpperCase() + ']';
                    if (texto.indexOf(_place) !== -1) {
                        var _split = texto.split(_place);
                        var _texto = '';
                        var _count = _split.length;
                        _split.forEach(function (_substr, j) {
                            _texto = _texto + _substr;
                            if (j < _count-1) _texto = _texto + data[placeholder][self._placeholderAttr[i]];
                        });
                        texto = _texto;
                    }
                }
            });
            return texto;
        };
    
        return {
            removeAccents: self.removeAccents,
            lemmatize: self.lemmatize,
            changePlaceholders: self.changePlaceholders
        };
  
    }
  
  })();
  
/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Print Service
*
* File:        services/utils/lets-utils-print.service.js
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
    utilsPrintService.$inject = ["$templateRequest", "$rootScope", "$compile", "$timeout"];
    angular
        .module('letsAngular')
        .service('utilsPrintService', utilsPrintService);

    utilsPrintService.inject = ['$templateRequest', '$rootScope', '$compile', '$timeout'];

    function utilsPrintService($templateRequest, $rootScope, $compile, $timeout) {

        var self = this;

        self._printHTML = function (html) {
            var hiddenFrame = $('<iframe></iframe>').appendTo('body')[0];
            hiddenFrame.contentWindow.printAndRemove = function() {
                hiddenFrame.contentWindow.print();
                setTimeout(function(){ $(hiddenFrame).remove(); }, 3000);
            };

            var htmlDocument = "<!doctype html>"+
                "<html>"+
                '<body onload="printAndRemove();">' + // Print only after document is loaded
                html +
                '</body>'+
                "</html>";
            var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");

            doc.write(htmlDocument);
            doc.close();
        };
        self.print = function (templateURL, data) {
            moment.locale('pt-br');
            var printScope = angular.extend($rootScope.$new(), data);
            $templateRequest(templateURL).then(function (template) {
                var element = $compile($('<div>' + template + '</div>'))(printScope);
                var waitForRenderAndPrint = function() {
                    if(printScope.$$phase) {
                        $timeout(waitForRenderAndPrint);
                    } else {
                        self._printHTML(element.html());
                        printScope.$destroy(); // To avoid memory leaks from scope create by $rootScope.$new()
                    }
                };
                waitForRenderAndPrint();
            });
        };

        return {
            print: self.print
        }

    }

})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Object Service
*
* File:        services/utils/lets-utils-object.service.js
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
    angular
        .module('letsAngular')
        .service('utilsObjectService', utilsObjectService);

    utilsObjectService.inject = [];

    function utilsObjectService() {

        var self = this;

        // labelObj = { 'relation': 'medicamento', 'label': 'nome_apresentacao' }
        self.convertObjSearch = function (original, labelObj) {
            var _objConv = {};

            Object.keys(original).forEach(function (attr) {

                if (original[attr]) {
                    if (typeof original[attr] === 'object') {
                        var _labelObj = {};

                        // if (labelObj && attr === labelObj.relation) {
                        //     _labelObj.label = original[attr][labelObj.label];
                        // }
                        Object.keys(original[attr]).forEach(function (objAttr) {
                            if (objAttr !== 'createdAt' && objAttr !== 'updatedAt') {
                                var _attr = objAttr;
                                if (objAttr !== 'id') _attr = 'label';
                                if (_attr === 'label' && labelObj && attr === labelObj.relation) {
                                    _labelObj.label = original[attr][labelObj.label];
                                } else {
                                    _labelObj[_attr] = original[attr][objAttr];
                                }
                            }
                        });

                        _objConv[attr+'.label'] = _labelObj;
                        _objConv[attr] = _labelObj.id;
                    } else if (attr.indexOf("id") === -1 && attr !== 'createdAt' && attr !== 'updatedAt') {
                        _objConv[attr] = original[attr];
                    }
                }
            });
            return _objConv;
        };

        self.convertObjLabels = function (list) {
            list.forEach(function (item) {
                Object.keys(item).forEach(function (_attr) {
                    if (typeof item[_attr] === 'object') {
                        var attrNoLabel = _attr.split('.')[0];
                        if (_attr.split('.')[1] === 'label') {
                            item[attrNoLabel] = angular.copy(item[_attr]);
                            delete item[_attr];
                        }
                    }
                });
            });
            return list;
        };

        self.setInputsFromObject = function (obj) {
            Object.keys(obj).forEach(function (attr) {

                if (obj[attr] && attr.indexOf("hashKey") === -1 && attr !== 'id' && attr !== 'createdAt' && attr !== 'updatedAt') {
                    var _attrScope = angular.element('#'+attr).scope();

                    if (_attrScope === undefined && attr.indexOf("label") !== -1) {
                        _attrScope = angular.element('#'+attr.split('.')[0]).scope();
                    }

                    // Skip IDs from autocomplete
                    if (_attrScope) {
                        if (!_attrScope.field.autocomplete) {
                            _attrScope.$parent.data[attr] = obj[attr];
                        }
                        else {
                            if (typeof obj[attr] === 'object') {
                                if (!obj[attr].label) obj[attr].label = obj[attr].nome;
                                _attrScope.$parent.data[attr] = obj[attr].label;
                                _attrScope.$parent.data[attr+'.label'] = obj[attr];
                            }
                        }
                    }
                }
            });
        };

        return {
            convertObjSearch: self.convertObjSearch,
            convertObjLabels: self.convertObjLabels,
            setInputsFromObject: self.setInputsFromObject
        };

    }

})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Datetime Service
*
* File:        services/utils/lets-utils-date-time.service.js
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
    angular
        .module('letsAngular')
        .service('utilsDateTimeService', utilsDateTimeService);
  
    utilsDateTimeService.inject = [];
  
    function utilsDateTimeService() {
  
        var self = this;
    
        self.getDiffDuration = function(start, end, type) {
            if(!moment.isMoment(start)) start = moment(start);
            if(!moment.isMoment(end)) end = moment(end);
      
            var diff = moment.duration(start.diff(end));
            switch (type) {
                case 'day':
                    return diff.asDays();
                case 'hour':
                    return diff.asHours();
                case 'minute':
                    return diff.asMinutes();
                case 'second':
                    return diff.asSeconds();
                case 'week':
                    return diff.asWeeks();
                case 'month':
                    return diff.asMonths();
                case 'year':
                    return diff.asYears();
                default:
                    return diff.asMilliseconds();
            }
        };
    
        return {
            getDiffDuration: self.getDiffDuration
        }
  
    }
  
})();
  
/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Comparator Service
*
* File:        services/utils/lets-utils-comparator.service.js
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
    angular
        .module('letsAngular')
        .service('utilsComparatorService', utilsComparatorService);
  
    utilsComparatorService.inject = [];
  
    function utilsComparatorService() {
  
        var self = this;
    
        /**
         * Get filled filter attributes in radiobuttons and checkboxes
         * @param radios
         * @param checkboxes
         * @return _obj: { radios: ['nome', 'tipo'], checkboxes: ['encaminhamentos'] }
         */
        self._getFilledFilterAttr = function(radios, checkboxes) {
            var _obj = {
            radios: [],
            checkboxes: []
            };
    
            Object.keys(radios).forEach(function (radioAttrName) {
            if (radios[radioAttrName] !== null) _obj.radios.push(radioAttrName);
            });
    
            Object.keys(checkboxes).forEach(function (cboxAttrName) {
            // var ckboxAttrName = raw.match(/(.+)(?:Results)/)[1];
            if (checkboxes[cboxAttrName].length > 0) _obj.checkboxes.push(cboxAttrName);
            });
    
            return _obj;
        };
    
        /**
         * Get checked attribute name inside object from name passed
         * ie. main obj: { nome: { tipo: 'Consulta' } }
         * ie. attr obj: { nome: 'tipo' }
         * Find tipo, which is a inner attr in nome attr in main obj
         * @param checkName
         * @param checkAttrNames
         * @return attr ('tipo')
         */
        self._findCheckAttr = function(checkName, checkAttrNames) {
            var attr = null;
            Object.keys(checkAttrNames).forEach(function (objKey) {
            if (objKey === checkName) attr = checkAttrNames[objKey];
            });
            return attr;
        };
    
        /**
         * Generic Filter List Method
         * @param list
         * @param filterRadios (i.e. { encaminhamentos: true, receituario: false } )
         * @param filterChecksOptions (i.e. { tipo: [Consulta, Retorno], status: [Finalizado, Cancelado] } )
         * @param filterChecksResults (i.e. { tipo: [Consulta], status: [Cancelado] } )
         * @param filterChecksPreviousResults (i.e. { tipo: [Consulta, Retorno], status: [Cancelado] } )
         * @param filterChecksLabels (i.e. { tipo: 'nome', status: 'nome' } )
         * @return _filtered (filtered list with reduced/added list items from original list)
         */
        self.filterList = function(list, filterRadios, filterChecksOptions,
                                    filterChecksResults, filterChecksPreviousResults, filterChecksLabels) {
    
            var _filtered = list.slice(0);
    
            var _cboxQty = Object.keys(filterChecksLabels).length;
    
            // 1. Check which filters need to be checked together
            var selectedFilters = self._getFilledFilterAttr(filterRadios, filterChecksResults);
    
            // Ex: obj.checkboxes [tipo, status] or obj.radios [encaminhamentos, receituario]
            // 2. If any of the checkboxes were not selected, clear list
            // Only works if obj radios are combined with checkboxes. Changed after _updatedType
            // if (selectedFilters.checkboxes.length !== _cboxQty) {
    
            // }
    
            // 3. If all checkboxes were at least selected with one option, continue algorithm for checkboxes
            // else {
            // 4. Check if an option were taken off or added comparing filterChecksResults with previous ones
            // If at least one of the checkboxes types have changes
            // Default type is neutral, when actual is equal to previous length
            var _updateType = 'neutral';
    
            selectedFilters.checkboxes.forEach(function (cboxName) {
            if (filterChecksResults[cboxName].length > filterChecksPreviousResults[cboxName].length) {
                _updateType = 'add';
            }
            else if (filterChecksResults[cboxName].length < filterChecksPreviousResults[cboxName].length) {
                _updateType = 'reduce';
            }
            });
    
            // 5. If actual size is bigger than previous selection, fill in all list items and reduce it again
            if (_updateType === 'add') {
            _filtered = list.slice(0);
            _updateType = 'reduce';
            }
            // }
    
            var _indexesToBeRemoved = [];
            var _removeAllMultipleOptions = selectedFilters.checkboxes.length !== _cboxQty;
    
            // 6. Check if any of the checkboxes are empty. If so, remove all listItems that are multiple combined (aside from radiobuttons)
            if (_removeAllMultipleOptions) {
            _filtered.forEach(function (listItem, index) {
                if (listItem.multiple) {
                if (_indexesToBeRemoved.indexOf(index) === -1) _indexesToBeRemoved.unshift(index);
                }
            })
            }
    
            // 7. Iterate each list item
            _filtered.forEach(function (listItem, index) {
    
                // 8. Iterate checkboxes keys for listItems that are multiple (ie. consultas and retornos)
                if (listItem.multiple && !_removeAllMultipleOptions) {
                selectedFilters.checkboxes.forEach(function (cboxName) {
                    // 9. If actual size is smaller than previous selection, need to reduce list items
                    if (_updateType === 'reduce') {
                    // 10. Check if in this checkbox all options were not selected.
                    // If so, element needs to be spliced from array.
                    if (filterChecksResults[cboxName].length !== filterChecksOptions[cboxName].length) {
    
                        // 11. Set a cbox flag as false to check if one of the options are true
                        var _valueCboxFlag = false;
    
                        // 12. Get inner attr in object so that it can find checkbox value to be compared
                        var innerAttr = self._findCheckAttr(cboxName, filterChecksLabels);
    
                        // 13. Iterate selected options (i.e. tipoResults: [Consulta, Retorno])
                        filterChecksResults[cboxName].forEach(function (cboxValueType) {
    
                        // 14. Check if listItem has cboxValueType in its object[attr]
                        if (listItem[cboxName][innerAttr] === cboxValueType) {
                            // 15. Set _valueCboxFlag as true to make this listItem remain on list
                            _valueCboxFlag = true;
                        }
                        });
    
                        // 16. Check if _valueCboxFlag remained as false. If so, remove listItem from list.
                        if (!_valueCboxFlag) {
                        if (_indexesToBeRemoved.indexOf(index) === -1) _indexesToBeRemoved.unshift(index);
                        }
                    }
                    }
    
                });
                }
    
                // 17. Iterate radio buttons keys for listItems that aren't multiple AND NOT COMBINATORY (ie. encaminhamentos/receitas/exames)
                else {
                // 18. Set a radio flag as false to check if one of the options are true
                var _valueRadioFlag = false;
    
                selectedFilters.radios.forEach(function (radioName) {
    
                    // 19. If item already combined with radio checked, do not continue and check for other options
                    if (!_valueRadioFlag) {
                    // 20. Check cases which element must remain in list
                    if (filterRadios[radioName] && listItem.label === radioName) {
                        _valueRadioFlag = true;
                    } else if (!filterRadios[radioName] && listItem.label === radioName) {
                        _valueRadioFlag = false;
                    }
                    }
    
                });
    
                // 21. Check if _valueRadioFlag remained as false. If so, remove listItem from list.
                if (!_valueRadioFlag) {
                    if (_indexesToBeRemoved.indexOf(index) === -1) _indexesToBeRemoved.unshift(index);
                }
                }
    
            });
    
            // 22. Check and remove all indexes from list
            _indexesToBeRemoved.forEach(function (index) {
            _filtered.splice(index, 1);
            });
    
            // 23. Sort by inicio date
            _filtered.sort(function (a, b) {
                return moment(b.inicio).diff(moment(a.inicio), "seconds");
            });
    
            return _filtered;
        };
    
        self.orderList = function (list, attr) {
            var _status = false;
            Object.keys(list[0]).forEach(function (_attr) {
                if (attr === _attr) _status = true;
            });
    
            if (_status) {
                return list.sort(function (a, b) {
                    if (a[attr] < b[attr]) return -1;
                    if (a[attr] > b[attr]) return 1;
                    return 0;
                });
            }
            else return list;
        };
    
        /**
         * Get data list of x/y charts and return offsetted min and maxs
         * @param {String} xType
         * @param {xLabel} xLabel
         * @param {Number} xOffset
         * @param {String} yType
         * @param {xLabel} yLabel
         * @param {Number} yOffset
         * @param {Array} data
         * @return {Object} min/max attributes
         */
        self.getMinMaxValues = function (xType, xLabel, xOffset, yType, yLabel, yOffset, data) {
            var min = { x: data[0][xLabel], y: data[0][yLabel] };
            var max = { x: data[0][xLabel], y: data[0][yLabel] };
    
            data.forEach(function (item) {
                if (item[xLabel] < min.x) min.x = item[xLabel];
                if (item[xLabel] > max.x) max.x = item[xLabel];
    
                if (item[yLabel] < min.y) min.y = item[yLabel];
                if (item[yLabel] > max.y) max.y = item[yLabel];
            });
    
            if (xType === 'date') {
                min.x = new Date(moment(min.x).subtract(xOffset, 'day').format('MM/DD/YYYY'));
                max.x = new Date(moment(max.x).add(xOffset, 'day').format('MM/DD/YYYY'));
            }
            else {
                min.x -= xOffset;
                max.x += xOffset;
            }
    
            if (yType === 'date') {
                min.y = new Date(moment(min.y).subtract(yOffset, 'day').format('MM/DD/YYYY'));
                max.y = new Date(moment(max.y).add(yOffset, 'day').format('MM/DD/YYYY'));
            }
            else {
                min.y -= yOffset;
                max.y += yOffset;
            }
    
            return { min: min, max: max };
        }
  
        return {
            filterList: self.filterList,
            orderList: self.orderList,
            getMinMaxValues: self.getMinMaxValues
        };
    }
})();
  
/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Modal Service
*
* File:        services/framework/lets-fw-modal.service.js
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
    fwModalService.$inject = ["$modal", "jQuery", "$rootScope"];
    angular
        .module('letsAngular')
        .service('fwModalService', fwModalService);
  
    fwModalService.inject = ['$modal', 'jQuery', '$rootScope'];
  
    function fwModalService($modal, jQuery, $rootScope) {
  
        var self = this;
    
        self._createModal = function (config) {
            return $modal.open(config).result;
        };
    
        self.createCRUDModal = function (headers, parentModel, data, autocompleteDetail, ctrl, template) {
            return self._createModal({
            animation: true,
            templateUrl: template || 'src/views/crud/crud-modal.html',
            controller: ctrl || 'CRUDFormModalController',
            resolve: {
                headers: function() { return headers; },
                parentModel: function() { return parentModel; },
                autocompleteDetail: function() { return autocompleteDetail; },
                data: function() {
                var _data;
                try {
                    _data = angular.copy(data);
                } catch(error) {
                    _data = jQuery.extend({}, data);
                }
                return _data;
                }
            },
            size: 'lg',
            backdrop: 'static',
            keyboard: false
            });
        };
    
        self.hide = function () {
            $rootScope.$emit('cancel-modal');
        };
    
        return {
            createCRUDModal: self.createCRUDModal,
            hide: self.hide
        };
    }
  
})();
  
/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Error Service
*
* File:        services/framework/lets-fw-error.service.js
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
    fwErrorService.$inject = ["ngToast"];
    angular
        .module('letsAngular')
        .service('fwErrorService', fwErrorService);

    fwErrorService.inject = ['ngToast'];

    function fwErrorService (ngToast) {

        var self = this;

        self.emitFormErrors = function (crudForm) {
            var messages = [];
            var errorTypes = Object.keys(crudForm.$error);
            var pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

            for (var t in errorTypes) {
                var type = crudForm.$error[errorTypes[t]];

                for (var _x in type) {
                    var label = type[_x].$options.fieldInfo.label;
                    if (errorTypes[t] == 'required') {
                        messages.push('O campo ' + label + ' é obrigatório');
                    } else if (errorTypes[t] == 'date' && pattern.test(type[_x].$viewValue) == false) {
                        messages.push('O campo ' + label + ' está com uma data inválida');
                    }
                }
            }

            if (messages.length > 0) ngToast.warning(messages.join("<br />"));
        };

        return {
            emitFormErrors: self.emitFormErrors
        };
    }

})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Chart Service
*
* File:        services/framework/lets-fw-chart.service.js
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
  
(function () {
    'use strict';
    fwAuthService.$inject = ["$window", "LoopBackAuth", "Usuario", "$state", "$auth", "appSettings", "$http", "$q"];
    angular
        .module('letsAngular')
        .service('fwAuthService', fwAuthService);
  
    fwAuthService.inject = ['$window', 'LoopBackAuth', 'Usuario', '$state', '$auth', 'appSettings', '$http'];
  
    function fwAuthService($window, LoopBackAuth, Usuario, $state, $auth, appSettings, $http, $q) {
        var SERVER_URL = appSettings.API_URL;
        var self = this;
    
        self.updateLocalStorage = function (item, i) {
            var user = self.getUser();
            user[item] = i;
            self.setUserInfo(user);
        }
    
        self.setUserLb = function (accessToken) {
            // console.log(LoopBackAuth);
            LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
            LoopBackAuth.rememberMe = true;
            LoopBackAuth.save();
        }
    
        self.setUserInfo = function (user) {
            window.localStorage['user'] = angular.toJson(user);
        }
    
        self.getUser = function () {
            if (window.localStorage['user']) {
                return JSON.parse(window.localStorage['user']);
            }
            return false;
        }
    
        self.isAuthenticated = function () {
            return LoopBackAuth.currentUserId != null;
        }
    
        //Autenticacao Provider
        self.authenticate = function (provider) {
            // self.count++;
            return $auth.authenticate(provider)
                .then(function (response) {
                    var obj = { accessToken: response.access_token }
                    return $http.post(SERVER_URL + 'users/facebook/token', obj);
                })
                .then(function (response) {
                    // console.log(response);
                    var accessToken = {
                        id: response.data.id,
                        userId: response.data.user.id,
                        user: response.data.user
                    }
                    self.setUserLb(accessToken);
                    self.setUserInfo(response.data.user);
                    self.removeSatellizer();
                    //$auth.setToken(response.data.id);
                    // window.localStorage['user'] = angular.toJson(response.data.user);
                    // window.localStorage['$LoopBack$accessTokenId'] = window.localStorage.getItem('satellizer_token');
                    // window.localStorage['$LoopBack$currentUserId'] = JSON.parse(window.localStorage.getItem('user')).id;
                    // window.localStorage['$LoopBack$rememberMe'] = true;
                    $state.go('main.search');
                })
                .catch(function (err) {
                    console.debug(err);
                })
            // .finally(function () {
            //      self.count--;
            // })
        }
    
        self.logout = function (token) {
            Usuario.userLogout({ 'accessToken': token })
                .$promise
                .then(function (success) {
                    LoopBackAuth.clearUser();
                    LoopBackAuth.clearStorage();
                    $window.localStorage.removeItem('user');
                    $state.go('login');
                })
                .catch(function (err) {
                    // console.log('err');
                    // console.log(err);
                    LoopBackAuth.clearUser();
                    LoopBackAuth.clearStorage();
                    $window.localStorage.removeItem('user');
                    $state.go('login');
                });
        }
    
        self.getCurrentUserId = function () {
            return LoopBackAuth.currentUserId;
        }
    
        self.getCurrentUserToken = function () {
            return LoopBackAuth.accessTokenId;
        }
    
        self.removeSatellizer = function () {
            if ($window.localStorage.getItem('satellizer_token')) {
                $window.localStorage.removeItem('satellizer_token');
            }
        }
    }
})();
  
/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - File Load Provider
*
* File:        providers/framework/lets-fw-file-load.provider.js
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
    angular
        .module('letsAngular')
        .provider('fwFileLoad', fwFileLoadProvider);

    function fwFileLoadProvider () {

        this.$get = ['$templateRequest', function($templateRequest) {
            return new FwFileLoadService($templateRequest);
        }];

    }

    function FwFileLoadService ($templateRequest) {
  
        var self = this;

        self.getCrudBaseTemplate = function () {
            return $templateRequest('src/views/crud/crud.html');
        };

        self.getCrudListTemplate = function () {
            return $templateRequest('src/views/crud/crud-list.html');
        };
        
        self.getCrudEditTemplate = function () {
            return $templateRequest('src/views/crud/crud-edit.html');
        };
    
        return {
            getCrudBaseTemplate: self.getCrudBaseTemplate,
            getCrudListTemplate: self.getCrudListTemplate,
            getCrudEditTemplate: self.getCrudEditTemplate
        };
  
    }
})();
  
/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Framework Age Month Filter
*
* File:        filters/lets-fw-age-month.filter.js
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

    fwAgeMonth.$inject = ["birthday"];
    angular.module('letsAngular')
        .filter('fwAgeMonth', fwAgeMonth);

    /**
     * Calculate age from birthday
     * @param {String of Date} birthday 
     */
    function fwAgeMonth (birthday) {
        if (birthday != null) {

            if (typeof birthday == 'string') {
                birthday = new Date(birthday);
            }

            var _birthType = ' meses';
            var _birthMoment = moment(birthday);
            var _age = moment().diff(_birthMoment, 'months');
            if (!_age) {
                _birthType = ' dias';
                _age = moment().diff(_birthMoment, 'days');
            }
            else if (_age > 12) {
                _birthType = ' anos';
                _age = moment().diff(_birthMoment, 'years');
            }

            return _age + _birthType;
            // var ageDifMs = Date.now() - birthday.getTime();
            //
            //
            // var ageDate = new Date(ageDifMs); // miliseconds from epoch
            // var meses = ageDate.getUTCMonth();
            //
            // return Math.abs(ageDate.getUTCFullYear() - 1970) + ' anos ' + (meses > 0 ? ('e ' + meses + (meses > 1 ? ' meses' : ' mês')) : '');
        }
    }
})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Backgrid Factory
*
* File:        factories/backgrid.directive.js
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
        .factory('Backgrid', BackgridFactory);

    BackgridFactory.$inject = ['$window'];

    function BackgridFactory($window) {
        return $window.Backgrid;
    }

})();

/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Backbone Factory
*
* File:        factories/backbone.directive.js
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
        .factory('Backbone', BackboneFactory);

    BackboneFactory.$inject = ['$window'];

    function BackboneFactory($window) {
        return $window.Backbone;
    }

})();

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

    var module = angular.module('letsAngular');

    module.controller('CRUDController', ["$scope", "Restangular", "module", "$state", "$window", "$stateParams", "$rootScope", "headers", function ($scope, Restangular, module, $state, $window, $stateParams, $rootScope, headers) {
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
    }]);

})();
/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud Form Modal Controller
*
* File:        controllers/lets-crud-form-modal.controller.js
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

    var module = angular.module('letsAngular');

    module.controller('CRUDFormModalController', ["$controller", "$scope", "$modalInstance", "ngToast", "headers", "Restangular", "$stateParams", "$timeout", "$state", "$rootScope", "$q", "$http", "Upload", "$modal", "parentModel", "autocompleteDetail", "data", "fwStringService", "auth", "fwObjectService", "fwErrorService", function ($controller, $scope, $modalInstance, ngToast, headers, Restangular, $stateParams, $timeout, $state, $rootScope, $q, $http, Upload, $modal, parentModel, autocompleteDetail, data, fwStringService, auth, fwObjectService, fwErrorService) {
        $controller('CRUDEditController', { $scope: $scope, Restangular: Restangular, $stateParams: $stateParams, $timeout: $timeout, $modal: $modal, module: module, $state: $state, $rootScope: $rootScope, $q: $q, ngToast: ngToast, $http: $http, Upload: Upload });

        $scope.data = data || {};
        $scope.data.emp_id = auth.getUser().emp_id;
        headers.modal_tab = true;
        $scope.headers = headers;
        $scope.acdetail = autocompleteDetail;

        parentModel = fwStringService.lemmatize(parentModel);
        $scope.resource = Restangular.all(parentModel);

        $scope.cancel = function () {
            if ($scope.data.disabled !== undefined) data.disabled = true;
            $modalInstance.dismiss('cancel');
        }
        $scope.submit = function () {
            if (this.crudForm.$valid) {
                $modalInstance.close($scope.data);
            } else {
                fwErrorService.emitFormErrors(this.crudForm)
            }
        };
        $scope.$on('selected-autocomplete', function (event, res) {
            
        });
        $rootScope.$on('cancel-modal', function (event, res) {
            $modalInstance.dismiss('cancel');
        });

    }]);

})();
/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud Edit Controller
*
* File:        controllers/lets-crud-edit.controller.js
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

    var module = angular.module('letsAngular');

    module.controller('CRUDEditController', ["$scope", "Restangular", "$stateParams", "$timeout", "$modal", "module", "$state", "$rootScope", "$q", "ngToast", "$http", "Upload", "fwModalService", "Atendimento", function ($scope, Restangular, $stateParams, $timeout, $modal, module, $state, $rootScope, $q, ngToast, $http, Upload, fwModalService, Atendimento) {

        $scope.data = {};
        $scope.dataLoaded = false;
        $scope.module = module;
        $scope.$http = $http;

        $scope.datepickers = {};
        $scope.datepickerToggle = function (name) {
            if ($scope.datepickers[name] == undefined) {
                $scope.datepickers[name] = false;
            }
            $scope.datepickers[name] = !$scope.datepickers[name];
        }

        $scope.fetchData = function () {
            if ($stateParams.id) {
                $scope.$parent.resource.customGET('crudGET/' + $stateParams.id).then(function (data) {
                    // console.log(data);
                    // @todo finish parsing detail data
                    for (var y in $scope.headers.fields) {
                        // console.log(data[$scope.headers.fields[y].name]);
                        var field = $scope.headers.fields[y];
                        if (field.type == 'date' && (data[field.name] != undefined && data[field.name] != null)) {
                            data[field.name] = new Date(data[field.name]);
                        }

                        if (field.customOptions.f) {

                        }
                    }
                    // Establish read-only on tab-sessions or masterdetails fields that are filled with data
                    var list = $scope.headers.tabs_session;
                    if (list === undefined) {
                        // Since masterdetails is an object, convert it to a list to be iterated
                        list = [];
                        for (var prop in $scope.headers.masterdetails) {
                            list.push($scope.headers.masterdetails[prop]);
                        }
                    }
                    for (var i in list) {
                        var label = list[i].label_stem;
                        if (data[label] !== undefined && data[label].length > 0) {
                            for (var j in data[label]) {
                                data[label][j].disabled = true;
                            }
                        }
                    }
                    $scope.data = data;
                    $scope.dataLoaded = true;
                    $scope.$emit('data-loaded');
                });
            } else {

                for (var y in $scope.headers.fields) {
                    // console.log(data[$scope.headers.fields[y].name]);
                    var field = $scope.headers.fields[y];
                    if (field.type == 'boolean') {
                        $scope.data[field.name] = field.customOptions.default ? field.customOptions.default : false;
                    }
                }

                $scope.dataLoaded = true;
                $scope.$emit('data-loaded');
            }
        };

        if ($scope.headersReady) {
            $scope.fetchData();
        }

        $scope.$on('headers-set', function () {
            $scope.fetchData();
        })

        $scope._upload = function (field, file) {
            var _url = $rootScope.appSettings.API_URL + 'upload';

            if (field.customOptions.file.container != undefined) {
                _url += '/' + field.customOptions.file.container + '/upload'
            }

            return Upload.upload({
                url: _url,
                data: { file: file }
            });
        }

        $scope.download = function (field, id) {
            if (field.customOptions.file.container != undefined) {
                var url = $rootScope.appSettings.API_URL + 'upload/' + field.customOptions.file.container + '/download/' + $scope.data[field.name];
            } else {
                var url = ($rootScope.appSettings.API_URL + $scope.module + '/download/' + field.name + '/' + id);
            }

            $scope._download(url, field);
        }

        $scope.downloadDetail = function (detail, field, id) {
            // window.open($rootScope.appSettings.API_URL + $scope.module + '/details/' + detail + '/download/' + field.name + '/' + id);
            var url = $rootScope.appSettings.API_URL + $scope.module + '/details/' + detail + '/download/' + field.name + '/' + id;

            $scope._download(url, field);
        }

        $scope._download = function (url, field) {
            this.$http({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer'
            }).success(function (data, status, headers) {
                headers = headers();
                if (field.customOptions.file.container != undefined) {
                    var filename = $scope.data[field.name];
                } else {
                    var filename = headers['content-disposition'].split(';')[1].split('=')[1].split('"')[1];
                }

                var contentType = headers['content-type'];

                var blob = new Blob([data], { type: contentType });

                $scope.downloadFile(blob, filename);
            });
        }

        $scope.downloadFile = function (blob, filename) {
            var linkElement = document.createElement('a');
            try {
                var url = window.URL.createObjectURL(blob);

                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", filename);

                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                linkElement.dispatchEvent(clickEvent);
            } catch (e) {
                // console.log(e);
            }
        }

        $scope.submit = function () {
            var $_scope = this;
            // console.log(this.crudForm.$valid);
            var err = {};
            var _data = $_scope.data;
            _.each($_scope.headers.fields, function (field, key) {
                if (field.type == 'password' && field.name.indexOf('confirm') != 0) {
                    if (_data['confirm_' + field.name] != _data[field.name]) {
                        err.password = 'Os campos "' + field.label + '" e "Confirmar ' + field.label + '" não são iguais';
                    }
                }
            });
            _.each($_scope.data, function (dataValue, key) {
                if (key.indexOf('.label') !== -1 && _data.id === undefined) {
                    if (typeof dataValue !== 'object' && dataValue !== '') {
                        err[key] = 'Adicione o(a) ' + key.split('.')[0] + ' no sistema antes de escolher nesse formulário!';
                    }
                }
                if (key === 'data_nascimento') {
                    if (moment(dataValue).isAfter(moment()) || moment(dataValue).isSame(moment(), "day")) {
                        err[key] = 'Insira uma data de nascimento válida, anterior ao dia de hoje!';
                    }
                }
            });
            if (Object.keys(err).length > 0) {
                var _messages = new Array();
                _.each(err, function (value, key) {
                    _messages.push(value);
                });
                ngToast.warning(_messages.join("<br />"));
            }
            else if (this.crudForm.$valid) {
                // if (true) { //this.crudForm.$valid) {
                // console.log('jajajajaj');

                if (!$stateParams.id) {
                    var response = $scope.$parent.resource.post($scope.data);
                } else {
                    var response = $scope.data.put();
                }

                response.then(function () {
                    if ($scope.doAfterSave != undefined && typeof $scope.doAfterSave == 'function') {
                        $scope.doAfterSave();
                    } else {
                        $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'));
                    }
                }, function errorCallback(error) {
                    var messages = [];
                    function findLabel(name) {
                        for (var _x in $_scope.headers.fields) {
                            var field = $_scope.headers.fields[_x];

                            if (field.name == name) {
                                return field.label;
                            }
                        }
                    }

                    if (error.status == 422) { //hook for loopback
                        if (error.data.error.code == 'CANT_SAVE_MODEL') {
                            messages.push(error.data.error.message);
                        } else {
                            var codes = error.data.error.details.codes;

                            var friendlyErrors = {
                                presence: 'O campo %s é obrigatório',
                                absence: 'O campo %s deve ser nulo',
                                'unknown-property': 'O campo %s não foi definido',
                                length: {
                                    min: 'O campo %s é muito curto',
                                    max: 'O campo %s é muito longo',
                                    is: 'O campo %s está com tamanho inválido',
                                },
                                common: {
                                    blank: 'O campo %s está em branco',
                                    'null': 'O campo %s está nulo',
                                },
                                numericality: {
                                    'int': 'O campo %s não é um número inteiro',
                                    'number': 'O campo %s não é um número',
                                },
                                inclusion: 'O campo %s não foi incluído na lista',
                                exclusion: 'O campo %s não pode ser excluído',
                                uniqueness: 'O campo %s está repetido com o de outro registro',
                            }

                            // debugger;
                            _.each(codes, function (code, key) {
                                var _name = findLabel(key);

                                var _message = friendlyErrors[code].replace('%s', _name);
                                // debugger;
                                // console.log(code, key);
                                messages.push(_message);
                            })
                        }

                    }

                    ngToast.warning(messages.join("<br />"));
                });
            } else {
                // debugger;
                var messages = [];
                var errorTypes = Object.keys(this.crudForm.$error);
                var pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

                for (var t in errorTypes) {
                    var type = this.crudForm.$error[errorTypes[t]];

                    for (var _x in type) {
                        var label = type[_x].$options.fieldInfo.label;
                        if (errorTypes[t] == 'required') {
                            // console.log(type[_x].$name);
                            // debugger;
                            // var label = $scope.headers.findLabel(type[_x].$name);

                            messages.push('O campo ' + label + ' é obrigatório');
                        } else if (errorTypes[t] == 'date' && pattern.test(type[_x].$viewValue) == false) {
                            messages.push('O campo ' + label + ' está com uma data inválida');
                        }
                    }
                }

                // var _fields = $(window.crudForm).parsley().fields;

                // for (var _x in _fields) {
                //     var _field = _fields[_x];
                //     // $_scope_field.$element.attr('name');
                //     // debugger;

                //     var errors = ParsleyUI.getErrorsMessages(_field);

                //     if (errors.length > 0) {
                //         var a = _field.$element[0].closest('.input-container')
                //         var name = a.attributes['data-name'].value;
                //         var label = $scope.headers.findLabel(name);

                //         // console.log(label, errors);
                //         for (var _y in errors) {

                //             messages.push(errors[_y].replace('Este campo ', 'O campo ' + label + ' '));

                //         }
                //     }


                // }
                if (messages.length > 0) {
                    ngToast.warning(messages.join("<br />"));
                }
                else {
                    if (!$stateParams.id) {
                        var response = $scope.$parent.resource.post($scope.data);
                    } else {
                        var response = $scope.data.put();
                    }

                    response.then(function () {
                        if ($scope.doAfterSave != undefined && typeof $scope.doAfterSave == 'function') {
                            $scope.doAfterSave();
                        } else {
                            $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'));
                        }
                    }, function errorCallback(error) {
                        console.log(error);

                        var messages = [];


                        function findLabel(name) {
                            for (var _x in $_scope.headers.fields) {
                                var field = $_scope.headers.fields[_x];

                                if (field.name == name) {
                                    return field.label;
                                }
                            }
                        }

                        if (error.status == 422) { //hook for loopback
                            if (error.data.error.code == 'CANT_SAVE_MODEL') {
                                messages.push(error.data.error.message);
                            } else {
                                var codes = error.data.error.details.codes;

                                var friendlyErrors = {
                                    presence: 'O campo %s é obrigatório',
                                    absence: 'O campo %s deve ser nulo',
                                    'unknown-property': 'O campo %s não foi definido',
                                    length: {
                                        min: 'O campo %s é muito curto',
                                        max: 'O campo %s é muito longo',
                                        is: 'O campo %s está com tamanho inválido',
                                    },
                                    common: {
                                        blank: 'O campo %s está em branco',
                                        'null': 'O campo %s está nulo',
                                    },
                                    numericality: {
                                        'int': 'O campo %s não é um número inteiro',
                                        'number': 'O campo %s não é um número',
                                    },
                                    inclusion: 'O campo %s não foi incluído na lista',
                                    exclusion: 'O campo %s não pode ser excluído',
                                    uniqueness: 'O campo %s está repetido com o de outro registro',
                                }

                                // debugger;
                                _.each(codes, function (code, key) {
                                    var _name = findLabel(key);

                                    var _message = friendlyErrors[code].replace('%s', _name);
                                    // debugger;
                                    // console.log(code, key);
                                    messages.push(_message);
                                })
                            }

                        }

                        ngToast.warning(messages.join("<br />"));
                    });
                }

            }
        };

        $scope.cancel = function () {
            $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'));
        };

        $scope.autocompleteModels = {};

        // $scope.newDetail = function (tab, data) {
        //     // console.log(tab,data);
        //
        //     var modalInstance = $modal.open({
        //         animation: true,
        //         templateUrl: 'app/modules/core/utils/crud/crud-form.html',
        //         controller: 'CRUDEditDetailController',
        //         resolve: {
        //             headers: {
        //                 fields: tab.fields,
        //                 route: module + tab.route,
        //                 // route: module + '/:id/' + tab.name,
        //                 label_row: tab.label_row,
        //                 label: tab.label,
        //                 tabs: {}
        //             }
        //         }
        //         // size: size,
        //         // resolve: {
        //         //   items: function () {
        //         //     return $scope.items;
        //         //   }
        //         // }
        //     });
        //
        //     $rootScope.$$phase || $rootScope.$apply();
        //
        //     modalInstance.result.then(function (selectedItem) {
        //         $scope.selected = selectedItem;
        //     }, function () {
        //         // console.info('Modal dismissed at: ' + new Date());
        //     });
        // };
        // $scope.autocompleteWrapper = function(field, val) {
        //   console.log(field, val);
        // }

        $scope.autocompleteAdd = function (query) {
            // console.log(query);
        }

        $scope.autocomplete = function (field, val) {

            var queries = [];

            var deferred = $q.defer();

            if (field.autocomplete_dependencies.length > 0) {
                var deps = field.autocomplete_dependencies;
                for (var x in deps) {
                    var dep = deps[x];
                    if ($scope.data[dep.field] == undefined || $scope.data[dep.field] == null) {
                        // window.alert('missing ' + dep);
                        //            var text = 'missing ' + dep.field;


                        var text = 'Selecione antes o(a) ' + dep.label;

                        var data = [];
                        data.push({ id: -1, label: text });

                        deferred.resolve(data);

                        return deferred.promise;
                    } else {
                        queries[dep.field] = $scope.data[dep.field];
                        // queries.push(dep + "=" + $scope.data[dep]);
                    }

                    // console.log("?" + queries.join("&"));
                }
            }
            // return $scope.resource.customGET('autocomplete/' + field.name + '/' + val, queries);



            val = val.trim();
            if (val.length == 0 || field.customOptions.select == true) {
                val = '[blank]';
            }

            if (field.customOptions.general !== undefined) {
                $scope.resource.customGET('general/autocomplete/' + field.customOptions.general + '/' + val, queries).then(function (data) {

                    if (field.quickAdd === true && val != '[blank]') {
                        data.push({ id: -1, label: 'Adicionar novo: ' + val });
                    }

                    deferred.resolve(data);

                }, function errorCallback() {
                    return deferred.reject();
                });
            } else if (field.customOptions.list == undefined) {
                $scope.resource.customGET('autocomplete/' + field.name + '/' + val, queries).then(function (data) {

                    if (field.quickAdd === true && val != '[blank]') {
                        data.push({ id: -1, label: 'Adicionar novo: ' + val });
                    }

                    deferred.resolve(data);

                }, function errorCallback() {
                    return deferred.reject();
                });
            } else {
                deferred.resolve(field.customOptions.list);
            }
            return deferred.promise;
        }

        $scope.autocompleteDetail = function (detail, field, val) {

            var queries = [];

            var deferred = $q.defer();

            if (field.autocomplete_dependencies.length > 0) {
                var deps = field.autocomplete_dependencies;
                for (var x in deps) {
                    var dep = deps[x];
                    if ($scope.data[dep.field] == undefined || $scope.data[dep.field] == null) {
                        // window.alert('missing ' + dep);
                        //            var text = 'missing ' + dep.field;

                        var text = 'Selecione antes o(a) ' + dep.label;

                        var data = [];
                        data.push({ id: -1, label: text });

                        deferred.resolve(data);

                        return deferred.promise;
                    } else {
                        queries[dep.field] = $scope.data[dep.field];
                        // queries.push(dep + "=" + $scope.data[dep]);
                    }

                    // console.log("?" + queries.join("&"));
                }
            }

            val = val.trim();
            if (val.length == 0 || field.customOptions.select == true) {
                val = '[blank]';
            }

            if (field.customOptions.general !== undefined) {
                $scope.resource.customGET('general/autocomplete/' + field.customOptions.general + '/' + val, queries).then(function (data) {

                    if (field.quickAdd === true && val != '[blank]') {
                        data.push({ id: -1, label: 'Adicionar novo: ' + val });
                    }

                    deferred.resolve(data);

                }, function errorCallback() {
                    return deferred.reject();
                });
            } else $scope.resource.customGET('details/' + detail + '/autocomplete/' + field.name + '/' + val, queries).then(function (data) {
                if (field.quickAdd && val != '[blank]') {
                    data.push({ id: -1, query: val, label: 'Adicionar novo: ' + val });
                }

                deferred.resolve(data);

            }, function errorCallback() {
                return deferred.reject();
            });

            return deferred.promise;
        }

        $scope.autocompleteSelect = function ($item, $model, $label) {
            $scope.$emit('selected-autocomplete', { type: this.field.name, data: $item });
            if (typeof $item.id != 'integer' || (typeof $item.id == 'integer' && $item.id > 0)) {
                this.data[this.field.name] = $item.id;
            } else {
                this.data[this.field.name + '.label'] = null;
                return false;
                // $scope.resource.customPOST('quickAdd/')
                // this.field.name
            }
        }

        $scope.doafterAutoCompleteSelect = function ($item, $model, $label) {

        }

        $scope.autocompleteDetailSelect = function (detail, $item, $model, $label) {
            if ($item.id != -1) {
                this.data[this.$parent.field.name] = $item.id;
            } else {
                $item.$scope = this;

                $scope.resource.customPOST({ query: $item.query }, 'quickAdd/' + this.field.name).then(function (data) {
                    $item.$scope.data[$item.$scope.field.name] = data.id;
                    $item.$scope.data[$item.$scope.field.name + '.label'] = $item.query;
                }, function errorCallback() {
                    ngToast.warning('Houve algum problema ao adicionar...');
                });
            }
            // this.$parent.data[detail][this.$parent.field] = $item.id;
            // this.data[this.$parent.field.name] = $item.id;

            $scope.doafterAutoCompleteSelect.call(this, this.data, $item, $model, $label)
        };

        $scope.openPopup = function ($event) {
            // console.log('tango');
            $event.preventDefault();
            $event.stopPropagation();
            this.popupOpen = true;
        };

        $scope.deleteDetailData = function (detail_data, detail_key) {
            // console.log(detail_data, detail_key);
            if (window.confirm('Deseja realmente excluir esse item?')) {
                this.data[detail_key].splice(this.data[detail_key].indexOf(detail_data), 1);
            }
        };

        $scope.deleteDetail = function (route, row) {
            // $http.delete($rootScope.appSettings.API_URL + route + '/' + row.id).then(function(response) {
            //   $rootScope.$broadcast('refreshGRID');
            // });
            var resource = Restangular.all(route);
            resource.customDELETE(row.id).then(function () {
                // $state.go($scope.$parent.path + '.list');
                $rootScope.$broadcast('refreshGRID');
                $rootScope.$broadcast('data-grid-updated', { type: route.split('/').pop() });
            });
        };

        $scope.editDetail = function (route, row, detail_key) {
            var origin = jQuery('.button-new').attr('origin');
            var headers = $scope.headers[origin][detail_key];
            var parentModel = $scope.headers.route.toLowerCase();
            if ($scope.headers.parent_route) parentModel = $scope.headers.parent_route;

            fwModalService.createCRUDModal(headers, parentModel, row, true)
              .then(function (response) {
                  var resource = Restangular.all(route);
                  resource.customPUT(response, row.id).then(function (data) {
                    // $state.go($scope.$parent.path + '.list');
                    $rootScope.$broadcast('refreshGRID');
                    $rootScope.$broadcast('data-grid-updated', { type: route.split('/').pop() });
                  });
              });
        };

        $scope.editDetailData = function (detail_data, detail_key) {

            var origin = jQuery('.button-new').attr('origin');
            var headers = $scope.headers[origin][detail_key];
            var parentModel = $scope.headers.route.toLowerCase();

            detail_data.disabled = false;

            function processResponse(response) {
                headers.fields.forEach(function(x) {
                    detail_data[x.name] = response[x.name];
                });

                detail_data.disabled = true;
            }

            fwModalService.createCRUDModal(headers, parentModel, detail_data, true)
                .then(function (response) {
                    // detail_data = response;

                    processResponse(response);

                });
        };

        $scope.buttonClick = function (method) {
          $scope[method]();
        };

    }]);

})();
/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Crud Edit Detail Controller
*
* File:        controllers/lets-crud-edit-detail.controller.js
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

    var module = angular.module('letsAngular');

    module.controller('CRUDEditDetailController', ["$scope", "Restangular", "$stateParams", "$timeout", "headers", "$rootScope", "$modalInstance", "$q", "ngToast", function ($scope, Restangular, $stateParams, $timeout, headers, $rootScope, $modalInstance, $q, ngToast) {

        $scope.data = {};
        $scope.headers = headers;

        $scope.resource = Restangular.all(headers.route);

        $scope.datepickers = {};
        $scope.datepickerToggle = function (name) {
            if ($scope.datepickers[name] == undefined) {
                $scope.datepickers[name] = false;
            }
            $scope.datepickers[name] = !$scope.datepickers[name];
        }

        $timeout(function () { //@todo it must change

            $scope.submit = function () {
                if (this.crudForm.$valid) {
                    $scope.resource.customPOST($scope.data, $stateParams.id).then(function () {
                        $rootScope.$broadcast('refreshGRID');
                        $modalInstance.dismiss('success');

                    }, function errorCallback(error) {
                        var messages = [];

                        for (var name in error.data) {
                            for (var idx in error.data[name]) {
                                messages.push(error.data[name][idx]);
                            }
                        }
                        console.log('entrou nesse aqui');
                        ngToast.warning(messages.join("<br />"));
                    });
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.autocompleteModels = {};

            // $scope.autocompleteAdd = function(field, query) {
            //   // console.log(field, query);
            //
            //   return $scope.resource.customPOST('quickAdd/' + field.name + '/' + query);
            // }

            $scope.autocomplete = function (field, val) {

                var queries = [];
                if (field.autocomplete_dependencies.length > 0) {
                    var deps = field.autocomplete_dependencies;
                    for (var x in deps) {
                        var dep = deps[x];

                        if ($scope.data[dep] == undefined || $scope.data[dep] == null) {
                            ngToast.warning('missing ' + dep);
                            return;
                        } else {
                            queries[dep] = $scope.data[dep];
                            // queries.push(dep + "=" + $scope.data[dep]);
                        }

                        // console.log("?" + queries.join("&"));
                    }
                }

                var deferred = $q.defer();

                val = val.trim();
                if (val.length == 0) {
                    val = '[blank]';
                }

                if (field.customOptions.general !== undefined) {
                    var _resource = Restangular.all(headers.generalRoute);
                    _resource.customGET('general/autocomplete/' + field.customOptions.general + '/' + val, queries).then(function (data) {

                        if (field.quickAdd === true && val != '[blank]') {
                            data.push({ id: -1, label: 'Adicionar novo: ' + val });
                        }


                        deferred.resolve(data);

                    }, function errorCallback() {
                        return deferred.reject();
                    });
                } else {
                    $scope.resource.customGET('autocomplete/' + field.name + '/' + val, queries).then(function (data) {
                        if (field.quickAdd && val != '[blank]') {
                            data.push({ id: -1, query: val, label: 'Adicionar novo: ' + val });
                        }

                        deferred.resolve(data);

                    }, function errorCallback() {
                        return deferred.reject();
                    });
                }

                return deferred.promise;
            }

            // $scope.autocompleteDetail = function(detail, field, val) {
            //   return $scope.resource.customGET('details/autocomplete/' + detail + '/' + field.name + '/' + val);
            // }

            $scope.autocompleteSelect = function ($item, $model, $label) {
                $scope.$emit('selected-autocomplete', { type: this.field.name, data: $item });
                console.log($item)
                if ($item.id != -1) {
                    this.data[this.field.name] = $item.id;
                } else {
                    $item.$scope = this;

                    $scope.resource.customPOST({ query: $item.query }, 'quickAdd/' + this.field.name).then(function (data) {
                        $item.$scope.data[$item.$scope.field.name] = data.id;
                        $item.$scope.data[$item.$scope.field.name + '.label'] = $item.query;

                    }, function errorCallback() {
                        ngToast.warning('Houve algum problema ao adicionar...');
                    });
                }
            }

            // $scope.autocompleteDetailSelect = function(detail, $item, $model, $label) {
            //   // this.$parent.data[detail][this.$parent.field] = $item.id;
            //   this.detail_data[this.$parent.field.name] = $item.id;
            // }



        }, 500);

    }]);

})();