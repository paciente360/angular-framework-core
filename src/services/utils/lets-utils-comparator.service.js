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
  