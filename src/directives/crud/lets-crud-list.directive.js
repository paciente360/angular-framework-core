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
            controller: function ($scope) {
                $scope.route = null;

                $scope.$on('refreshGRID', function () {
                    console.log('Refreshing grid...')
                    $scope.pageableCRUDModel.fetch();
                });
            },
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
