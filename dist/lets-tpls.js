angular.module("letsAngular").run(["$templateCache", function($templateCache) {$templateCache.put("lets/views/crud/crud-detail-list.html","<table class=\"table detail-table\"><thead><tr><th ng-repeat=\"field in detail.fields | filter: {viewable: true}\" ng-if=\"detail.modal===true\">{{field.label}}</th><th ng-repeat=\"field in detail.fields | filter: {editable: true}\" ng-if=\"!detail.modal\">{{field.label}}</th><th ng-if=\"detail.settings === undefined|| (detail.settings.edit || detail.settings.delete)\" class=\"text-center\">Ações</th></tr></thead><tbody><tr ng-repeat=\"detail_data in data[detail_key]\" ng-class=\"{\'new\': detail_data.new != undefined}\"><td ng-repeat=\"field in detail.fields | filter: {viewable: true}\" ng-if=\"detail.modal===true\"><fw-detail-data ng-if=\"detail.modal\"></fw-detail-data></td><td ng-repeat=\"field in detail.fields | filter: {editable: true}\" ng-if=\"!detail.modal\"><fw-input ng-if=\"!detail.modal\" fw-data=\"detail_data\"></fw-input></td><td ng-if=\"detail.settings === undefined|| (detail.settings.edit || detail.settings.delete)\" class=\"text-center\"><button type=\"button\" class=\"btn btn-edit btn-default\" ng-if=\"detail.settings === undefined || (detail.modal===true && detail.settings.edit)\" ng-click=\"editDetailData(\'tabs_session\', detail_key, detail_data)\"><span class=\"glyphicon glyphicon-pencil\"></span></button> <button type=\"button\" class=\"btn btn-delete btn-default\" ng-if=\"detail.settings === undefined || detail.settings.delete\" ng-click=\"deleteDetailData(detail_data, detail_key)\"><span class=\"glyphicon glyphicon-remove\"></span></button></td></tr><tr ng-if=\"!data[detail_key] || data[detail_key].length==0\" class=\"no-data\"><td colspan=\"100%\">Nenhum dado cadastrado.</td></tr></tbody></table>");
$templateCache.put("lets/views/crud/crud-edit.html","<div class=\"row\"><crud-breadcrumb></crud-breadcrumb></div><section class=\"widget\"><div class=\"widget-body\"><form class=\"form-horizontal\" role=\"form\" ng-submit=\"submit(this)\" crud-form=\"\" name=\"crudForm\" headers=\"{{headers}}\" novalidate=\"\" autocomplete=\"off\"><ng-include src=\"\'lets/views/crud/crud-form.html\'\"></ng-include></form></div></section>");
$templateCache.put("lets/views/crud/crud-filter.html","<div class=\"filtros\"><form ng-submit=\"filterData(true)\"><div class=\"busca row\" ng-if=\"!hideInputSearch\"><div class=\"form-group col-sm-3\" style=\"margin-bottom: 10px;\"><div class=\"fw-input-group input-group\"><input autocomplete=\"off\" type=\"text\" class=\"form-control\" name=\"q\" ng-model=\"data[\'q\']\" ng-disabled=\"showBuscaAvancada\" placeholder=\"Buscar por...\"> <span class=\"input-group-btn\" ng-if=\"fieldsFilter.length > 0\"><button type=\"button\" class=\"btn btn-default\" title=\"Busca Avançada\" ng-click=\"openBuscaAvancada()\"><i class=\"glyphicon\" ng-class=\"{\'glyphicon-plus\': !showBuscaAvancada, \'glyphicon-minus\': showBuscaAvancada}\"></i></button></span> <span ng-if=\"clearButton && fieldsFilter.length > 0\" class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\" title=\"Limpar filtro\" ng-click=\"clearBusca()\"><i class=\"glyphicon glyphicon-erase\"></i> <span class=\"hidden-xs\">Limpar Filtro</span></button></span> <button type=\"submit\" style=\"width: 0px; opacity: 0\"></button></div></div><div class=\"clearfix\"></div></div><div class=\"busca-avancada row\" collapse=\"!showBuscaAvancada\"><div class=\"form-group\" style=\"margin-bottom: 10px;\" ng-repeat=\"field in fieldsFilter\" ng-class=\"field.filter.range===true ? \'col-sm-2\' : \'col-sm-3\'\"><label for=\"{{field.name}}\" class=\"control-label\" style=\"font-size:12px; margin-bottom: 0px;font-weight: 600\">{{field.label}}</label><fw-input fw-data=\"data\"></fw-input></div><div class=\"form-group col-sm-2\"><label class=\"control-label\" style=\"font-size:12px; margin-bottom: 0px;\">&nbsp;</label><div><button type=\"submit\" class=\"btn btn-primary\"><span class=\"icon fa fa-search\"></span>Buscar</button></div></div><div class=\"clearfix\"></div></div></form></div>");
$templateCache.put("lets/views/crud/crud-form-input.html","<div class=\"form-group\" ng-repeat=\"field in fields | filter: filter\" ng-if=\"!auto_layout\"><label for=\"{{field.name}}\" class=\"col-sm-2 control-label no-padding\">{{field.label}} <span ng-if=\"field.required\">*</span></label><div class=\"col-sm-9\"><fw-input fw-data=\"data\"></fw-input></div></div><div class=\"form-group form-auto-layout\" ng-repeat=\"field in fields | filter: filter\" ng-class=\"field.size ? \'col-sm-\'+field.size : field.type == \'text\' ? \'col-sm-12\' : (field.type == \'date\' || field.type == \'time\' || field.type == \'boolean\' || ((field.type == \'number\' || field.type == \'integer\' || field.type == \'bigint\') && !field.autocomplete)) ? \'col-sm-3\' : \'col-sm-6\'\" ng-if=\"auto_layout\"><label for=\"{{field.name}}\" class=\"control-label\">{{field.label}} <span ng-if=\"field.required\">*</span></label><fw-input fw-data=\"data\"></fw-input></div>");
$templateCache.put("lets/views/crud/crud-form.html","<div><div class=\"fixed-caption-block\" ng-if=\"headers.fixed_tab\"><fieldset><legend><strong>Informações Principais</strong></legend><ng-include ng-if=\"beforeForm != undefined\" src=\"beforeForm\"></ng-include><ng-include src=\"\'lets/views/crud/crud-form-input.html\'\" ng-init=\"auto_layout=headers.auto_layout; fields=headers.fields; filter={tab: \'fixed\', editable: true}\"></ng-include><ng-include ng-if=\"afterForm != undefined\" src=\"afterForm\"></ng-include></fieldset></div><tabset class=\"tab-group\" ng-class=\"{\'hide-nav\': (_.size(headers.tabs) == 0 && _.size(headers.main_tabs) == 0 && _.size(headers.tabs_session) == 0)}\"><tab ng-if=\"headers.main_tabs == undefined\" heading=\"{{headers.label_row}}\"><fieldset><legend><strong>Informações Principais</strong></legend><ng-include ng-if=\"beforeForm != undefined\" src=\"beforeForm\"></ng-include><ng-include src=\"\'lets/views/crud/crud-form-input.html\'\" ng-init=\"auto_layout=headers.auto_layout; fields=headers.fields; filter={editable: true}\"></ng-include><ng-include ng-if=\"afterForm != undefined\" src=\"afterForm\"></ng-include></fieldset></tab><tab ng-if=\"headers.main_tabs != undefined\" ng-repeat=\"tab in headers.main_tabs\" heading=\"{{tab}}\"><fieldset><ng-include src=\"\'lets/views/crud/crud-form-input.html\'\" ng-init=\"auto_layout=headers.auto_layout; fields=headers.fields; filter={tab: $index, editable: true}\"></ng-include></fieldset></tab><tab ng-if=\"!detail.hide\" ng-repeat=\"(detail_key, detail) in headers.tabs_session\" heading=\"{{detail.label}}\"><fieldset><ng-include src=\"\'lets/views/crud/crud-detail-list.html\'\"></ng-include><div ng-if=\"(!detail.settings) || (detail.settings && detail.settings.add)\" class=\"pull-right\"><button type=\"button\" class=\"btn btn-primary button-new\" origin=\"tabs_session\" detail=\"{{detail_key}}\" form-modal=\"{{detail.modal ? true : false}}\"><span class=\"icon fa fa-plus\"></span>Novo Registro</button></div></fieldset></tab><tab ng-if=\"data.id != null && !tab.hide\" ng-repeat=\"(tab_name, tab) in headers.tabs\" heading=\"{{tab.label}}\"><div ng-if=\"tab.fields && !tab.templateUrl\"><section class=\"\" grid=\"{{tab_name}}\" crud-list=\"\" crud-list-settings=\"{url: headers.route + \'/details/\' + data.id + \'/\' + tab_name, fields: tab.fields, tab: true, settings: (tab.settings || headers.settings), filterScope: tab.filterScope, sort:tab.sort, tableClass: tab.tableClass}\"><div class=\"col-sm-12 filter-tab\" style=\"margin-top: 15px;\"><div class=\"row pull-right\" style=\"position: absolute; right:0\"><a class=\"btn btn-primary btn-block btn-new hidden-xs\" ng-click=\"newDetail(tab, data)\"><span class=\"fa fa-plus\"></span> Novo Registro</a> <a class=\"btn btn-primary btn-block btn-new visible-xs\" style=\"margin-top: 0;\" ng-click=\"newDetail(tab, data)\"><span class=\"fa fa-plus\"></span> Novo</a></div><div class=\"row col-xs-9 pull-left\" style=\"padding: 0;\"><div crud-filter=\"\" fields=\"tab.fields\" route=\"headers.route + \'/details/\' + data.id + \'/\' + tab_name\" grid=\"{{tab_name}}\"></div></div></div><div class=\"widget-body\"><div class=\"table-container col-xs-12\" tab-config=\"{{tab}}\"></div></div></section></div><div ng-if=\"tab.templateUrl\"><ng-include src=\"tab.templateUrl\"></ng-include></div></tab></tabset><div class=\"form-actions\"><div class=\"row\"><div class=\"col-sm-offset-4 col-sm-7\"><button ng-if=\"!headers.disabled\" type=\"submit\" class=\"btn btn-big btn-primary\"><span class=\"icon fa fa-floppy-o\"></span>Salvar</button> <button type=\"button\" class=\"btn btn-big btn-inverse\" ng-click=\"cancel()\"><span class=\"icon fa fa-undo\"></span>Cancelar</button></div></div></div></div>");
$templateCache.put("lets/views/crud/crud-list.html","<div class=\"row\"><crud-breadcrumb></crud-breadcrumb><div class=\"col-sm-3 col-lg-2 text-right\" ng-if=\"headers.settings.add\" style=\"margin-bottom: 10px;\"><a class=\"btn btn-primary btn-block btn-new\" ng-click=\"goNew()\"><span class=\"icon fa fa-plus\"></span>Novo Registro</a></div></div><section grid=\"main\" class=\"widget\" crud-list=\"\" crud-list-settings=\"{url: headers.route, fields: headers.fields, tab: false, settings: headers.settings, filterScope: headers.settings.filterScope, sort:headers.settings.sort, tableClass: headers.tableClass}\"><header class=\"crud-list-header row hidden-xs\" style=\"display: flex;\"><h4>{{headers.label}}</h4></header><div crud-filter=\"\" clear-button=\"headers.clearButton\" fields=\"headers.fields\" route=\"headers.route\" search=\"headers.search\" grid=\"main\" style=\"margin-top: 15px;\"></div><div class=\"widget-body\"><div class=\"table-container\"></div></div></section>");
$templateCache.put("lets/views/crud/crud-modal.html","<section class=\"widget\"><div class=\"widget-body\"><form class=\"form-horizontal\" role=\"form\" ng-submit=\"submit(this)\" crud-form=\"\" name=\"crudForm\" headers=\"{{headers}}\" novalidate=\"\"><ng-include src=\"\'lets/views/crud/crud-form.html\'\"></ng-include></form></div></section>");
$templateCache.put("lets/views/crud/crud-tab-list.html","<div><div class=\"row btn-tab\"><div class=\"col-md-4 col-lg-4 col-xs-4 pull-right\"><a class=\"btn btn-primary btn-block button-new\" origin=\"tabs\" ng-click=\"$parent.openTabModal(type)\"><span class=\"fa fa-plus\"></span> Novo {{headers[\'tabs\'][type].label_row}}</a></div></div><section class=\"widget\" crud-list=\"\" crud-list-settings=\"{ url: headers[\'tabs\'][type].tab_route + (headers[\'tabs\'][type].data_path != undefined ? data[headers[\'tabs\'][type].data_path].id : data.id) + \'/\' + headers[\'tabs\'][type].label_stem, mainRoute: headers[\'tabs\'][type].tab_route, fields: headers[\'tabs\'][type].fields, tab: true, settings: headers[\'tabs\'][type].settings, type: headers[\'tabs\'][type].custom ? headers[\'tabs\'][type].label_stem : type }\"><div class=\"widget-body\"><div class=\"table-container\"></div></div></section></div>");
$templateCache.put("lets/views/crud/crud.html","<div ui-view=\"\"></div>");
$templateCache.put("lets/views/framework/breadcrumb.html","<div class=\"col-sm-9 col-lg-10\"><ol class=\"breadcrumb\"><li><a ui-sref=\"app.dashboard\">Home</a></li><li class=\"active\"><a ng-click=\"goToList()\">{{headers.label}}</a></li></ol></div>");
$templateCache.put("lets/views/framework/chart.html","<section class=\"widget\"><header class=\"row\"><h4>Relatório de <span class=\"fw-semi-bold\">{{key}}</span></h4></header><div data-name=\"filter\" style=\"margin-top: .5em;\"><div class=\"col-sm-6 col-lg-6\" style=\"padding: 0;\"><label for=\"\">Data de Início</label> <input type=\"text\" ng-model=\"$parent.d3chartStartDate\" fw-date-picker=\"true\" fw-date-picker-ng-model-parent=\"true\" data-date-format=\"DD/MM/YYYY\" disabled=\"true\"></div><div class=\"col-sm-6 col-lg-6\" style=\"padding: 0;\"><label for=\"\">Data de Fim</label> <input type=\"text\" ng-model=\"$parent.d3chartEndDate\" fw-date-picker=\"true\" fw-date-picker-ng-model-parent=\"true\" data-date-format=\"DD/MM/YYYY\" disabled=\"true\"></div></div><div class=\"widget-body\"><div data-nvd3-chart=\"\" data-chart=\"d3chartConfig\" data-datum=\"d3chartData\"><svg class=\"\"></svg></div></div></section>");
$templateCache.put("lets/views/framework/input-detail.html","<div><input ng-if=\"field.type != \'boolean\'\" \"=\"\" class=\"main-input form-control\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-show=\"field.autocomplete === false\" type=\"text\" ng-model=\"detail_data[field.name]\"> <input ng-if=\"field.type == \'boolean\'\" ng-required=\"field.notnull\" type=\"checkbox\" id=\"{{field.name}}\" data-ui-switch=\"{size: \'small\'}\" data-ng-model=\"detail_data[field.name]\"> <input typeahead-on-select=\"autocompleteDetailSelect(detail_key, $item, $model, $label)\" aria-autocomplete=\"none\" autocomplete=\"false\" typeahead-min-length=\"3\" typeahead=\"row as row.label for row in $parent.autocompleteDetail(detail_key, field, $viewValue)\" ng-if=\"field.autocomplete !== false\" ng-required=\"field.notnull\" type=\"text\" class=\"form-control\" ng-model=\"detail_data[field.name + \'.label\']\" placeholder=\"{{field.label}}\"></div>");
$templateCache.put("lets/views/framework/input.html","<div class=\"input-container\" data-name=\"{{field.name}}\"><div ng-if=\"field.type == \'float\' && field.customOptions.currency\"><div class=\"fw-input-group\"><span ng-if=\"field.customOptions.currency != undefined\" class=\"input-group-addon\">R$</span> <input ng-if=\"field.customOptions.min\" step=\"0.5\" data-parsley-pattern=\"^\\d{1,3}(?:\\.\\d{3})*,\\d{2}$\" lang=\"pt-BR\" ng-model-options=\"{fieldInfo: field}\" type=\"text\" id=\"{{field.name}}\" string-to-number=\"\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" size=\"{{field.length}}\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\" min=\"{{field.customOptions.min}}\"> <input ng-if=\"!field.customOptions.min\" step=\"0.5\" lang=\"pt-BR\" ng-model-options=\"{fieldInfo: field}\" type=\"text\" id=\"{{field.name}}\" string-to-number=\"\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" size=\"{{field.length}}\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\"></div></div><div ng-if=\"field.type == \'float\' && !field.customOptions.currency\"><input step=\"0.5\" data-parsley-type=\"number\" lang=\"pt-BR\" ng-model-options=\"{fieldInfo: field}\" type=\"text\" id=\"{{field.name}}\" string-to-number=\"\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" size=\"{{field.length}}\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\" min=\"{{field.customOptions.min}}\"></div><div ng-if=\"(field.type == \'number\' || field.type == \'integer\' || field.type == \'bigint\') && !field.autocomplete && !field.customOptions.range\"><input ng-model-options=\"{fieldInfo: field}\" type=\"text\" id=\"{{field.name}}\" string-to-number=\"\" numbers-only=\"\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" size=\"{{field.length}}\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\"></div><div ng-if=\"(field.type == \'number\' || field.type == \'integer\' || field.type == \'bigint\') && !field.autocomplete && field.customOptions.range\"><input ng-model-options=\"{fieldInfo: field}\" type=\"number\" id=\"{{field.name}}\" ng-required=\"{{field.notnull}}\" ng-model=\"data[field.name]\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\" min=\"{{field.customOptions.range.min}}\" max=\"{{field.customOptions.range.max}}\"></div><div ng-if=\"field.type == \'string\' && (!field.customOptions.file && !field.customOptions.email && !field.autocomplete)\"><input ng-model-options=\"{fieldInfo: field}\" name=\"{{field.name}}\" type=\"text\" id=\"{{field.name}}\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" size=\"{{field.length}}\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\"></div><div ng-if=\"field.type == \'simplecolor\'\"><input ng-model-options=\"{fieldInfo: field}\" color-picker=\"\" color-me=\"true\" name=\"{{field.name}}\" type=\"text\" id=\"{{field.name}}\" set-colors=\"{{field.customOptions.colors}}\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" size=\"{{field.length}}\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\"></div><div ng-if=\"field.type == \'tags\'\"><fw-tags ng-model-options=\"{fieldInfo: field}\" fw-tags=\"\" tags=\"data[field.name]\" name=\"{{field.name}}\"></fw-tags></div><div ng-if=\"field.type == \'password\'\"><input ng-model-options=\"{fieldInfo: field}\" type=\"password\" id=\"{{field.name}}\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\"></div><div ng-if=\"field.type == \'string\' && field.customOptions.email\"><input ng-model-options=\"{fieldInfo: field}\" type=\"email\" id=\"{{field.name}}\" string-to-number=\"\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" ng-disabled=\"field.disabled\" class=\"main-input form-control\" autocomplete=\"off\"></div><div ng-if=\"field.type == \'custom\'\"><div ng-bind-html=\"fieldHtml()\"></div></div><div ng-if=\"field.type == \'date\'\"><input ng-model-options=\"{fieldInfo: field, allowInvalid: true}\" type=\"text\" fw-date-picker=\"true\" fw-dynamic=\"\" ng-required=\"field.notnull\" id=\"{{field.name}}\" name=\"{{field.name}}\" ng-model=\"$parent.data[field.name]\" class=\"form-control\" data-date-format=\"DD/MM/YYYY\" placeholder=\"DD/MM/YYYY\" ng-disabled=\"field.disabled\" autocomplete=\"off\"><ul class=\"parsley-errors-list filled\" ng-if=\"field.error\"><li class=\"parsley-required\">A data informada é inválida.</li></ul></div><div ng-if=\"field.type == \'time\'\"><timepicker ng-model=\"$parent.data[field.name]\" ng-disabled=\"field.disabled\" hour-step=\"field.customOptions.timepicker.hstep || 1\" minute-step=\"field.customOptions.timepicker.mstep || 1\" show-meridian=\"field.customOptions.timepicker.meridian\"></timepicker><ul class=\"parsley-errors-list filled\" ng-if=\"field.error\"><li class=\"parsley-required\">O horário informado é inválido.</li></ul></div><div ng-if=\"field.type == \'string\' && field.customOptions.file && !field.customOptions.dad\"><div fw-upload=\"\" class=\"fw-input-group\"><div class=\"progress\"><div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{f.progress || defaultProgress}}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"text-align: left; min-width: 2em;\" ng-style=\"{\'width\': \'{{f.progress || defaultProgress}}%\'}\" ng-if=\"(f.progress != undefined && f.progress != 0) || defaultProgress != 0\"><span ng-if=\"f.progress != undefined && f.progress != 0\">{{f.progress + \'%\'}} <span style=\"display: inline-block; width: 89%;\" ng-if=\"f.progress == 100 && !f.newName\">{{f.name}}</span> <span style=\"display: inline-block; width: 89%;\" ng-if=\"f.progress == 100 && f.newName\">{{f.newName}}</span></span> <span ng-if=\"f == undefined || f.progress == undefined\" ng-bind=\"$parent.data[field.name]\"></span></div></div><input ng-model-options=\"{fieldInfo: field}\" type=\"hidden\" class=\"form-control\" name=\"temp_filename\" ng-model=\"$parent.data[field.name]\" id=\"{{field.name}}\" ng-required=\"field.notnull\" autocomplete=\"off\"> <span class=\"input-group-btn\"><button ng-if=\"alreadySent == false || field.customOptions.only_upload == true\" type=\"file\" accept=\"{{ field.customOptions.file.acceptedFiles ? field.customOptions.file.acceptedFiles.join(\',\') : \'all\'}}\" ngf-pattern=\"\'{{ field.customOptions.file.acceptedFiles ? field.customOptions.file.acceptedFiles.join(\',\') : \'\'}}\'\" ngf-select=\"upload($file, $invalidFiles)\" class=\"btn btn-default btn-upload\"><i class=\"glyphicon glyphicon-upload\"></i></button> <button ng-if=\"alreadySent == true && (field.customOptions.only_upload != true)\" ng-click=\"download(field, data.id)\" type=\"button\" class=\"btn btn-default\"><i class=\"glyphicon glyphicon-download\"></i></button></span></div></div><div ng-if=\"field.type == \'string\' && field.customOptions.file && field.customOptions.dad\"><div fw-upload=\"\" class=\"fw-input-group\"><input ng-model-options=\"{fieldInfo: field}\" type=\"hidden\" class=\"form-control\" name=\"temp_filename\" ng-model=\"$parent.data[field.name]\" id=\"{{field.name}}\" ng-required=\"field.notnull\" autocomplete=\"off\" value=\"fileName\"><p class=\"file-preview\" ng-if=\"alreadySent == true\" style=\"margin-right: 2rem; text-align:center;\"><i class=\"fa fa-file-o\" aria-hidden=\"true\" style=\"font-size: 3.333333em;line-height: 1.75em;\"></i> <a class=\"dz-open\" ng-click=\"download(field, data.id)\">{{fileName}}</a> <a class=\"dz-open\" ng-click=\"download(field, data.id)\" data-dz-download=\"\">Baixar Arquivo</a> <a class=\"dz-remove\" ng-click=\"remove(fileName)\" style=\"color: red\" data-dz-remove=\"\">Remover Arquivo</a></p><div class=\"dropzone\" options=\"dzOptions\" callbacks=\"pushName()\" methods=\"dzMethods\" ng-dropzone=\"\"></div></div></div><div ng-if=\"field.type == \'text\' && !field.customOptions.rich\"><textarea ng-model-options=\"{fieldInfo: field}\" id=\"{{field.name}}\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" ng-disabled=\"field.disabled\" placeholder=\"{{field.customOptions.placeholder ? field.customOptions.placeholder : \'\'}}\" class=\"main-input form-control\" rows=\"{{field.customOptions.rows}}\"></textarea></div><div ng-if=\"field.type == \'text\' && field.customOptions.rich\"><textarea ckeditor=\"{\'language\':\'pt-br\'}\" ng-model-options=\"{fieldInfo: field}\" id=\"{{field.name}}\" fw-dynamic=\"\" ng-required=\"field.notnull\" ng-model=\"data[field.name]\" class=\"main-input form-control\" ng-disabled=\"field.disabled\"></textarea></div><div ng-if=\"field.type == \'boolean\'\"><label for=\"{{field.name}}\"><toggle id=\"{{field.name}}\" ng-model-options=\"{fieldInfo: field}\" ng-model=\"data[field.name]\" name=\"{{field.name}}\" on=\"{{field.customOptions.statusTrueText}}\" off=\"{{field.customOptions.statusFalseText}}\" size=\"btn-sm\" ng-if=\"!field.disabled\"></toggle><span ng-if=\"field.disabled\">{{$parent.data[field.name] ? field.customOptions.statusTrueText : field.customOptions.statusFalseText}}</span></label></div><div ng-if=\"field.autocomplete && !field.customOptions.autocomplete_table\"><div fw-auto-complete=\"\" class=\"fw-input-group fw-auto-complete input-group\"><input id=\"{{field.name}}\" ng-model-options=\"{fieldInfo: field}\" fw-auto-complete=\"\" typeahead-on-select=\"autocompleteSelect($item, $model, $label)\" aria-autocomplete=\"none\" autocomplete=\"off\" typeahead-min-length=\"0\" typeahead=\"row as row.label for row in autocomplete(field, $viewValue)\" type=\"text\" class=\"form-control\" name=\"{{field.name}}\" ng-required=\"field.notnull\" ng-model=\"$parent.data[field.name + \'.label\']\" size=\"{{field.length}}\" placeholder=\"{{field.label}}\" ng-disabled=\"field.disabled\" ng-readonly=\"field.customOptions.select == true\" ng-class=\"{\'fieldSelect\': field.customOptions.select == true}\"> <span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\" ng-disabled=\"field.disabled\"><i class=\"glyphicon\" ng-class=\"{\'glyphicon-search\': field.customOptions.select == undefined, \'glyphicon-menu-down\': field.customOptions.select == true}\"></i></button></span></div></div><div ng-if=\"field.autocomplete && field.customOptions.autocomplete_table\"><div fw-auto-complete=\"\" class=\"fw-input-group fw-auto-complete input-group\"><input style=\"display:none\" id=\"{{field.name}}\" ng-model-options=\"{fieldInfo: field}\" fw-auto-complete=\"\" typeahead-on-select=\"autocompleteSelect($item, $model, $label)\" aria-autocomplete=\"none\" autocomplete=\"off\" typeahead-min-length=\"0\" typeahead=\"row as row.label for row in autocomplete(field, $viewValue)\" type=\"text\" class=\"form-control\" name=\"{{field.name}}\" ng-required=\"field.notnull\" ng-model=\"$parent.data[field.name + \'.label\']\" size=\"{{field.length}}\" placeholder=\"{{field.label}}\" ng-disabled=\"field.disabled\"></div><div fw-auto-complete-table=\"\" data-name=\"{{field.name}}\"><div class=\"fw-input-group fw-auto-complete input-group\"><input type=\"text\" id=\"input-ac-table\" ng-model=\"$parent.data[field.name + \'.label\']\" ng-model-options=\"{fieldInfo: field, debounce: 500}\" class=\"form-control\" autocomplete=\"off\" ng-change=\"updateAutocompleteTable(field.customOptions.autocomplete_table.table_name,field.customOptions.autocomplete_table.table_columns[0].name, this)\" ng-focus=\"autocompleteTableFocus(field.customOptions.autocomplete_table.table_name)\" ng-blur=\"autocompleteTableLostFocus()\" ng-disabled=\"field.disabled\"> <span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\"><i class=\"glyphicon\" ng-class=\"{\'glyphicon-search\': field.customOptions.select == undefined, \'glyphicon-menu-down\': field.customOptions.select == true}\"></i></button></span></div><div ng-if=\"field.customOptions.autocomplete_table != undefined\" ng-show=\"tableVisibily\" ng-model-options=\"{fieldInfo: field}\"><div class=\"table-container\"><table id=\"myTable\" class=\"table table-striped\"><thead><tr><th ng-repeat=\"column in field.customOptions.autocomplete_table.table_columns\">{{column.label}}</th></tr></thead><tbody><tr ng-repeat=\"data in autocompleteTableData2\" id=\"{{data.id}}\" ng-mousedown=\"tableSelected($event,field.name,data)\"><td ng-repeat=\"column in field.customOptions.autocomplete_table.table_columns\">{{data[column.name]}}</td></tr></tbody></table></div></div></div></div></div>");}]);