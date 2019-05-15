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
        'colorpicker-dr',
        'ckeditor',
        'thatisuday.dropzone'
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

            this.headers[name].get = function (name) {
                for (var _x in this.fields) {
                    var field = this.fields[_x];

                    if (field.name == name) {
                        return field;
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

    };
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
    
        self.createCRUDModal = function (headers, data, ctrl, template) {
            return self._createModal({
                animation: true,
                templateUrl: template || 'lets/views/crud/crud-modal.html',
                controller: ctrl || 'CRUDFormModalController',
                resolve: {
                    headers: function() { return headers; },
                    data: function() {
                        try {
                            var _data = angular.copy(data);
                        } catch(error) {
                            var _data = jQuery.extend({}, data);
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
            createModal: self._createModal,
            createCRUDModal: self.createCRUDModal,
            hide: self.hide
        };
    }
  
})();
  
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
  
(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwUpload', fwUpload);

    fwUpload.$inject = ['$timeout'];

    function fwUpload($timeout) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, $rootScope, element) {

                $scope.defaultProgress = 0;
                $scope.alreadySent = false;
                var controll = true;

                $scope.$on('setProgressFile', function () {
                    if ($scope.data[$scope.field.name] != undefined && $scope.data[$scope.field.name] != null && ($scope.fileName && $scope.fileName != 'fileName')) {
                        $scope.defaultProgress = 100;
                        $scope.alreadySent = true;
                    }
                });

                $scope.pushName = function () {
                    $timeout(function () {
                        if (document.getElementsByClassName('dz-filename')[0] && controll) {
                            controll = false;
                            document.getElementsByClassName('dropzone')[0].style.width = '192px';
                            if (document.getElementsByClassName('file-preview')[0]) {
                                document.getElementsByClassName('file-preview')[0].style.display = 'none';
                            }
                            document.getElementsByName('temp_filename')[0].value = document.getElementsByClassName('dz-filename')[0].firstElementChild.innerText;
                            var _input = element.find('input[type="hidden"]');
                            _input.controller('ngModel').$setViewValue(document.getElementsByName('temp_filename')[0].value);
                        }
                    });
                };

                $scope.remove = function () {
                    $scope.alreadySent = false;
                    var _input = element.find('input[type="hidden"]');
                    document.getElementsByName('temp_filename')[0].value = null;
                    _input.controller('ngModel').$setViewValue(null);
                };

                $scope.upload = function (file, errFiles) {
                    $scope.f = file;
                    $scope.errFile = errFiles && errFiles[0];
                    if (file) {

                        file.upload = $scope._upload($scope.field, file);
                        file.upload.then(function (response, err) {
                            $scope.$emit('upload-complete', response);
                            $timeout(function () {
                                file.result = response.data;
                                if (element.$$element) {
                                    var _input = element.$$element.find('input[type="hidden"]');
                                } else {
                                    var _input = element.find('input[type="hidden"]');
                                }

                                file.newName = response.data.result.files.file[0].name;

                                _input.controller('ngModel').$setViewValue(file.newName);

                            });
                        }, function (response) {
                            console.log(response);
                            
                            if (response.status > 0) {
                                $scope.errorMsg = response.status + ': ' + response.data;
                            }
                                $scope.$emit('upload-error', response);

                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        })
                    }
                };

            }
        }
    }
})();

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
            },
            template:

            '<div class="input-group fw-input-group"><input type="text" class="form-control" placeholder="add a tag..." ng-model="newValue" /> ' +
            '<span class="input-group-btn"><a class="btn btn-default" ng-click="add()">Add</a></span></div>' +
            '<div class="tags">' +
            '<div ng-repeat="(idx, tag) in tags" class="tag label label-success">{{tag}} <a class="close" href ng-click="remove(idx)">×</a></div>' +
            '</div>',
            link: function ($scope, $element) {

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

(function () {
    'use strict';

    angular.module('letsAngular').directive('numbersOnly', function(){
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');
    
                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }            
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });


})();

