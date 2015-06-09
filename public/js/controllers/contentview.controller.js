angular.module('scenario5App').controller('contentCtrl', ['$scope', '$http', function($scope, $http){
	
	$scope.form_questions = [{"title":"What's your name?", "edit": false}, {"title":"What do you want?", "edit": false}];
	//$http.get("http://localhost:3000/forms")
	$scope.add_question = function(){
		$scope.form_questions.push({"title":"enter your question", "edit": false});
		//console.log(this.form_questions.length);
	};

	$scope.delete_question = function(question){
		var index = $scope.form_questions.indexOf(question);
  		$scope.form_questions.splice(index, 1);   
	};
}]);

angular.module('scenario5App').directive("contentView", function(){
	return{
		restrict: 'AE',
		templateUrl: "/js/components/formcontent.html",
	};
});