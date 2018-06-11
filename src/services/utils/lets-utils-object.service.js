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