(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwInput', fwInput);

    fwInput.$inject = ['viaCEP', '$timeout', '$compile', 'jQuery', '$sce'];

    function fwInput(viaCEP, $timeout, $compile, jQuery, $sce) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'lets/views/framework/input.html',
            replace: true,
            link: {

                pre: function preLink(scope, $el, attrs, controller) {
                    
                    var dataVar = $el.attr('fw-data');
                    
                    if (scope.field.customOptions.events == undefined) {
                        scope.field.customOptions.events = {};
                    }

                    scope.fieldHtml = function () {
                        return $sce.trustAsHtml(scope.field.toString());
                    }

                    if (dataVar != 'data') {
                        scope.data = scope[dataVar];
                    }

                    if(dataVar=="detail_data"){
                        var detail = scope.detail_key;

                        if (scope.field.autocomplete !== false){
                            scope.autocomplete = function (field, val) {
                                return scope.autocompleteDetail(detail, field, val);
                            }
    
                            scope.autocompleteSelect = function ($item, $model, $label) {
                                return scope.autocompleteDetailSelect(detail, $item, $model, $label);
                            }
                        }

                        if (scope.field.customOptions.file != undefined) {
                            scope.download = function (field, id) {
                                return scope.downloadDetail(detail, field, id, scope.data);
                            }
                        }
                    }

                    if (scope.field.customOptions.cep != undefined) {

                        $el.find('input.main-input').blur(function () {
                            var $scope = angular.element(this).scope();
                            
                            viaCEP.get(this.value).then(function (response) {
                                var map = $scope.field.customOptions.cep;

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
                    }

                    jQuery($el).on('blur', ':input[ng-model]', function (e) {
                        try {
                            if (angular.element(this).scope().field.customOptions.events.blur != undefined) {
                                angular.element(this).scope().field.customOptions.events.blur.call(this, e);
                            }
                        }
                        catch (e) {
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

(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwInputDetail', fwInputDetail);

    fwInputDetail.$inject = ['viaCEP', '$timeout', '$compile', 'jQuery'];

    function fwInputDetail(viaCEP, $timeout, $compile, jQuery) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'lets/views/framework/input-detail.html',
            replace: true,
            link: {
                post: function preLink(scope, $el, attrs, controller) {

                }
            }
        }
    }
})();

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
            link: {
                post: function postLink(scope, $el, attrs, controller) {
                    if (!controller) {
                        controller = $el.controller('ngModel');
                    }

                    if (scope.field.type == 'date') {
                        $el.mask('99/99/9999');

                    } else if (scope.field.customOptions.cpf != undefined) {
                        $el.mask('999.999.999-99');

                    } else if (scope.field.customOptions.cnpj != undefined) {
                        $el.mask('99.999.999/9999-99');
                        
                    } else if (scope.field.customOptions.customMask != undefined) {
                        $el.mask(scope.field.customOptions.customMask);

                    } else if (scope.field.type == 'float') {
                        if (scope.field.customOptions.currency != undefined) {
                            $el.mask("#.##0,00", { reverse: true });
                            controller.$parsers.unshift(function (value) {
                                return parseFloat($el.cleanVal(),10)/100;
                            });
                            controller.$formatters.unshift(function (value) {
                                return $el.masked(value ? parseFloat(value).toFixed(2) : null);
                            });
                        } else {
                            
                        }
                    }else if (scope.field.customOptions.documento !== undefined) {

                        var cpfOrCnpj = function (val) {
                            return val.replace(/\D/g, '').length >= 12 ? '00.000.000/0000-00' : '000.000.000-009' ;
                        },
                            docOptions = {
                                onKeyPress: function (val, e, field,  options) {
                                    field.mask(cpfOrCnpj.apply({}, arguments), options);
                                }
                            };
     
                        $timeout(function () {
                            $el.mask(cpfOrCnpj, docOptions);
                        }, 10);


                    } else if (scope.field.customOptions.telefone != undefined) {
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

                    } else if (scope.field.customOptions.cep != undefined) {

                        $el.blur(function () {

                            if (!this.value){
                                return false;
                            }

                            var $scope = angular.element(this).scope();
                            var dataVar = jQuery(this).parent().attr('fw-data');
                            viaCEP.get(this.value).then(function (response) {
                                var map = $scope.field.customOptions.cep;

                                $scope.data[map.address] = response.logradouro;
                                $scope.data[map.district] = response.bairro;
                                $scope.data[map.city] = response.localidade;
                                $scope.data[map.state] = response.uf;
                                $scope.data[map.ibge] = response.ibge;
                                $scope.data[map.gia] = response.gia;

                                $scope.$emit('viacep complete', response);
                            });
                        });
                    }
                }
            }
        }
    }
})();

(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwDetailData', fwDetailData);

    fwDetailData.$inject = ['$rootScope', '$timeout', '$compile', 'jQuery', '$sce'];

    function fwDetailData($rootScope, $timeout, $compile, jQuery, $sce) {
        return {
            restrict: 'E',
            scope: true,
            template: '<span" ng-bind-html="formatData(detail_data, field)"></span>',
            replace: true,
            link: {
                pre: function preLink(scope, $el, attrs, controller) {

                    scope.formatData = function (data, field) {

                        if (field.autocomplete !== false) {
                            if(!data[field.name + '.label']){
                                return null
                            }else{
                                return data[field.name + '.label'].label || data[field.name + '.label'];
                            }

                        }
                        else if (field.type == 'date') {

                            if (field.customOptions.hour) {
                                return moment(data[field.name]).format('DD/MM/YYYY HH:mm');
                            } else {
                                return moment(data[field.name]).format('DD/MM/YYYY');
                            }

                        }
                        else  if (field.type == 'boolean') {

                            if (field.customOptions.statusFalseText && field.customOptions.statusTrueText) {
                                if (data[field.name]) {
                                    return field.customOptions.statusTrueText;
                                } else {
                                    return field.customOptions.statusFalseText;
                                }
                            }

                        }
                        else if (field.type == 'string' && field.customOptions.file) {

                            var url = $rootScope.appSettings.API_URL + 'upload/' + field.customOptions.file.container + '/download/' + data[field.name];
                            return $sce.trustAsHtml('<a target="_blank" href="' + url + '" class="btn btn-default ng-scope" style=""><i class="glyphicon glyphicon-download"></i></a>');
                           
                            
                        }else if (field.type == 'float') {

                            if( field.customOptions && field.customOptions.currency ){
                                var rawData = data[field.name];                                
                                var rawData = rawData.toFixed(2).split('.');
                                rawData[0] = "R$ " + rawData[0].split(/(?=(?:...)*$)/).join('.');
                                return rawData.join(',');
                            }else{
                                return data[field.name];
                            }

                        }else{
                            return data[field.name];
                        }

                    }

                }
            }
        }
    }
})();

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
                setAttributeIfNotExists('show-button-bar', false);
                setAttributeIfNotExists('show-weeks', false);
                setAttributeIfNotExists('datepicker-options', 'datepickerOptions');

                element.addClass('form-control');
                element.removeAttr('fw-date-picker');
                element.after(wrapper);
                wrapper.prepend(element);

                return function (scope, element) {
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
                            scope.field.error = true;
                        } else {
                            scope.field.error = false;
                        }
                    });


                    // element.find('input').focus(function (e) {
                    //     scope.vm.openPopup(e);
                    // });

                    scope.datepickerOptions = options;

                    $compile(element)(scope);
                };
            },
            controller: ["$scope", function ($scope) {
                this.popupOpen = false;
                
                this.openPopup = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    this.popupOpen = true;
                };
            }],
            controllerAs: controllerName
        };
    }
})();

