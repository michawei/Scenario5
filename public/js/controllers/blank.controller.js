angular.module('scenario5App').controller('BlankController', function($scope, $http) {
	
	//addEventListener('load', load, false);
  this.dataArr = [];

	this.submitForm = function() {
		for(var i = 0; i < $scope.formArr.length; i++) {
			var title = $scope.formArr[i].title;
			var id = '#' + title;
			if($scope.formArr[i].type == 'checkbox') {
				var checkVal = [];
				$( 'input:checkbox[id^="' + title + '"]:checked' ).each( function() {
					checkVal.push($(this).attr("value"));
				});
				this.dataArr.push( { 'question' : title, 'ans' : checkVal });
			} else {
			  this.dataArr.push({ 'question' : title, 'ans' : $(id).val() });
		  }
		}
		$http.post('/data', { 
			'formName' : $scope.name,
			'formCategory' : $scope.category,
			'formId' : $scope.id,
			'data' : this.dataArr 
		});
	}
});