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

    angular.module('letsAngular.core')
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