(function (root, factory) {
  // AMD
  if (typeof define === 'function' && define.amd) define(['angular'], factory);
  // Global
  else factory(angular);
}(this, function (angular) {

  angular
  .module('ckeditor', [])
  .directive('ckeditor', ['$parse', ckeditorDirective]);

  // Polyfill setImmediate function.
  var setImmediate = window && window.setImmediate ? window.setImmediate : function (fn) {
    setTimeout(fn, 0);
  };

  /**
   * CKEditor directive.
   *
   * @example
   * <div ckeditor="options" ng-model="content" ready="onReady()"></div>
   */

  function ckeditorDirective($parse) {
    return {
      restrict: 'A',
      require: ['ckeditor', 'ngModel'],
      controller: [
        '$scope',
        '$element',
        '$attrs',
        '$parse',
        '$q',
        ckeditorController
      ],
      link: function (scope, element, attrs, ctrls) {
        // get needed controllers
        var controller = ctrls[0]; // our own, see below
        var ngModelController = ctrls[1];

        // Initialize the editor content when it is ready.
        controller.ready().then(function initialize() {
          // Sync view on specific events.
          ['dataReady', 'change', 'blur', 'saveSnapshot'].forEach(function (event) {
            controller.onCKEvent(event, function syncView() {
              ngModelController.$setViewValue(controller.instance.getData() || '');
            });
          });

          controller.instance.setReadOnly(!! attrs.readonly);
          attrs.$observe('readonly', function (readonly) {
            controller.instance.setReadOnly(!! readonly);
          });

          // Defer the ready handler calling to ensure that the editor is
          // completely ready and populated with data.
          setImmediate(function () {
            $parse(attrs.ready)(scope);
          });
        });

        // Set editor data when view data change.
        ngModelController.$render = function syncEditor() {
          controller.ready().then(function () {
            // "noSnapshot" prevent recording an undo snapshot
            controller.instance.setData(ngModelController.$viewValue || '', {
              noSnapshot: true,
              callback: function () {
                // Amends the top of the undo stack with the current DOM changes
                // ie: merge snapshot with the first empty one
                // http://docs.ckeditor.com/#!/api/CKEDITOR.editor-event-updateSnapshot
                controller.instance.fire('updateSnapshot');
              }
            });
          });
        };
      }
    };
  }

  /**
   * CKEditor controller.
   */

  function ckeditorController($scope, $element, $attrs, $parse, $q) {
    var config = $parse($attrs.ckeditor)($scope) || {};
    var editorElement = $element[0];
    var instance;
    var readyDeferred = $q.defer(); // a deferred to be resolved when the editor is ready

    // Create editor instance.
    if (editorElement.hasAttribute('contenteditable') &&
        editorElement.getAttribute('contenteditable').toLowerCase() == 'true') {
      instance = this.instance = CKEDITOR.inline(editorElement, config);
    }
    else {
      instance = this.instance = CKEDITOR.replace(editorElement, config);
    }

    /**
     * Listen on events of a given type.
     * This make all event asynchronous and wrapped in $scope.$apply.
     *
     * @param {String} event
     * @param {Function} listener
     * @returns {Function} Deregistration function for this listener.
     */

    this.onCKEvent = function (event, listener) {
      instance.on(event, asyncListener);

      function asyncListener() {
        var args = arguments;
        setImmediate(function () {
          applyListener.apply(null, args);
        });
      }

      function applyListener() {
        var args = arguments;
        $scope.$apply(function () {
          listener.apply(null, args);
        });
      }

      // Return the deregistration function
      return function $off() {
        instance.removeListener(event, applyListener);
      };
    };

    this.onCKEvent('instanceReady', function() {
      readyDeferred.resolve(true);
    });

    /**
     * Check if the editor if ready.
     *
     * @returns {Promise}
     */
    this.ready = function ready() {
      return readyDeferred.promise;
    };

    // Destroy editor when the scope is destroyed.
    $scope.$on('$destroy', function onDestroy() {
      // do not delete too fast or pending events will throw errors
      readyDeferred.promise.then(function() {
        instance.destroy(false);
      });
    });
  }
}));

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

(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwAutoComplete', fwAutoComplete);

    fwAutoComplete.$inject = ['$compile', '$timeout'];

    function fwAutoComplete($compile, $timeout) {
        var controllerName = 'vm';
        return {
            restrict: 'A',
            priority: 1,
            link: function (scope, element) {
                var _input = element.find('input');

                var clickHandler = function () {
                    var _oldVal = _input.val();
                    var _val = _oldVal + ' ';
                    _input.controller('ngModel').$setViewValue(_val);
                    // scope.$digest;
                    $timeout(function(){
                        _input.controller('ngModel').$setViewValue(_oldVal);
                    });
                };

                element.find('button').click(clickHandler);
                _input.click(clickHandler);

                _input.keyup(function(){
                    if (this.value.trim()==""){
                        delete _input.scope().data[_input.attr('name')];
                    }
                })

            },
            controller: function () {
                
            },
            controllerAs: controllerName
        };
    }
})();

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

