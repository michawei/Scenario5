angular.module('scenario5App').controller('BlankController', function($scope, $http) {
	
	//addEventListener('load', load, false);

	this.submitForm = function() {
		for(var i = 0; i < $scope.formArr.length; i++) {
			var title = $scope.formArr[i].title;
			var id = '#' + title;
			if($scope.formArr[i].type == 'checkbox') {
				
			} else {
			  alert($(id).val());
		  }
		}
	}


});