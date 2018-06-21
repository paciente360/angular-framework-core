angular.module("letsAngular").run(["$templateCache", function($templateCache) {$templateCache.put("lets/views/crud/crud-detail-list.html","<table class=\"table detail-table\"><thead><tr><th ng-repeat=\"field in detail.fields | filter: {editable: true}\">{{field.label}}</th><th class=\"text-center\">Ações</th></tr></thead><tbody><tr ng-repeat=\"detail_data in data[detail_key]\" ng-class=\"{\'new\': detail_data.new != undefined}\"><td ng-repeat=\"field in detail.fields | filter: {editable: true}\"><fw-input ng-if=\"!detail.modal\" fw-data=\"detail_data\"></fw-input><fw-detail-data ng-if=\"detail.modal\"></fw-detail-data></td><td class=\"text-center\"><button type=\"button\" class=\"btn btn-edit btn-default\" ng-if=\"detail.modal===true\" ng-click=\"editDetailData(\'tabs_session\', detail_key, detail_data)\"><span class=\"glyphicon glyphicon-pencil\"></span></button> <button type=\"button\" class=\"btn btn-delete btn-default\" ng-click=\"deleteDetailData(detail_data, detail_key)\"><span class=\"glyphicon glyphicon-remove\"></span></button></td></tr><tr ng-if=\"!data[detail_key] || data[detail_key].length==0\" class=\"no-data\"><td colspan=\"100%\">Nenhum dado cadastrado.</td></tr></tbody></table>");
$templateCache.put("lets/views/crud/crud-edit.html","<div class=\"row\"><crud-breadcrumb></crud-breadcrumb></div><section class=\"widget\"><div class=\"widget-body\"><form class=\"form-horizontal\" role=\"form\" ng-submit=\"submit(this)\" crud-form=\"\" name=\"crudForm\" headers=\"{{headers}}\" novalidate=\"\" autocomplete=\"off\"><ng-include src=\"\'lets/views/crud/crud-form.html\'\"></ng-include></form></div></section>");
$templateCache.put("lets/views/crud/crud-form.html","<div><div class=\"fixed-caption-block\" ng-if=\"headers.fixed_tab\"><fieldset><legend><strong>Informações Principais</strong></legend><ng-include ng-if=\"beforeForm != undefined\" src=\"beforeForm\"></ng-include><div class=\"form-group\" ng-repeat=\"field in headers.fields | filter: {tab: \'fixed\', editable: true}\"><label for=\"{{field.name}}\" class=\"col-sm-2 control-label no-padding\">{{field.label}} <span ng-if=\"field.required\">*</span></label><div class=\"col-sm-9\"><fw-input fw-data=\"data\"></fw-input></div></div><ng-include ng-if=\"afterForm != undefined\" src=\"afterForm\"></ng-include></fieldset></div><tabset class=\"tab-group\" ng-class=\"{\'hide-nav\': (_.size(headers.tabs) == 0 && _.size(headers.main_tabs) == 0 && _.size(headers.tabs_session) == 0)}\"><tab ng-if=\"headers.main_tabs == undefined\" heading=\"{{headers.label_row}}\"><fieldset><legend><strong>Informações Principais</strong></legend><ng-include ng-if=\"beforeForm != undefined\" src=\"beforeForm\"></ng-include><div class=\"form-group\" ng-repeat=\"field in headers.fields | filter: {editable: true}\"><label for=\"{{field.name}}\" class=\"col-sm-2 control-label no-padding\">{{field.label}} <span ng-if=\"field.required\">*</span></label><div class=\"col-sm-9\"><fw-input fw-data=\"data\"></fw-input></div></div><ng-include ng-if=\"afterForm != undefined\" src=\"afterForm\"></ng-include></fieldset></tab><tab ng-if=\"headers.main_tabs != undefined\" ng-repeat=\"tab in headers.main_tabs\" heading=\"{{tab}}\"><fieldset><div class=\"form-group\" ng-repeat=\"field in headers.fields | filter: {tab: $index, editable: true}\"><label for=\"{{field.name}}\" class=\"col-sm-2 control-label no-padding\">{{field.label}} <span ng-if=\"field.required\">*</span></label><div class=\"col-sm-9\"><fw-input fw-data=\"data\"></fw-input></div></div></fieldset></tab><tab ng-repeat=\"(detail_key, detail) in headers.tabs_session\" heading=\"{{detail.label}}\"><fieldset><ng-include src=\"\'lets/views/crud/crud-detail-list.html\'\"></ng-include><div class=\"pull-right\"><button type=\"button\" class=\"btn btn-big btn-primary button-new\" origin=\"tabs_session\" detail=\"{{detail_key}}\" form-modal=\"{{detail.modal ? true : false}}\"><span class=\"icon fa fa-plus\"></span>Novo Registro</button></div></fieldset></tab><tab ng-if=\"data.id != null\" ng-repeat=\"(tab_name, tab) in headers.tabs\" heading=\"{{tab.label}}\" ng-hide=\"tab.hide\"><div ng-if=\"tab.fields && !tab.templateUrl\"><div class=\"row\"><div class=\"pull-right\"><a class=\"btn btn-primary btn-block btn-new\" ng-click=\"newDetail(tab, data)\"><span class=\"fa fa-plus\"></span> Novo Registro</a></div></div><section class=\"widget\" crud-list=\"\" crud-list-settings=\"{url: headers.route + \'/details/\' + data.id + \'/\' + tab_name, fields: tab.fields, tab: true, settings: headers.settings, filterScope: tab.filterScope, sort:tab.sort}\"><div class=\"widget-body\"><div class=\"table-container\" tab-config=\"{{tab}}\"></div></div></section></div><div ng-if=\"tab.templateUrl\"><ng-include src=\"tab.templateUrl\"></ng-include></div></tab></tabset><div class=\"form-actions\"><div class=\"row\"><div class=\"col-sm-offset-4 col-sm-7\"><button ng-if=\"!headers.disabled\" type=\"submit\" class=\"btn btn-big btn-primary\"><span class=\"icon fa fa-floppy-o\"></span>Salvar</button> <button type=\"button\" class=\"btn btn-big btn-inverse\" ng-click=\"cancel()\"><span class=\"icon fa fa-undo\"></span>Cancelar</button></div></div></div></div>");
$templateCache.put("lets/views/crud/crud-list.html","<div class=\"row\"><crud-breadcrumb></crud-breadcrumb><div class=\"row col-md-7 col-lg-7 col-xs-7\" style=\"padding-right: 0;\"><div class=\"col-md-4 col-lg-4 col-xs-4\" ng-if=\"headers.settings.add\" style=\"float: right; padding-right: 0;\"><a class=\"btn btn-primary btn-block btn-new\" ng-click=\"goNew()\"><span class=\"icon fa fa-plus\"></span>Novo Registro</a></div></div></div><section class=\"widget\" crud-list=\"\" crud-list-settings=\"{url: headers.route, fields: headers.fields, tab: false, settings: headers.settings}\"><header class=\"crud-list-header row\" style=\"display: flex;\"><h4>{{headers.label}}</h4></header><div class=\"widget-body\"><div class=\"table-container\"></div></div></section>");
$templateCache.put("lets/views/crud/crud-modal.html","<section class=\"widget\"><div class=\"widget-body\"><form class=\"form-horizontal\" role=\"form\" ng-submit=\"submit(this)\" crud-form=\"\" name=\"crudForm\" headers=\"{{headers}}\" novalidate=\"\"><ng-include src=\"\'lets/views/crud/crud-form.html\'\"></ng-include></form></div></section>");
$templateCache.put("lets/views/crud/crud-tab-list.html","<div><div class=\"row btn-tab\"><div class=\"col-md-4 col-lg-4 col-xs-4 pull-right\"><a class=\"btn btn-primary btn-block button-new\" origin=\"tabs\" ng-click=\"$parent.openTabModal(type)\"><span class=\"fa fa-plus\"></span> Novo {{headers[\'tabs\'][type].label_row}}</a></div></div><section class=\"widget\" crud-list=\"\" crud-list-settings=\"{ url: headers[\'tabs\'][type].tab_route + (headers[\'tabs\'][type].data_path != undefined ? data[headers[\'tabs\'][type].data_path].id : data.id) + \'/\' + headers[\'tabs\'][type].label_stem, mainRoute: headers[\'tabs\'][type].tab_route, fields: headers[\'tabs\'][type].fields, tab: true, settings: headers[\'tabs\'][type].settings, type: headers[\'tabs\'][type].custom ? headers[\'tabs\'][type].label_stem : type }\"><div class=\"widget-body\"><div class=\"table-container\"></div></div></section></div>");
$templateCache.put("lets/views/crud/crud.html","<div ui-view=\"\"></div>");
$templateCache.put("lets/views/framework/breadcrumb.html","<div class=\"col-md-5 col-lg-5 col-xs-5\"><ol class=\"breadcrumb\"><li><a ui-sref=\"app.dashboard\">Home</a></li><li class=\"active\"><a ng-click=\"goToList()\">{{headers.label}}</a></li></ol></div>");
$templateCache.put("lets/views/framework/chart.html","<section class=\"widget\"><header class=\"row\"><h4>Relatório de <span class=\"fw-semi-bold\">{{key}}</span></h4></header><div data-name=\"filter\" style=\"margin-top: .5em;\"><div class=\"col-sm-6 col-lg-6\" style=\"padding: 0;\"><label for=\"\">Data de Início</label> <input type=\"text\" ng-model=\"$parent.d3chartStartDate\" fw-date-picker=\"true\" fw-date-picker-ng-model-parent=\"true\" data-date-format=\"DD/MM/YYYY\" disabled=\"true\"></div><div class=\"col-sm-6 col-lg-6\" style=\"padding: 0;\"><label for=\"\">Data de Fim</label> <input type=\"text\" ng-model=\"$parent.d3chartEndDate\" fw-date-picker=\"true\" fw-date-picker-ng-model-parent=\"true\" data-date-format=\"DD/MM/YYYY\" disabled=\"true\"></div></div><div class=\"widget-body\"><div data-nvd3-chart=\"\" data-chart=\"d3chartConfig\" data-datum=\"d3chartData\"><svg class=\"\"></svg></div></div></section>");
$templateCache.put("lets/views/framework/input-detail.html","<div><input ng-if=\"field.type != \'boolean\'\" \"=\"\" class=\"main-input form-control\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-show=\"field.autocomplete === false\" type=\"text\" ng-model=\"detail_data[field.name]\"> <input ng-if=\"field.type == \'boolean\'\" ng-required=\"field.notnull\" type=\"checkbox\" id=\"{{field.name}}\" data-ui-switch=\"{size: \'small\'}\" data-ng-model=\"detail_data[field.name]\"> <input typeahead-on-select=\"autocompleteDetailSelect(detail_key, $item, $model, $label)\" aria-autocomplete=\"none\" autocomplete=\"false\" typeahead-min-length=\"3\" typeahead=\"row as row.label for row in $parent.autocompleteDetail(detail_key, field, $viewValue)\" ng-if=\"field.autocomplete !== false\" ng-required=\"field.notnull\" type=\"text\" class=\"form-control\" ng-model=\"detail_data[field.name + \'.label\']\" placeholder=\"{{field.label}}\"></div>");
$templateCache.put("lets/views/framework/input.html","<div class=\"input-container\" data-name=\"{{field.name}}\"><div class=\"fw-input-group\" ng-if=\"field.type != \'date\' && field.type != \'time\' && field.type != \'text\' && field.customOptions.file == undefined && field.customOptions.enum == undefined && field.customOptions.list == undefined && field.autocomplete == false && field.type !=\'boolean\' && field.type !=\'custom\' && field.customOptions.autocomplete_table == undefined\"><span ng-if=\"field.customOptions.currency != undefined\" class=\"input-group-addon\">R$</span> <input step=\"0.5\" data-parsley-type=\"number\" type=\"number\" lang=\"pt-BR\" ng-if=\"field.type == \'float\'\" ng-model-options=\"{fieldInfo: field}\" id=\"{{field.name}}\" string-to-number=\"\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" size=\"{{field.length}}\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\" min=\"{{field.customOptions.min}}\"><fw-tags ng-model-options=\"{fieldInfo: field}\" ng-if=\"field.type == \'tags\'\" fw-tags=\"\" tags=\"data[field.name]\" name=\"{{field.name}}\"></fw-tags><input ng-model-options=\"{fieldInfo: field}\" ng-if=\"field.type != \'password\' && field.type != \'date\' && field.type != \'float\' && field.type != \'text\' && field.customOptions.file == undefined && field.customOptions.enum == undefined && field.customOptions.email == undefined && field.autocomplete == false && field.type != \'boolean\' && field.type != \'tags\' && field.type != \'custom\' && field.type != \'simplecolor\'\" name=\"{{field.name}}\" type=\"text\" id=\"{{field.name}}\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" size=\"{{field.length}}\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\"><input ng-model-options=\"{fieldInfo: field}\" ng-if=\"field.type == \'simplecolor\'\" color-picker=\"\" color-me=\"true\" name=\"{{field.name}}\" type=\"text\" id=\"{{field.name}}\" set-colors=\"{{field.customOptions.colors}}\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" size=\"{{field.length}}\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\"> <input ng-model-options=\"{fieldInfo: field}\" ng-if=\"field.type == \'password\'\" type=\"password\" id=\"{{field.name}}\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\"> <input ng-model-options=\"{fieldInfo: field}\" ng-if=\"field.customOptions.email != undefined\" type=\"email\" id=\"{{field.name}}\" string-to-number=\"\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\"></div><div ng-if=\"field.type == \'custom\'\" ng-bind-html=\"fieldHtml()\"></div><div ng-if=\"field.type == \'date\'\"><input ng-model-options=\"{fieldInfo: field, allowInvalid: true}\" type=\"text\" fw-date-picker=\"true\" fw-dynamic=\"\" ng-required=\"field.notnull\" id=\"{{field.name}}\" name=\"{{field.name}}\" ng-model=\"$parent.data[field.name]\" class=\"form-control\" data-date-format=\"DD/MM/YYYY\" placeholder=\"DD/MM/YYYY\" ng-disabled=\"field.disabled\" autocomplete=\"off\"><ul class=\"parsley-errors-list filled\" ng-if=\"field.error\"><li class=\"parsley-required\">A data informada é inválida.</li></ul></div><div ng-if=\"field.type == \'time\'\"><timepicker ng-model=\"$parent.data[field.name]\" ng-disabled=\"field.disabled\" hour-step=\"field.customoptions.timepicker.hstep || 1\" minute-step=\"field.customoptions.timepicker.mstep || 1\" show-meridian=\"field.customoptions.timepicker.meridian\"></timepicker><ul class=\"parsley-errors-list filled\" ng-if=\"field.error\"><li class=\"parsley-required\">O horário informado é inválido.</li></ul></div><div fw-upload=\"\" ng-if=\"field.type == \'string\' && field.customOptions.file != undefined\" class=\"fw-input-group\"><div class=\"progress\"><div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{f.progress || defaultProgress}}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"text-align: left; min-width: 2em;\" ng-style=\"{\'width\': \'{{f.progress || defaultProgress}}%\'}\" ng-if=\"(f.progress != undefined && f.progress != 0) || defaultProgress != 0\"><span ng-if=\"f.progress != undefined && f.progress != 0\">{{f.progress + \'%\'}} <span style=\"display: inline-block; width: 89%;\" ng-if=\"f.progress == 100 && !f.newName\">{{f.name}}</span> <span style=\"display: inline-block; width: 89%;\" ng-if=\"f.progress == 100 && f.newName\">{{f.newName}}</span></span> <span ng-if=\"f == undefined || f.progress == undefined\" ng-bind=\"$parent.data[field.name]\"></span></div></div><input ng-model-options=\"{fieldInfo: field}\" type=\"hidden\" class=\"form-control\" name=\"temp_filename\" ng-model=\"$parent.data[field.name]\" id=\"{{field.name}}\" ng-required=\"field.notnull\" autocomplete=\"off\"> <span class=\"input-group-btn\"><button ng-if=\"alreadySent == false || field.customOptions.only_upload == true\" type=\"file\" ngf-select=\"upload($file, $invalidFiles)\" class=\"btn btn-default btn-upload\"><i class=\"glyphicon glyphicon-upload\"></i></button> <button ng-if=\"alreadySent == true && (field.customOptions.only_upload != true)\" ng-click=\"download(field, data.id)\" type=\"button\" class=\"btn btn-default\"><i class=\"glyphicon glyphicon-download\"></i></button></span></div><textarea ng-model-options=\"{fieldInfo: field}\" ng-if=\"field.type == \'text\' && !field.customOptions.rich\" id=\"{{field.name}}\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" ng-disabled=\"field.disabled\" placeholder=\"{{field.customOptions.placeholder ? field.customOptions.placeholder : \'\'}}\" class=\"main-input form-control\" rows=\"{{field.customOptions.rows}}\"></textarea> <textarea ckeditor=\"{\'language\':\'pt-br\'}\" ng-model-options=\"{fieldInfo: field}\" ng-if=\"field.type == \'text\' && field.customOptions.rich\" id=\"{{field.name}}\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" class=\"main-input form-control\" ng-disabled=\"field.disabled\"></textarea><div class=\"row\" ng-if=\"field.customOptions.enum != undefined\"><div class=\"col-sm-6\"><div ng-class=\"{checkbox: (field.customOptions.multiple != undefined && field.customOptions.multiple == true), radio: (field.customOptions.multiple == undefined || field.customOptions.multiple == false)}\" ng-repeat=\"(option_key, option_label) in field.customOptions.enum\"><input ng-model-options=\"{fieldInfo: field}\" ng-if=\"(field.customOptions.multiple == undefined || field.customOptions.multiple == false)\" type=\"radio\" name=\"{{field.name}}\" id=\"{{field.name}}_{{option_key}}\" value=\"{{option_key}}\" ng-model=\"$parent.data[field.name]\" ng-required=\"field.notnull\" selected=\"{\'selected\': $parent.data[field.name] == $parent.data[field.name]}\" autocomplete=\"off\"> <input ng-model-options=\"{fieldInfo: field}\" ng-if=\"(field.customOptions.multiple != undefined && field.customOptions.multiple == true)\" type=\"checkbox\" checklist-before-change=\"shouldChange(key)\" ng-required=\"field.notnull\" id=\"{{field.name}}_{{option_key}}\" checklist-model=\"data[field.name]\" checklist-value=\"option_key\" autocomplete=\"off\"> <label for=\"{{field.name}}_{{option_key}}\"></label> {{option_label}}</div><div ng-if=\"!isEmpty(field.customOptions.enum)\"><span>Nenhuma alternativa foi cadastrada para esse campo!</span></div></div></div><ui-select ng-if=\"field.customOptions.list !== undefined\" ng-model=\"$parent.data[field.name]\" ng-model-options=\"{fieldInfo: field}\" ng-required=\"field.notnull\" theme=\"bootstrap\" id=\"{{field.name}}_{{option_key}}\" value=\"{{option_key}}\"><ui-select-match placeholder=\"Selecione uma opção da lista\">{{$parent.data[field.name].value}}</ui-select-match><ui-select-choices repeat=\"(option_key, option_label) in field.customOptions.list | filter: $select.search\"><div ng-bind-html=\"option_label.value | highlight: $select.search\"></div></ui-select-choices></ui-select><label for=\"{{field.name}}\" ng-if=\"field.type == \'boolean\'\"><toggle id=\"{{field.name}}\" ng-model-options=\"{fieldInfo: field}\" ng-model=\"data[field.name]\" name=\"{{field.name}}\" on=\"{{field.customOptions.statusTrueText}}\" off=\"{{field.customOptions.statusFalseText}}\" size=\"btn-sm\" ng-if=\"!field.disabled\"></toggle><span ng-if=\"field.disabled\">{{$parent.data[field.name] ? field.customOptions.statusTrueText : field.customOptions.statusFalseText}}</span></label><div fw-auto-complete=\"\" class=\"fw-input-group fw-auto-complete input-group\" ng-if=\"field.autocomplete !== false && field.customOptions.autocomplete_table == undefined\"><input id=\"{{field.name}}\" ng-model-options=\"{fieldInfo: field}\" fw-auto-complete=\"\" typeahead-on-select=\"autocompleteSelect($item, $model, $label)\" aria-autocomplete=\"none\" autocomplete=\"off\" typeahead-min-length=\"0\" typeahead=\"row as row.label for row in autocomplete(field, $viewValue)\" type=\"text\" class=\"form-control\" name=\"{{field.name}}\" ng-required=\"field.notnull\" ng-model=\"$parent.data[field.name + \'.label\']\" size=\"{{field.length}}\" placeholder=\"{{field.label}}\" ng-disabled=\"field.disabled\" ng-readonly=\"field.customOptions.select == true\" ng-class=\"{\'fieldSelect\': field.customOptions.select == true}\"> <span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\"><i class=\"glyphicon\" ng-class=\"{\'glyphicon-search\': field.customOptions.select == undefined, \'glyphicon-menu-down\': field.customOptions.select == true}\"></i></button></span></div><div fw-auto-complete=\"\" class=\"fw-input-group fw-auto-complete input-group\" ng-if=\"field.autocomplete !== false && field.customOptions.autocomplete_table != undefined\"><input style=\"display:none\" id=\"{{field.name}}\" ng-model-options=\"{fieldInfo: field}\" fw-auto-complete=\"\" typeahead-on-select=\"autocompleteSelect($item, $model, $label)\" aria-autocomplete=\"none\" autocomplete=\"off\" typeahead-min-length=\"0\" typeahead=\"row as row.label for row in autocomplete(field, $viewValue)\" type=\"text\" class=\"form-control\" name=\"{{field.name}}\" ng-required=\"field.notnull\" ng-model=\"$parent.data[field.name + \'.label\']\" size=\"{{field.length}}\" placeholder=\"{{field.label}}\" ng-disabled=\"field.disabled\"></div><div fw-auto-complete-table=\"\" ng-if=\"field.customOptions.autocomplete_table != undefined\" data-name=\"{{field.name}}\"><div class=\"fw-input-group fw-auto-complete input-group\"><input type=\"text\" id=\"input-ac-table\" ng-model=\"$parent.data[field.name + \'.label\']\" ng-model-options=\"{fieldInfo: field, debounce: 500}\" class=\"form-control\" autocomplete=\"off\" ng-change=\"updateAutocompleteTable(field.customOptions.autocomplete_table.table_name,field.customOptions.autocomplete_table.table_columns[0].name, this)\" ng-focus=\"autocompleteTableFocus(field.customOptions.autocomplete_table.table_name)\" ng-blur=\"autocompleteTableLostFocus()\" ng-disabled=\"field.disabled\"> <span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\"><i class=\"glyphicon\" ng-class=\"{\'glyphicon-search\': field.customOptions.select == undefined, \'glyphicon-menu-down\': field.customOptions.select == true}\"></i></button></span></div><div ng-if=\"field.customOptions.autocomplete_table != undefined\" ng-show=\"tableVisibily\" ng-model-options=\"{fieldInfo: field}\"><div class=\"table-container\"><table id=\"myTable\" class=\"table table-striped\"><thead><tr><th ng-repeat=\"column in field.customOptions.autocomplete_table.table_columns\">{{column.label}}</th></tr></thead><tbody><tr ng-repeat=\"data in autocompleteTableData2\" id=\"{{data.id}}\" ng-mousedown=\"tableSelected($event,field.name,data)\"><td ng-repeat=\"column in field.customOptions.autocomplete_table.table_columns\">{{data[column.name]}}</td></tr></tbody></table></div></div></div></div>");}]);