(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('crudTabList', crudTabList);

    crudTabList.$inject = ['jQuery'];

    function crudTabList(jQuery) {
        return {
            scope: {
                crudTabListData: '=',
                crudTabListSettings: '&',
                parentData: '='
            },
            templateUrl: 'lets/views/crud/crud-tab-list.html',
            link: function (scope, $el) {
    
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
            controller: ["$scope", function ($scope) {
                $scope.route = null;

                $scope.$on('refreshGRID', function (event, start, filter) {
                    $scope.pageableCRUDModel.fetch(null, start, filter);
                });
            }],
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
                            return resp.data;
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
                                                    var rawData = rawData.toFixed(2).split('.');
                                                    rawData[0] = "R$ " + rawData[0].split(/(?=(?:...)*$)/).join('.');
                                                    return rawData.join(',');
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
                                            params[p[0]] = decodeURIComponent(p[1]);
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
                                                if (typeof(params[par])=="object"){
                                                    $scopeFilter.data[par+"_ini"] = moment(params[par].ini, 'DD/MM/YYYY').toDate();
                                                    $scopeFilter.data[par+"_fim"] = moment(params[par].fim, 'DD/MM/YYYY').toDate();
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

(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('crudForm', crudForm);

    crudForm.$inject = ['jQuery', '$timeout', 'appSettings'];

    function crudForm(jQuery, $timeout, appSettings) {
        return {
            replace: false,
            link: function (scope, $el) {

                /* Dropzone */
                //Set options for dropzone
                for (var y in scope.headers.fields) {
                    var field = scope.headers.fields[y];
                    if (field.customOptions.file) {
                        scope.dzOptions = {
                            url: appSettings.API_URL + 'upload/' + field.customOptions.file.container + '/upload',
                            acceptedFiles: field.customOptions.file.acceptedFiles,
                            maxFilesize: '25',
                            maxFiles: '1',
                            uploadMultiple: false,
                            addRemoveLinks: true,
                        };
                    }
                }
                //Apply methods for dropzone
                scope.dzMethods = {};
                scope.removeNewFile = function () {
                    scope.dzMethods.removeFile(scope.newFile); //We got $scope.newFile from 'addedfile' event callback
                }
                /* Dropzone */


                jQuery($el).on('click', '.button-new', function () {
                    var detail = jQuery(this).attr('detail');
                    var origin = jQuery(this).attr('origin');
                    var modal = jQuery(this).attr('form-modal')=="true";

                    scope.newDetailData(origin, detail, modal);
                });

                $timeout(function () {
                    $el.find('.tab-group .nav-tabs li:first').find('a').click();
                    $el.find(':input[type!="hidden"]:first').focus();
                }, 500);

                $($el).parsley({
                    priorityEnabled: false,
                    errorsContainer: function (el) {
                        return el.$element.closest(".input-container");
                    }
                });

            }
        }
    }
})();

(function () {
    'use strict';

    angular.module('letsAngular').directive('crudFilter', crudFilter);

    crudFilter.$inject = ['$q','Restangular', '$timeout', '$rootScope'];

    function crudFilter($q, Restangular, $timeout, $rootScope) {
        return {
            templateUrl: 'lets/views/crud/crud-filter.html',
            replace: true,
            scope: {
                fields: '&',
                route: '&',
                search:'&'
            },
            controller: ["$scope", function ($scope) {
               
            }],
            link: function (scope, $el) {

                scope.data = {};
                scope.showBuscaAvancada = false;
                var fields = angular.copy(scope.fields());

                scope.fieldsFilter = [];
                fields.forEach(function(field, idx){
                    if (!field.filter)return;

                    field.disabled = false;
                    field.notnull = false;
                    field.name = field.name;

                    if (field.customOptions.file){
                        delete field.customOptions.file;
                    }

                    if (field.type=="text"){
                        field.type = "string";
                    }
                    else if (field.type=="boolean"){
                        field.type = "number";
                        field.autocomplete = true;
                        field.customOptions = {
                            "list":[
                                {"id":"false",  "label":field.customOptions.statusFalseText},
                                {"id":"true",  "label":field.customOptions.statusTrueText}
                            ],
                            "select":true
                        };
                    }
                    else if (field.type=="date"){
                        
                        if (typeof(field.filter)=="object" && field.filter.range===true){
                            
                            var _ini = angular.copy(field);
                            _ini.name +="_ini";
                            _ini.label +=" (Início)";
                            scope.fieldsFilter.push(_ini);

                            var _fim = angular.copy(field);
                            _fim.name +="_fim";
                            // Não mudar para "fim", ordenação está por ordem alfabética do label !
                            _fim.label +=" (Término)";
                            scope.fieldsFilter.push(_fim);

                            return;
                        }

                    }
                    else if (field.type == "number" || field.type == "integer" || field.type == "float" || field.type == "bigint"){
                        
                        if (typeof(field.filter)=="object" && field.filter.range===true){
                            
                            var _ini = angular.copy(field);
                            _ini.name +="_ini";
                            _ini.label +=" (Início)";
                            scope.fieldsFilter.push(_ini);

                            var _fim = angular.copy(field);
                            _fim.name +="_fim";
                            // Não mudar para "fim", ordenação está por ordem alfabética do label !
                            _fim.label +=" (Término)";
                            scope.fieldsFilter.push(_fim);

                            return;
                        }

                    }

                    scope.fieldsFilter.push(field);
                });

                scope.autocomplete = function (field, val) {
                    scope.resource = Restangular.all(scope.route());

                    var queries = [];
        
                    var deferred = $q.defer();
        
                    if (field.autocomplete_dependencies.length > 0) {
                        var deps = field.autocomplete_dependencies;
                        for (var x in deps) {
                            var dep = deps[x];
                            if (scope.data[dep.field] == undefined || scope.data[dep.field] == null || scope.data[dep.field] == "null") {
        
                                var text = 'Selecione antes o(a) ' + dep.label;
        
                                var data = [];
                                data.push({ id: null, label: text });
        
                                deferred.resolve(data);
        
                                return deferred.promise;
                            } else {
                                queries[dep.field] = scope.data[dep.field];
                            }
                        }
                    }
        
                    val = val.trim();
                    if (val.length == 0 || field.customOptions.select == true) {
                        val = '[blank]';
                    }
        
                    if (field.customOptions.general !== undefined) {
                        
                        scope.resource.customGET('general/autocomplete/' + field.customOptions.general + '/' + val, queries).then(function (data) {
                            deferred.resolve(data);
                        }, function errorCallback() {
                            return deferred.reject();
                        });

                    } else if (field.customOptions.list == undefined) {
                        
                        var route = 'autocomplete/' + field.name+ '/' + val;
        
                        if (field.customOptions.select == true){
                            queries["limit"] = 0;
                        }else{
                            queries["limit"] = 20;
                        }
        
                        scope.resource.customGET(route, queries).then(function (data) {
                            // if (field.customOptions.select == true) {
                                data.unshift({ id: "null", label: '[Em Branco]' });
                                data.unshift({ id: null, label: '--- Selecione ---' });
                            // }
                            deferred.resolve(data);
                        }, function errorCallback() {
                            return deferred.reject();
                        });

                    } else {
        
                        var options = angular.copy(field.customOptions.list) || [];
        
                        if (field.customOptions.select == true) {
                            options.unshift({ id: "null", label: '[Em Branco]' });
                            options.unshift({ id: null, label: '--- Selecione ---' });
                        }
        
                        deferred.resolve(options);
                    }
                    return deferred.promise;
                }

                scope.autocompleteSelect = function ($item, $model, $label) {
            
                    var _data = this.data;
        
                    if (_data==undefined){
                        _data = {};
                    }
        
                    if ($item.id != null && typeof $item.id != 'integer' || (typeof $item.id == 'integer' && $item.id > 0)) {
                        _data[this.field.name] = $item.id;
                    }
                    else if ($item.id == null) {
                        _data[this.field.name] = _data[this.field.name + '.label'] = null;
                    }
                    else {
                        _data[this.field.name + '.label'] = null;
                        return false;
                    }
        
                    this.data = _data;
        
                    var field = this.field;
                    $timeout(function(){
                        jQuery('#'+field.name).trigger('keyup');
                    });
                }

                scope.filterData = function(start){

                    scope.objFilter = undefined;

                    var filterData = {};
                    if(scope.data['showBuscaAvancada']){
                        scope.showBuscaAvancada = angular.copy(scope.data['showBuscaAvancada']);
                        delete scope.data['showBuscaAvancada'];
                    }
                    if (scope.showBuscaAvancada){
                        fields.forEach(function(field, idx){

                            if (typeof(field.filter)=="object" && field.filter.range===true){

                                var values = {};

                                if (scope.data[field.name+"_ini"]){
                                    values.ini = scope.data[field.name+"_ini"];
                                    if (field.type=="date"){
                                        values.ini = scope.getDateFormated(values.ini);
                                    }
                                }

                                if (scope.data[field.name+"_fim"]){
                                    values.fim = scope.data[field.name+"_fim"];
                                    if (field.type=="date"){
                                        values.fim = scope.getDateFormated(values.fim);
                                    }
                                }

                                if (Object.keys(values).length>0){
                                    filterData[field.name] = values;
                                }
                                
                            }

                            if (scope.data[field.name]){
                                filterData[field.name] = scope.data[field.name];

                                if(field.type=="date"){
                                    filterData[field.name] = scope.getDateFormated(filterData[field.name])
                                }

                                if(field.autocomplete){
                                    filterData[field.name+"_label"] = scope.data[field.name+".label"].label;
                                }
                            }
                        });
                        scope.data.q = null;
                        scope.objFilter = {data:{filter:filterData}};
                    }else{
                        filterData.q = scope.data.q;
                        filterData.p = scope.data.p;
                        scope.objFilter = {data:filterData};
                    }
                    if(start){
                        $rootScope.$broadcast('refreshGRID', false, true);
                    }
                }

                scope.openBuscaAvancada = function(){
                    scope.showBuscaAvancada = !scope.showBuscaAvancada;
                    // scope.filterData(true);
                }

                scope.getDateFormated = function(dt){
                    return moment(dt).format('DD/MM/YYYY');
                }

               if(scope.search()=="fixed"){
                scope.showBuscaAvancada = true;
                scope.hideInputSearch = true;
               }

            }
        }
    }
})();
(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('crudBreadcrumb', crudBreadcrumb);

    crudBreadcrumb.$inject = [];

    function crudBreadcrumb() {
        return {
            restrict: 'E',
            templateUrl: 'lets/views/framework/breadcrumb.html',
            replace: true,
            link: function (scope, $el) {

            }
        }
    }
})();
(function () {
    'use strict';
    fwStateProvider.$inject = ["$stateProvider"];
    angular
        .module('letsAngular')
        .provider('fwState', fwStateProvider);

    function fwStateProvider ($stateProvider) {

        this.$get = $stateProvider.$get;
        this.state = $stateProvider.state;

        this.setCRUDRoutes = function (settings) {

            var _options = {
                main: {
                    enable: true,
                    templateUrl: 'lets/views/crud/crud.html',
                    controller: 'CRUDController',
                },
                list: {
                    enable: true,
                    templateUrl: 'lets/views/crud/crud-list.html',
                    controller: 'CRUDController'
                },
                edit: {
                    enable: true,
                    templateUrl: 'lets/views/crud/crud-edit.html',
                    controller: 'CRUDEditController'
                },
                new: {
                    enable: true,
                    templateUrl: 'lets/views/crud/crud-edit.html',
                    controller: 'CRUDEditController'
                }
            };

            var options = angular.merge(_options, settings.options);

            if (options.main.enable) {
                this.state('app.'+settings.route, {
                    abstract: true,
                    url: '/'+settings.route,
                    templateUrl: options.main.templateUrl,
                    controller: options.main.controller,
                    resolve: {
                    id: ['$stateParams', function ($stateParams) {
                        return $stateParams.id;
                    }],
                    module: function () {
                        return settings.modelName;
                    }
                    }
                });
            }
            
            if (options.list.enable) {
                this.state('app.'+settings.route+'.list', {
                    url: '?filter',
                    templateUrl: options.list.templateUrl,
                    controller: options.list.controller
                });
            }
            if (options.new.enable) {
                this.state('app.'+settings.route+'.new', {
                    url: '/new?filter',
                    templateUrl: options.new.templateUrl,
                    controller: options.new.controller
                });
            }
            if (options.edit.enable) {
                this.state('app.'+settings.route+'.edit', {
                    url: '/:id/edit?filter',
                    templateUrl: options.edit.templateUrl,
                    controller: options.edit.controller
                });
            }
        }
    }
})();
  
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
            return $templateRequest('lets/views/crud/crud.html');
        };

        self.getCrudListTemplate = function () {
            return $templateRequest('lets/views/crud/crud-list.html');
        };
        
        self.getCrudEditTemplate = function () {
            return $templateRequest('lets/views/crud/crud-edit.html');
        };
    
        return {
            getCrudBaseTemplate: self.getCrudBaseTemplate,
            getCrudListTemplate: self.getCrudListTemplate,
            getCrudEditTemplate: self.getCrudEditTemplate
        };
  
    }
})();
  
