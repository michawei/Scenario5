angular.module('scenario5App').controller('contentCtrl', ['$scope', '$http', function($scope, $http){

	this.question_new_title = '';
	this.Xcolor = '#D2D2D2';
	this.Scolor = '#d2d2d2';

	$scope.add_question = function(){
		$scope.formArr.push({"title":"click to edit", "edit": false, 'options': []});
	};

	$scope.delete_question = function(question){
		var index = $scope.formArr.indexOf(question);
  	$scope.formArr.splice(index, 1); 
  	this.Xcolor = '#d2d2d2';  
  	this.question_new_title = '';
	};

	this.setEdit = function(question,bool) {
		question.edit = bool;
		if(!bool) {
			if (this.question_new_title != '') {
			  question.title = this.question_new_title;
			  this.question_new_title = '';
		  }
		} else {
			if(question.title != "click to edit") {
			  this.question_new_title = question.title;
		  }
		}
	};

	this.saveForm = function() {
		$http.put('/forms/' + $scope.id, {form: $scope.formArr});
	};

	this.addOptions = function(question) {
		question.options.push('Option #' + (question.options.length + 1));
	};

	this.setOption = function(index, option, question) {
		question.options.splice(index, 1, option);
	};

	this.delOptions = function(question) {
		question.options.splice(question.options.length - 1, 1);
	};

  $scope.dragStart = function(e, ui) {
      ui.item.data('start', ui.item.index());
  }
  $scope.dragEnd = function(e, ui) {
      var start = ui.item.data('start'),
          end = ui.item.index();
      
      $scope.formArr.splice(end, 0, 
          $scope.formArr.splice(start, 1)[0]);
      
      $scope.$apply();
  }

	sortableEle = $('#sortable').sortable({
        start: $scope.dragStart,
        update: $scope.dragEnd
    });

}]);

angular.module('scenario5App').directive("contentView", function(){
	return{
		restrict: 'AE',
		templateUrl: "/js/components/formcontent.html",
	};
});