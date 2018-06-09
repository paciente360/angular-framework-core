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
        .module('letsAngular.core')
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
  