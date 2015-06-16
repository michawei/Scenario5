angular.module('scenario5App').controller('DataTableController', ['$scope', '$http', function($scope, $http) {


  this.removeData = function(data_id, index) {
  	$http.delete('/data/' + data_id);
  	$scope.dataArr.splice(index, 1); 
  }

  this.goBack = function() {
  	$scope.setPage(4);
  }

}]);