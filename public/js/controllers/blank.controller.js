angular.module('scenario5App').controller('BlankController', ['$scope', '$http', function($scope, $http) {
	
  this.dataArr = [];

	this.submitForm = function() {
		this.dataArr = [];
		for(var i = 0; i < $scope.formArr.length; i++) {
			var title = $scope.formArr[i].title;
			var type = $scope.formArr[i].type;
			var options = $scope.formArr[i].options;
			var id = '#Question' + i;
			if($scope.formArr[i].type == 'checkbox') {
				var checkVal = [];
				$( 'input:checkbox[id^="Question' + i + '"]:checked' ).each( function() {
					checkVal.push($(this).attr("value"));
				});
				this.dataArr.push( { 'question' : title, 'type': type, 'ans' : checkVal, 'options' : options, 'edit': false });
			} else {
			  this.dataArr.push({ 'question' : title, 'type': type, 'ans' : $(id).val(), 'options' : options, 'edit': false });
			}
		}
		$http.post('/data', { 
			'formName' : $scope.name,
			'formCategory' : $scope.category,
			'formId' : $scope.id,
			'data' : this.dataArr 
		});
	}
}]);