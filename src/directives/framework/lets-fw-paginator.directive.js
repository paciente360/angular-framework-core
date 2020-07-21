(function () {
    'use strict';

    angular.module('letsAngular').directive('fwPaginator', fwPaginator);

    fwPaginator.$inject = [];

    function fwPaginator() {
        return {
            templateUrl: 'lets/views/framework/paginator.html',
            replace: true,
            scope: {
                totalrecords:'=',
                pagesize:'=',
                currentpage:'=',
                totalpages:'=',
                gopage:'='
            },
            controller: function ($scope) { 

                $scope.itemsize = 9;
                
                $scope.go = function(page){
                    if (page!=$scope.currentpage && page>=1 && page<=$scope.totalpages){
                        $scope.gopage(page);
                        window.scrollTo({top: 100, behavior: 'smooth'});
                    }
                }

                $scope.getPages = function(){
                    var arrPages = [];
                    if($scope.currentpage){

                        var pgmin = Math.ceil($scope.itemsize/2);
                        if (($scope.currentpage-pgmin)<=0){
                            pgmin = 1;
                        }else{
                            pgmin = $scope.currentpage-pgmin;
                        }
                             
                        var pgmax = pgmin + $scope.itemsize;
                        pgmax = Math.min(pgmax,$scope.totalpages);
                        
                        if ( ($scope.totalpages>$scope.itemsize) && ((pgmax-pgmin)<$scope.pagesize) ){
                            pgmin = pgmax - $scope.itemsize;
                        }

                        for (var idx = pgmin; idx <= pgmax; idx++) {
                            arrPages.push(idx);                         
                        }
                    }
                    return arrPages;
                }
            },
            link: function ($scope, $el) {}
        }
    }
})();