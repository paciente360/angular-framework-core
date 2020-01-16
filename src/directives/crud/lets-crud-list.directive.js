(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('crudList', crudList);

    crudList.$inject = ['$window', 'jQuery', 'Backbone', 'Backgrid', 'appSettings', 'fwObjectService', '$timeout', '$state'];

    function crudList($window, jQuery, Backbone, Backgrid, appSettings, fwObjectService, $timeout, $state) {
        return {
            scope: {
                crudListSettings: '&',
                crudListDependenciesData: '&',
                app: '=',
            },
            controller: function ($scope) {
                $scope.route = null;

                $scope.$on('refreshGRID', function (event, start, filter) {
                    $scope.pageableCRUDModel.fetch(null, start, filter);
                });
            },
            link: function (scope, $el, attrs) {

                scope.$el = $el;

                function render() {
                    var settings = scope.crudListSettings();
                    settings.route = appSettings.API_URL + settings.url;
                    scope.route = settings.route;

                    Backgrid.InputCellEditor.prototype.attributes.class = 'form-control input-sm';

                    var CRUDModel = Backbone.Model.extend({});

                    var paramsPageable = {
                        model: CRUDModel,
                        url: settings.route + (!settings.pagerGeneral ? '/pager' : '/pagerGeneral'),
                        state: {
                            pageSize: 20
                        },
                        mode: 'server',
                        parseRecords: function (resp, options) {
                            if( scope.$el[0].parseRecords && typeof(scope.$el[0].parseRecords)=="function" ){
                                return scope.$el[0].parseRecords(resp.data);
                            }else{
                                return resp.data;
                            }
                        },
                        parseState: function (resp, queryParams, state, options) {

                            $timeout(function(){
                                var infoTotal = jQuery("<ul class='pull-right total-records'>");
                                infoTotal.append(jQuery("<li>").html("Registros na página: "+resp.total_entries+" / "+resp.total_count));
                                scope.$el.find('.table-container .backgrid-paginator ul.total-records').remove();
                                scope.$el.find('.table-container .backgrid-paginator').append(infoTotal);
                            });

                            return { totalRecords: resp.total_count };
                        },
                    };
                    
                    if (settings.filterScope){
                        paramsPageable.queryParams = {
                            scope: settings.filterScope
                        };
                    }

                    if (settings.sort){
                        paramsPageable.state.sortKey = settings.sort.sortKey;
                        if (settings.sort.order && settings.sort.order=="desc"){
                            paramsPageable.state.order = 1;
                        }
                    }

                    var PageableCRUDModel = Backbone.PageableCollection.extend(paramsPageable);

                    var pageableCRUDModel = new PageableCRUDModel(),
                        initialCRUDModel = pageableCRUDModel;

                    scope.pageableCRUDModel = pageableCRUDModel;

                    function createBackgrid(collection) {
                        var columns = [];

                        var StringFormatter = function () {};
                        StringFormatter.prototype = new Backgrid.StringFormatter();

                        _.extend(StringFormatter.prototype, {
                            fromRaw: function (rawValue, b, c, d, e) {
                                return rawValue;
                            }
                        });

                        _.each(settings.fields, function (field, idx) {

                            if (field.viewable) {
                                var cellOptions = {
                                    name: field.name,
                                    label: field.label,
                                    cell: 'string',
                                    editable: false,
                                    headers: field
                                };

                                if (field.type == 'boolean') {
                                    cellOptions.sortable = false;
                                    cellOptions.cell = Backgrid.Cell.extend({
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
                                else if (field.type == 'simplecolor') {
                                    cellOptions.sortable = false;
                                    cellOptions.cell = Backgrid.Cell.extend({
                                        className: "custom-situation-cell",
                                        initialize: function () {
                                            Backgrid.Cell.prototype.initialize.apply(this, arguments);
                                        },
                                        render: function () {
                                            this.$el.empty();
                                            var formattedValue = '<cp-color class="color-picker" style="background-color: ' + this.model.attributes.cor + '"></cp-color>';
                                            this.$el.append(formattedValue);
                                            this.delegateEvents();
                                            return this;
                                        }
                                    });
                                }
                                else if (field.type == 'custom') {
                                    var customFormatter = {
                                        fromRaw: field.toString,
                                        toRaw: function (formattedData, model) {
                                            return 'down';
                                        }
                                    };

                                    cellOptions.sortable = false;
                                    var _backgridCellExtend = Backgrid.Cell.extend({
                                        className: "custom-cell",
                                        formatter: customFormatter
                                    });

                                    _backgridCellExtend.initialize = function () {
                                        Backgrid.Cell.prototype.initialize.apply(this, arguments);
                                    };
                                    _backgridCellExtend.render = function () {
                                        this.$el.empty();
                                        this.$el.data('model', this.model);
                                        var formattedValue = customFormatter.fromRaw(this.model);
                                        this.$el.append(formattedValue);
                                        this.delegateEvents();
                                        return this;
                                    };

                                    cellOptions.cell = Backgrid.Cell.extend(_backgridCellExtend);
                                }
                                else if (field.type == 'address') {
                                    var addressFormatter = {
                                        fromRaw: function (rawData, model) {
                                            try {
                                                return rawData.city + ' - ' + rawData.state;
                                            } catch (err) {
                                                return '';
                                            }

                                        },
                                        toRaw: function (formattedData, model) {
                                            return 'down';
                                        }
                                    };

                                    var AddressCell = Backgrid.Cell.extend({
                                        className: "address-cell",
                                        formatter: addressFormatter

                                    });

                                    cellOptions.cell = AddressCell;

                                }
                                else if (field.type == 'float') {

                                    if( field.customOptions && field.customOptions.currency ){
                                        cellOptions.cell = Backgrid.Cell.extend({
                                            formatter: {
                                                fromRaw: function (rawData, model) {
                                                    if (rawData){
                                                        var rawData = rawData.toFixed(2).split('.');
                                                        rawData[0] = "R$ " + rawData[0].split(/(?=(?:...)*$)/).join('.');
                                                        return rawData.join(',');
                                                    }
                                                    
                                                }
                                            }
                                        });
                                    }else{
                                        cellOptions.cell = Backgrid.NumberCell.extend({
                                            decimalSeparator: ',',
                                            orderSeparator: '.'
                                        });
                                    }
                                    
                                }
                                else if (field.type == 'date') {
                                    
                                    var format = "DD/MM/YYYY";
                                    var modelFormat="YYYY/M/D";
                                    var displayInUTC=true;
                                    
                                    if (field.customOptions.monthpicker !== undefined) {
                                        format = "MM/YYYY";
                                    }

                                    if (field.customOptions.timestamp) {
                                        modelFormat="YYYY/M/D HH:mm:ss.SSS";
                                        displayInUTC=false;
                                    }

                                    cellOptions.cell = Backgrid.Extension.MomentCell.extend({
                                        modelFormat: modelFormat,
                                        displayLang: "pt-br",
                                        displayFormat: format,
                                        displayInUTC: displayInUTC
                                    });
                                }
                                else if (field.customOptions.enum != undefined) {

                                    var enumOptions = [];
                                    for (var _idx in field.customOptions.enum) {
                                        var opt = field.customOptions.enum[_idx];
                                        enumOptions.push([opt, _idx]);
                                    }

                                    cellOptions.cell = Backgrid.SelectCell.extend({
                                        optionValues: enumOptions
                                    });

                                }
                                else if (field.autocomplete == true) {

                                    if (field.customOptions && field.customOptions.list!=undefined) {

                                        cellOptions.cell = Backgrid.Cell.extend({
                                            className: "custom-situation-cell-select",
                                            formatter: {
                                                fromRaw: function (rawData, model) {

                                                    var label="";
                                                    field.customOptions.list.forEach(function(item){
                                                        if (item.id==rawData){
                                                            label = item.label;
                                                        }
                                                    });

                                                    return label;

                                                },
                                                toRaw: function (formattedData, model) {
                                                    return 'down';
                                                }
                                            }
    
                                        });


                                    }else{
                                        cellOptions.name = cellOptions.name + '.label';
                                    }
                                    
                                }

                                columns.push(cellOptions);
                            }
                        });

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
                                            var _btnEditDetail = jQuery('<button type="button" class="btn btn-default btn-edit-detail"><span class="glyphicon glyphicon-pencil"></span></button>');
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
                                        _btnDeleteDetail.attr('data-route', settings.url);
                                        _buttons.push(_btnDeleteDetail);
                                    }
                                }

                                var _group = jQuery('<div class="btn-group" role="group">');
                                _group.append(_buttons);

                                return _group;
                            },
                            events: {
                               
                            },
                            editRow: function (e) {
                                e.preventDefault();
                            },
                            render: function () {
                                var _html = this.template(this.model.toJSON());
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
                                    e.stopPropagation();

                                    var _confirm = window.confirm('Deseja realmente excluir esse registro?');

                                    if (_confirm) {
                                        var $scope = angular.element(this).scope();
                                        if (settings.tab) {
                                            $scope.$parent.delete($(this).closest('td').data('model').attributes);
                                        } else {
                                            $scope.delete($(this).closest('td').data('model').attributes);
                                        }
                                    }

                                });

                                this.$el.find('button.btn-delete-detail').click(function (e) {
                                    e.stopPropagation();

                                    var _confirm = window.confirm('Deseja realmente excluir esse registro?');

                                    if (_confirm) {
                                        var $scope = angular.element(this).scope();
                                        var route = jQuery(this).attr('data-route');

                                        if (settings.tab) {
                                            $scope.$parent.deleteDetail(route, $(this).closest('td').data('model').attributes);
                                        } else {
                                            $scope.deleteDetail(route, $(this).closest('td').data('model').attributes);
                                        }
                                    }
                                    
                                });

                                this.$el.find('button.btn-edit-detail').click(function (e) {
                                    e.stopPropagation();
                  
                                    var $scope = angular.element(this).scope();
                                    var tab = $.parseJSON($(this).closest('.table-container').attr('tab-config'));
                                    var row = $(this).closest('td').data('model').attributes;
                                    var route = $(this).attr('data-route');
                  
                                    $scope.newDetail(tab, $scope.data, row.id, route);
                                });
                               
                                this.delegateEvents();
                                return this;
                            }
                        });

                        if (settings.settings.edit || settings.settings.delete){
                            columns.push({
                                name: "actions",
                                label: "Ações",
                                sortable: false,
                                cell: ActionCell
                            });
                        }

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
                        });

                        var _tableClass = 'table table-striped table-editable no-margin mb-sm';

                        // Join default classes and custom classes (headers.tableClass) if exists
                        if(settings.tableClass){
                            _tableClass+=" "+settings.tableClass;
                        }

                        var pageableGrid = new Backgrid.Grid({
                            row: ClickableRow,
                            columns: columns,
                            collection: collection,
                            className: _tableClass
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

                        scope.$el.find('.table-container').html('').append(pageableGrid.render().$el).append(paginator.render().$el);

                        scope.$broadcast('refreshGRID', true);
                    }

                    var oldFetch = angular.copy(pageableCRUDModel.fetch);
                    pageableCRUDModel.fetch = function(options, start, filter){

                        $timeout(function(){
                            if (filter){
                                pageableCRUDModel.state.currentPage = 1;
                            }
                            
                            var grid = scope.$el.attr('grid');
                            var $scopeFilter = $('div[crud-filter][grid="'+grid+'"] input').scope();
                            if (!$scopeFilter){
                                $scopeFilter = {};
                            }
                            
                            if(start){
                                if (grid=="main" && $window.location.search){
                                    var params = {};
                                    decodeURIComponent($window.location.search).replace("?filter=","").split('&').forEach(function(elm, idx){
                                        var p = elm.split("=");

                                        if (p[0].split("_ini").length > 1){

                                            var attr = p[0].replace("_ini","");
                                            if(!params[attr]){
                                                params[attr] = {};
                                            }
                                            params[attr].ini = decodeURIComponent(p[1]);

                                        }else if (p[0].split("_fim").length > 1){

                                            var attr = p[0].replace("_fim","");
                                            if(!params[attr]){
                                                params[attr] = {};
                                            }
                                            params[attr].fim = decodeURIComponent(p[1]);

                                        }else{
                                            try {
                                                p[1] = JSON.parse(p[1])
                                                // console.log('BREKA <-', p[0], p[1]);
                                                
                                            } catch (error) {
                                                p[1] = p[1]
                                                // console.log('BREKA ERROR<-', p[0], p[1]);
                                            }

                                            if(typeof p[1] == "object"){
                                                params[p[0]] = p[1];    
                                            }else{
                                                params[p[0]] = decodeURIComponent(p[1]);
                                            }
                                        }
                                    });

                                    // console.log(params);
                                    if (params.p){
                                        $scopeFilter.data.p = params.p;
                                        pageableCRUDModel.state.currentPage = parseInt(params.p);
                                    }

                                    if (params.q){
                                        $scopeFilter.data.q = params.q;
                                        // $scopeFilter.objFilter = {data:params};
                                    }else{
                                        $scopeFilter = $scopeFilter||{};
                                        var showBusca = false;

                                        Object.keys(params).forEach(function(par){
                                            if(par.split("_label").length > 1){
                                                $scopeFilter.data[par.replace("_label","")+".label"] = {id:params[par.replace("_label","")], label:params[par]};
                                            }else{
                                                // console.log('BREKA ->', params[par])

                                                if (typeof(params[par])=="object"){
                                                    for (var key in params[par]) {
                                                        if(key == "ini" || key == "fim"){
                                                            $scopeFilter.data[par+"_"+key] = moment(params[par][key], 'DD/MM/YYYY').toDate();
                                                        }else{
                                                            $scopeFilter.data[par] = $scopeFilter.data[par] || {};
                                                            $scopeFilter.data[par][key] = params[par][key] ;
                                                        }
                                                       
                                                    } 
                                                    // $scopeFilter.data[par+"_ini"] = moment(params[par].ini, 'DD/MM/YYYY').toDate();
                                                    // $scopeFilter.data[par+"_fim"] = moment(params[par].fim, 'DD/MM/YYYY').toDate();
                                                }else{
                                                    $scopeFilter.data[par] = params[par];
                                                }
                                            }
                                            if(par != 'p') showBusca = true;
                                        });
                                        $scopeFilter.data['showBuscaAvancada'] = showBusca;
                                        // $scopeFilter.objFilter = {data:{filter:params}};
                                    }

                                    $scopeFilter.filterData(false); //Estava sendo recursivo isso 
                                }

                            }else{
                                if (grid=="main"){

                                    var str = [];

                                    if($scopeFilter.objFilter && $scopeFilter.objFilter.data.q){
                                        str.push("q="+$scopeFilter.objFilter.data.q);
                                    }

                                    if($scopeFilter.objFilter && $scopeFilter.objFilter.data.filter && Object.keys($scopeFilter.objFilter.data.filter).length>0){
                                        for (var key in $scopeFilter.objFilter.data.filter) {
                                            if (typeof($scopeFilter.objFilter.data.filter[key])=="object"){
                                                if ($scopeFilter.objFilter.data.filter[key].ini){
                                                    str.push(key+"_ini="+$scopeFilter.objFilter.data.filter[key].ini);
                                                }

                                                if ($scopeFilter.objFilter.data.filter[key].fim){
                                                    str.push(key+"_fim="+$scopeFilter.objFilter.data.filter[key].fim);
                                                }

                                                if(!$scopeFilter.objFilter.data.filter[key].ini && !$scopeFilter.objFilter.data.filter[key].fim){
                                                    // console.log($scopeFilter.objFilter.data.filter[key])
                                                    var objCheck = $scopeFilter.objFilter.data.filter[key];
                                                    // console.log('objeto', objCheck);
                                                    
                                                    str.push(key+"="+JSON.stringify(objCheck));

                                                }
                                            }else{
                                                if (key!="p"){
                                                    str.push(key+"="+$scopeFilter.objFilter.data.filter[key]);
                                                }
                                            }
                                        }
                                    }

                                    if(pageableCRUDModel.state && pageableCRUDModel.state.currentPage && pageableCRUDModel.state.currentPage!=1){
                                        str.push("p="+pageableCRUDModel.state.currentPage);
                                    }

                                    var url = str.join("&");

                                    $state.transitionTo($state.$current.name, {filter: url}, {
                                        location: true,
                                        inherit: true,
                                        relative: $state.$current,
                                        notify: false
                                    });
                                    
                                }
                            }

                            if($scopeFilter && $scopeFilter.objFilter && $scopeFilter.objFilter.data.q){
                                options = options || {data:{}};
                                options.data = options.data || {};
                                options.data.q = $scopeFilter.objFilter.data.q;

                                if ($scopeFilter.objFilter.data.p && start){
                                    options.data.page = $scopeFilter.objFilter.data.p;
                                    pageableCRUDModel.state.currentPage = parseInt($scopeFilter.objFilter.data.p);
                                }
                            }

                            if($scopeFilter.objFilter && $scopeFilter.objFilter.data.filter && Object.keys($scopeFilter.objFilter.data.filter).length>0){
                                options = options || {data:{}};
                                options.data = options.data || {};
                                options.data.filter = $scopeFilter.objFilter.data.filter;

                                if ($scopeFilter.objFilter.data.filter.p && start){
                                    options.data.page = $scopeFilter.objFilter.data.filter.p;
                                    pageableCRUDModel.state.currentPage = parseInt($scopeFilter.objFilter.data.filter.p);
                                }
                            }
                            
                            oldFetch.call(pageableCRUDModel, options);
                        });
                    }

                    jQuery($window).on('sn:resize', function () {
                        createBackgrid(pageableCRUDModel);
                    });

                    createBackgrid(pageableCRUDModel);                    
                }

                var listener = scope.$parent.$watch('headers', function (newValue, oldValue) {
                    if (newValue != null) {
                        var settings = scope.crudListSettings();
                        if (settings.tab == true) {
                            var listenerData = scope.$parent.$watch('data', function (newValue, oldValue) {
                                  if (newValue.id != undefined) {
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
