(function () {
    'use strict';

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