(function () {
    'use strict';

    angular.module('letsAngular')
        .factory('Backgrid', BackgridFactory);

    BackgridFactory.$inject = ['$window'];

    function BackgridFactory($window) {
        return $window.Backgrid;
    }

})();

(function () {
    'use strict';

    angular.module('letsAngular')
        .factory('Backbone', BackboneFactory);

    BackboneFactory.$inject = ['$window'];

    function BackboneFactory($window) {
        return $window.Backbone;
    }

})();

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
        }
    }
})();

(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDController', ["$scope", "Restangular", "module", "$state", "$window", "$stateParams", "$rootScope", "headers", function ($scope, Restangular, module, $state, $window, $stateParams, $rootScope, headers) {
        $scope.headersReady = false;

        function getHeaders() {
            var data = angular.copy(headers.get(module));
            $scope.headers = data;
        }

        getHeaders();

        $scope.$on('refresh-headers', function () {
            getHeaders();
        })

        $scope.resource = Restangular.all($scope.headers.route);

        $scope.$broadcast('headers-set');
        $scope.headersReady = true;

        $scope.getFilter = function(){
            return decodeURIComponent($window.location.search).replace("?filter=","");
        }

        $scope.goNew = function () {
            $state.go($state.current.name.replace('.list', '.new'), {filter:$scope.getFilter()});
        };

        $scope.goToList = function () {
            if ($state.current.name.indexOf('.list') == -1) {
                $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'), {filter:$scope.getFilter()});
            }
        };

        $scope.edit = function (row) {
            $state.go($state.current.name.replace(/\.list$/, '.edit'), { id: row.id, page: null, filter:$scope.getFilter()});
        };

        $scope.delete = function (row) {
            return $scope.resource.customDELETE(row.id).then(function () {
                $rootScope.$broadcast('refreshGRID');
            });
        };
    }]);

})();
(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDFormModalController', ["$controller", "$scope", "$modalInstance", "ngToast", "headers", "Restangular", "$stateParams", "$timeout", "$state", "$rootScope", "$q", "$http", "Upload", "$modal", "data", "fwStringService", "auth", "fwObjectService", "fwErrorService", function ($controller, $scope, $modalInstance, ngToast, headers, Restangular, $stateParams, $timeout, $state, $rootScope, $q, $http, Upload, $modal, data, fwStringService, auth, fwObjectService, fwErrorService) {
        $controller('CRUDEditController', { $scope: $scope, Restangular: Restangular, $stateParams: $stateParams, $timeout: $timeout, $modal: $modal, module: module, $state: $state, $rootScope: $rootScope, $q: $q, ngToast: ngToast, $http: $http, Upload: Upload });

        $scope.data = data || {};
        $scope.headers = headers;

        $scope.resource = Restangular.all(headers.route);

        for (var y in $scope.headers.fields) {
            var field = $scope.headers.fields[y];
            if (field.type == 'boolean' && $scope.data[field.name]==undefined) {
                if (field.customOptions.default){
                    $scope.data[field.name] = true;
                }else{
                    $scope.data[field.name] = false;
                }
            }
        }

        if(headers.modal_id){
            $rootScope.$emit('open:'+headers.modal_id+'', $scope);
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
        
        $scope.submit = function () {
            if (this.crudForm.$valid) {
                $modalInstance.close($scope.data);
            } else {
                fwErrorService.emitFormErrors(this.crudForm)
            }
        };

        $rootScope.$on('cancel-modal', function (event, res) {
            $modalInstance.dismiss('cancel');
        });
        
        $timeout(function(){
            $scope.$broadcast('setProgressFile');
        });


    }]);

})();
(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDEditController', ["$scope", "Restangular", "$stateParams", "$timeout", "$modal", "module", "$state", "$rootScope", "$q", "ngToast", "$http", "Upload", "fwModalService", "$window", function ($scope, Restangular, $stateParams, $timeout, $modal, module, $state, $rootScope, $q, ngToast, $http, Upload, fwModalService, $window) {
        $scope.data = {};
        $scope.dataLoaded = false;
        $scope.module = module;
        $scope.$http = $http;

        $scope.$emit('refresh-headers');

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
                    for (var y in $scope.headers.fields) {
                        var field = $scope.headers.fields[y];
                        if (field.type == 'date' && (data[field.name] != undefined && data[field.name] != null)) {
                            var dt = new Date(data[field.name]);
                            dt.setHours(dt.getHours() + (dt.getTimezoneOffset()/60) );
                            data[field.name] = dt;
                        }

                        if (field.customOptions && field.customOptions.list!=undefined) {
                            field.customOptions.list.forEach(function(item){
                                if (item.id==data[field.name]){
                                    data[field.name+'.label'] = item.label;
                                }
                            });
                        }

                        if (field.type == 'password'){
                            field.notnull = false;
                        }

                        if (field.customOptions && field.customOptions.file != undefined) {
                            $scope.fileName = data[field.name];
                        }

                    }

                    $scope.data = data;
                    $scope.dataLoaded = true;
                    
                    $timeout(function(){
                        $scope.$broadcast('setProgressFile');
                    });

                    $scope.$emit('data-loaded');
                });
            } else {

                $timeout(function () {
                    $scope.$emit('data-new');
                }, 50);

                for (var y in $scope.headers.fields) {
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
        });

        $scope._upload = function (field, file) {
            var _url = $rootScope.appSettings.API_URL;

            if(field.customOptions.file.url != undefined && field.customOptions.file.container == undefined){
                _url += field.customOptions.file.url;
            }else 
                if (field.customOptions.file.url == undefined && field.customOptions.file.container != undefined) {
                _url += 'upload/' + field.customOptions.file.container + '/upload'
            }else 
                if (field.customOptions.file.url != undefined && field.customOptions.file.container != undefined) {
                _url += 'upload/' + field.customOptions.file.container + '/' + field.customOptions.file.url
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

            $scope._download(url, field, $scope.data);
        }

        $scope.downloadDetail = function (detail, field, id, data) {
            if (field.customOptions.file.container != undefined) {
                var url = $rootScope.appSettings.API_URL + 'upload/' + field.customOptions.file.container + '/download/' + data[field.name];
            } else {
                var url = $rootScope.appSettings.API_URL + $scope.module + '/details/' + detail + '/download/' + field.name + '/' + id;
            }

            $scope._download(url, field, data);
        }

        $scope._download = function (url, field, scopeData) {
            this.$http({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer'
            }).success(function (data, status, headers) {
                headers = headers();
                if (field.customOptions.file.container != undefined) {
                    var filename = scopeData[field.name];
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
            }
        }

        $scope.getFilter = function(){
            return decodeURIComponent($window.location.search).replace("?filter=","");
        }

        $scope.submit = function () {
            var $_scope = this;
            var err = {};
            var _data = $_scope.data;
 
            _.each($_scope.headers.fields, function (field, key) {
                if(!_data[field.name] && _data[field.name] != 0 && !field.notnull && field.type === 'number'){
                    _data[field.name] = null;
                }

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

                function nextBefore(){
                    if($_scope.headers.tabs){
                        Object.keys($_scope.headers.tabs).forEach(function(tab){
                            if($_scope.data[tab]){
                                delete $_scope.data[tab];
                            }
                        });
                    }

                    if (!$stateParams.id) {
                        var response = $scope.$parent.resource.post($scope.data);
                        var typeSave = "new";
                    } else {
                        var response = $scope.data.put();
                        var typeSave = "edit";
                    }

                    response.then(function (resp) {

                        function nextAfter(){
                            $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'), {filter:$scope.getFilter()});
                        }

                        $scope.$emit('after save', nextAfter, resp, typeSave);
                        if (!$scope.$$listeners["after save"]){
                            nextAfter();
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
                                    'custom.email':'Este email não é válido'
                                }

                                // debugger;
                                _.each(codes, function (code, key) {
                                    var _name = findLabel(key);

                                    if(typeof code === 'string'){
                                        code = [code];
                                    }
                                    
                                    _.each(code, function (type_err, key) {
                                        var _message = friendlyErrors[type_err].replace('%s', _name);                                
                                        messages.push(_message);
                                    })

                                })
                            }

                        }
                        
                        ngToast.warning(messages.join("<br />"));

                        $scope.$emit('error save', error);

                    });
                }

                $scope.$emit('before save', nextBefore);
                if (!$scope.$$listeners["before save"]){
                    nextBefore();
                }

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
                            messages.push('O campo ' + label + ' é obrigatório');
                        } else if (errorTypes[t] == 'date' && pattern.test(type[_x].$viewValue) == false) {
                            messages.push('O campo ' + label + ' está com uma data inválida');
                        }
                    }
                }

                if (messages.length > 0) {
                    ngToast.warning(messages.join("<br />"));
                }
                else {

                    if (!$stateParams.id) {
                        var response = $scope.$parent.resource.post($scope.data);
                        var typeSave = "new";
                    } else {
                        var response = $scope.data.put();
                        var typeSave = "edit";
                    }

                    response.then(function () {
                        if ($scope.doAfterSave != undefined && typeof $scope.doAfterSave == 'function') {
                            $scope.doAfterSave(resp, typeSave);
                        } else {
                            $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'), {filter:$scope.getFilter()});
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
                }

            }
        };

        $scope.cancel = function () {
            $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'), {filter:$scope.getFilter()});
        };

        $scope.autocompleteModels = {};

        $scope.autocompleteAdd = function (query) {
            // console.log(query);
        }

        $scope._autocomplete = function (field, val, detail) {

            var queries = [];

            var deferred = $q.defer();

            if (field.autocomplete_dependencies.length > 0) {
                var deps = field.autocomplete_dependencies;
                for (var x in deps) {
                    var dep = deps[x];
                    if ($scope.data[dep.field] == undefined || $scope.data[dep.field] == null) {

                        var text = 'Selecione antes o(a) ' + dep.label;

                        var data = [];
                        data.push({ id: null, label: text });

                        deferred.resolve(data);

                        return deferred.promise;
                    } else {
                        queries[dep.field] = $scope.data[dep.field];
                    }
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
            } else if (field.customOptions.list == undefined) {
                
                if (detail) {
                    var route = 'details/' + detail + '/autocomplete/' + field.name + '/' + val;
                } else {
                    var route = 'autocomplete/' + field.name + '/' + val;
                }

                if (field.customOptions.select == true){
                    queries["limit"] = 0;
                }else{
                    queries["limit"] = 20;
                }

                $scope.resource.customGET(route, queries).then(function (data) {

                    if (field.customOptions.select == true) {
                        data.unshift({ id: null, label: '--- Selecione ---' });
                    }

                    if (field.quickAdd === true && val != '[blank]') {
                        data.push({ id: -1, label: 'Adicionar novo: ' + val });
                    }

                    deferred.resolve(data);

                }, function errorCallback() {
                    return deferred.reject();
                });
            } else {

                var options = angular.copy(field.customOptions.list) || [];

                if (field.customOptions.select == true) {
                    options.unshift({ id: null, label: '--- Selecione ---' });
                }

                deferred.resolve(options);
            }
            return deferred.promise;
        }

        $scope.autocomplete = function (field, val) {
            return this._autocomplete(field, val, null);
        }

        $scope.autocompleteDetail = function (detail, field, val) {
            return this._autocomplete(field, val, detail);
        }

        $scope.doafterAutoCompleteSelect = {};

        $scope._autocompleteSelect = function ($item, $model, $label, detail) {
            
            var _data = detail ? this.detail_data : this.data;

            if (_data==undefined){
                _data = {};
            }

            if ($item.id != null && typeof $item.id != 'integer' || (typeof $item.id == 'integer' && $item.id > 0)) {
                _data[this.field.name] = $item.id;
            }
            else if ($item.id == null) {
                _data[this.field.name] = _data[this.field.name + '.label'] = null;
            }
            else {
                _data[this.field.name + '.label'] = null;
                return false;
            }

            if (typeof $scope.doafterAutoCompleteSelect[this.field.name] == "function") {
                $scope.doafterAutoCompleteSelect[this.field.name].call(this, _data, $item, $model, $label);
            }

            if (detail) {
                this.detail_data = _data;
            } else {
                this.data = _data;
            }

            var field = this.field;
            $timeout(function(){
                jQuery('#'+field.name).trigger('keyup');
            });
        }

        $scope.autocompleteSelect = function (detail, $item, $model, $label) {
            this._autocompleteSelect($item, $model, $label, null);
        };

        $scope.autocompleteDetailSelect = function (detail, $item, $model, $label) {
            this._autocompleteSelect($item, $model, $label, detail);
        }

        $scope.openPopup = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.popupOpen = true;
        };

        $scope.buttonClick = function (method) {
            $scope[method]();
        };
        
        $scope.newDetail = function (tab, data, id, route) {

            if (!tab.fixedRoute){
                tab.fixedRoute = tab.route;
            }
            
            var parentModel = $scope.headers.parent_route ? $scope.headers.parent_route : $scope.headers.route.toLowerCase();
            tab.route = (id ? route : $scope.headers.route+tab.fixedRoute);
            tab.id = id ? id : null;

            fwModalService.createCRUDModal(tab, null, "CRUDEditDetailController");
        };

        $scope.deleteDetail = function (route, row) {
            var resource = Restangular.all(route);
            resource.customDELETE(row.id).then(function () {
                $rootScope.$broadcast('refreshGRID');
                $rootScope.$broadcast('data-grid-updated', { type: route.split('/').pop() });
            },function(err){
                ngToast.warning(err.data.error.message);
            });
        };


        $scope.newDetailData = function(origin, detail, modal){

            $scope.data[detail] = $scope.data[detail] || [];

            if (modal){
                var headers = $scope.headers[origin][detail];

                if (headers.route_detail){
                    headers.route = headers.route_detail;
                }else{
                    headers.route = $scope.headers.route+"/details/"+detail;
                }

                fwModalService.createCRUDModal(headers)
                .then(function (response) {
                    response.new = true;
                    $scope.data[detail].push(response);
                });
            }else{
                var _new = {};
                var fields = $scope.headers[origin][detail].fields;

                for (var x in fields) {
                    if (fields[x].type != 'boolean') {
                    _new[fields[x].name] = null;
                    } else {
                    _new[fields[x].name] = false;
                    }
                }

                _new.new = true;

                $scope.data[detail].push(_new);
                $scope.$apply();
            }

        }

        $scope.editDetailData = function (origin, detail, detail_data) {

            var headers = $scope.headers[origin][detail];

            if (headers.route_detail){
                headers.route = headers.route_detail;
            }else{
                headers.route = $scope.headers.route+"/details/"+detail;
            }

            fwModalService.createCRUDModal(headers, detail_data)
            .then(function (response) {
                $scope.data[detail][ $scope.data[detail].indexOf(detail_data)] = response;
            });

        };

        $scope.deleteDetailData = function (detail_data, detail_key) {
            if (window.confirm('Deseja realmente excluir esse item?')) {
                this.data[detail_key].splice(this.data[detail_key].indexOf(detail_data), 1);
            }
        };

    }]);

})();
(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDEditDetailController', ["$scope", "Restangular", "$http", "$stateParams", "$timeout", "headers", "$rootScope", "$modalInstance", "$q", "ngToast", "Upload", function ($scope, Restangular, $http, $stateParams, $timeout, headers, $rootScope, $modalInstance, $q, ngToast, Upload) {

        $scope.data = {};
        $scope.headers = headers;
        $scope.resource = Restangular.all(headers.route);
        $scope.autocompleteModels = {};
        $scope.doafterAutoCompleteSelect = {};
        $scope.$http = $http;

        if(headers.modal_id){
            $rootScope.$emit('open:'+headers.modal_id+'', $scope);
        }

        $scope.datepickers = {};
        $scope.datepickerToggle = function (name) {
            if ($scope.datepickers[name] == undefined) {
                $scope.datepickers[name] = false;
            }
            $scope.datepickers[name] = !$scope.datepickers[name];
        }

        for (var y in $scope.headers.fields) {
            var field = $scope.headers.fields[y];
            if (field.type == 'boolean') {
                $scope.data[field.name] = false;
            }
        }

        if (headers.id) {
            $scope.resource.customGET(headers.id).then(function (data) {
                for (var y in $scope.headers.fields) {
                    var field = $scope.headers.fields[y];
                    if (field.type == 'date' && (data[field.name] != undefined && data[field.name] != null)) {
                        data[field.name] = new Date(data[field.name]);
                    }
                    
                    if (field.customOptions && field.customOptions.list!=undefined) {
                        field.customOptions.list.forEach(function(item){
                            if (item.id==data[field.name]){
                                data[field.name+'.label'] = item.label;
                            }
                        });
                    }

                    if (field.type == 'password'){
                        field.notnull = false;
                    }

                }
                $scope.data = data;
                
                $timeout(function(){
                    $scope.$broadcast('setProgressFile');
                });

                $scope.$emit('data-loaded-detail');
            });
        }else{
            $timeout(function(){
                $scope.$emit('data-new-detail'); 
            },50);

            for (var y in $scope.headers.fields) {
                var field = $scope.headers.fields[y];
                if (field.type == 'boolean') {
                    $scope.data[field.name] = field.customOptions.default ? field.customOptions.default : false;
                }
            }
        }

        $timeout(function () {
            
            $scope.submit = function () {

                var $_scope = this;
                var err = {};
                var _data = $_scope.data;

                _.each($_scope.headers.fields, function (field, key) {
                    if (field.type == 'password' && field.name.indexOf('confirm') != 0) {
                        if (_data['confirm_' + field.name] != _data[field.name]) {
                            err.password = 'Os campos "' + field.label + '" e "Confirmar ' + field.label + '" não são iguais';
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

                    function nextBefore(){
                        if (!$scope.data.id) {
                            var response = $scope.resource.customPOST($scope.data, $stateParams.id);
                            var typeSave = "new";
                        } else {
                            var response = $scope.resource.customPUT($scope.data, $scope.data.id);
                            var typeSave = "edit";
                        }

                        response.then(function (resp) {

                            function nextAfter(){
                                $rootScope.$broadcast('refreshGRID');
                                $modalInstance.dismiss('success');
                            }

                            $scope.$emit('after save', nextAfter, resp, typeSave);
                            if (!$scope.$$listeners["after save"]){
                                nextAfter();
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
                                        'custom.email':'Este email não é válido'
                                    }
    
                                    // debugger;
                                    _.each(codes, function (code, key) {
                                        var _name = findLabel(key);
    
                                        if(typeof code === 'string'){
                                            code = [code];
                                        }
                                        
                                        _.each(code, function (type_err, key) {
                                            var _message = friendlyErrors[type_err].replace('%s', _name);                                
                                            messages.push(_message);
                                        })
    
                                    })
                                }
    
                            }
                            
                            ngToast.warning(messages.join("<br />"));
    
                            $scope.$emit('error save', error);
    
                        });
                    }

                    $scope.$emit('before save', nextBefore);
                    if (!$scope.$$listeners["before save"]){
                        nextBefore();
                    }
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('success');
            };

            $scope._upload = function (field, file) {
                var _url = $rootScope.appSettings.API_URL;

                if(field.customOptions.file.url != undefined && field.customOptions.file.container == undefined){
                    _url += field.customOptions.file.url;
                }else 
                    if (field.customOptions.file.url == undefined && field.customOptions.file.container != undefined) {
                    _url += 'upload/' + field.customOptions.file.container + '/upload'
                }else 
                    if (field.customOptions.file.url != undefined && field.customOptions.file.container != undefined) {
                    _url += 'upload/' + field.customOptions.file.container + '/' + field.customOptions.file.url
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

                $scope._download(url, field, $scope.data);
            }

            $scope.downloadDetail = function (detail, field, id, data) {
                if (field.customOptions.file.container != undefined) {
                    var url = $rootScope.appSettings.API_URL + 'upload/' + field.customOptions.file.container + '/download/' + data[field.name];
                } else {
                    var url = $rootScope.appSettings.API_URL + $scope.module + '/details/' + detail + '/download/' + field.name + '/' + id;
                }

                $scope._download(url, field, data);
            }

            $scope._download = function (url, field, scopeData) {
                this.$http({
                    method: 'GET',
                    url: url,
                    responseType: 'arraybuffer'
                }).success(function (data, status, headers) {
                    headers = headers();
                    if (field.customOptions.file.container != undefined) {
                        var filename = scopeData[field.name];
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
                } catch (ex) {
                    // console.log(ex);
                }
            }

            $scope._autocomplete = function (field, val, detail) {
                var queries = [];

                var deferred = $q.defer();

                if (field.autocomplete_dependencies.length > 0) {
                    var deps = field.autocomplete_dependencies;
                    for (var x in deps) {
                        var dep = deps[x];

                        if ($scope.data[dep.field] == undefined || $scope.data[dep.field] == null) {

                            var text = 'Selecione o ' + dep.label;

                            var data = [];
                            data.push({ id: null, label: text });

                            deferred.resolve(data);

                            return deferred.promise;
                        } else {

                            if ($scope.data[dep.field].id) {
                                queries[dep.field] = $scope.data[dep.field].id;
                            } else {
                                queries[dep.field] = $scope.data[dep.field];
                            }

                        }
                    }
                }

                val = val.trim();
                if (val.length == 0 || field.customOptions.select == true) {
                    val = '[blank]';
                }

                if (field.customOptions.list == undefined) {

                    var route = 'autocomplete/' + field.name + '/' + val;

                    if (field.customOptions.select == true){
                        queries["limit"] = 0;
                    }else{
                        queries["limit"] = 20;
                    }

                    $scope.resource.customGET(route, queries).then(function (data) {

                        if (field.customOptions.select == true) {
                            data.unshift({ id: null, label: '--- Selecione ---' });
                        }

                        if (field.quickAdd === true && val != '[blank]') {
                            data.push({ id: null, label: 'Adicionar novo: ' + val });
                        }

                        deferred.resolve(data);

                    }, function errorCallback() {
                        return deferred.reject();
                    });

                } else {

                    var options = angular.copy(field.customOptions.list) || [];

                    if (field.customOptions.select == true) {
                        options.unshift({ id: null, label: '--- Selecione ---' });
                    }

                    deferred.resolve(options);

                }

                return deferred.promise;
            }

            $scope._autocompleteSelect = function ($item, $model, $label, detail) {
                if ($item.id != null && typeof $item.id != 'integer' || (typeof $item.id == 'integer' && $item.id > 0)) {
                    this.data[this.field.name] = $item.id;
                }
                else if ($item.id == null) {
                    this.data[this.field.name] = this.data[this.field.name + '.label'] = null;
                }
                else {
                    this.data[this.field.name + '.label'] = null;
                    return false;
                }

                if (typeof $scope.doafterAutoCompleteSelect[this.field.name] == "function") {
                    $scope.doafterAutoCompleteSelect[this.field.name].call(this, this.data, $item, $model, $label);
                }

                var field = this.field;
                $timeout(function(){
                    jQuery('#'+field.name).trigger('keyup');
                });
            }

            $scope.autocomplete = function (field, val) {
                return this._autocomplete(field, val, null);
            }

            $scope.autocompleteDetail = function (detail, field, val) {
                return this._autocomplete(field, val, detail);
            }

            $scope.autocompleteSelect = function (detail, $item, $model, $label) {
                this._autocompleteSelect($item, $model, $label, null);
            };
    
            $scope.autocompleteDetailSelect = function (detail, $item, $model, $label) {
                this._autocompleteSelect($item, $model, $label, detail);
            }

        }, 500); 

    }]);

})();