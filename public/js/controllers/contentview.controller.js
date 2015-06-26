angular.module('scenario5App').controller('contentCtrl', ['$scope', '$http', 'S5Service', function($scope, $http, S5Service){

	this.question_new_title = '';
	this.Xcolor = '#D2D2D2';
	this.Scolor = '#d2d2d2';
	this.newFormName = '';
	this.counter = 0;

	this.add_question = function(){
		$scope.formArr.push({"title":"click to edit", "edit": false, 'options': []});
		S5Service.pushToUndo({'command': 'add_question'});
	};

	this.delete_question = function(question){
		var index = $scope.formArr.indexOf(question);
		$scope.formArr.splice(index, 1); 
		S5Service.pushToUndo({'command': 'delete_question', 'question': question, 'index': index});
		this.Xcolor = '#d2d2d2';
		this.question_new_title = '';s
	};

	this.setEdit = function(question,bool,index) {
		if(!bool && question.edit) {
			question.edit = bool;
			if (this.question_new_title != '') {
				S5Service.pushToUndo({'command': 'setEdit', 'index': index, 'prevTitle': question.title, 'newTitle': this.question_new_title});
				question.title = this.question_new_title;
				this.question_new_title = '';
				this.counter--;
			}
		} else if(bool && this.counter < 1) {
			question.edit = bool;
			if(question.title != "click to edit") {
				this.question_new_title = question.title;
				this.counter++;
			}
		}
	};

	this.saveForm = function() {
		$http.put('/forms/' + $scope.id, {form: $scope.formArr});
		var headers = [];
		for(var i = 0; i < $scope.formArr.length; i++) {
			headers.push($scope.formArr[i].title);
		}
		$http.put('/header/' + $scope.id, {'headers': headers});
		$http.get('/data/' + $scope.id).
		success(function(data) {
			for (var i = 0; i < data.length; i++) {
				var questionArr = [];
				var newDataArr = [];
				for(var j = 0; j < data[i].data.length; j++) {
					questionArr.push(data[i].data[j].question);
				}
				for(var k = 0; k < headers.length; k++) {			
					var index = questionArr.indexOf(headers[k]);
					if(index != -1) {
						newDataArr.push(data[i].data[index]);
					} else {
						newDataArr.push({'question': headers[k], 'ans' : null});
					}
				}
				$http.put('/data/' + data[i]._id, {'data': newDataArr});
			}
		});
	};

	this.makeNew = function() {
		$http.post('/forms', { name : this.newFormName, form: $scope.formArr }).success(function(data) {
			$scope.formsList.push(data);
		}).error(function() {
			alert('Form ' + $scope.name + ' already exists');
		});
		this.newFormName = '';
		$scope.setPage(1);
	}

	this.goBack = function() {
		S5Service.clearStacks();
		$scope.setPage(1)
	}

	this.addOptions = function(question, index) {
		question.options.push('Option #' + (question.options.length + 1));
		S5Service.pushToUndo({'command': 'addOptions', 'index': index});
	};

	this.setOption = function(op_index, option, question, q_index) {
		var oldOp = question.options[op_index];
		question.options.splice(op_index, 1, option);
		S5Service.pushToUndo({'command': 'setOption', 'op_index': op_index, 'q_index': q_index, 'oldOp': oldOp, 'newOp': option});
	};

	this.delOptions = function(question, index) {
		var option = question.options[question.options.length-1];
		S5Service.pushToUndo({'command': 'delOptions', 'index': index, 'option': option});
		question.options.splice(question.options.length - 1, 1);
	};

	$scope.dragStart = function(e, ui) {
		ui.item.data('start', ui.item.index());
	};

	$scope.dragEnd = function(e, ui) {
		var start = ui.item.data('start'),
			end = ui.item.index();
	  
		$scope.formArr.splice(end, 0, 
		$scope.formArr.splice(start, 1)[0]);
	  
		$scope.$apply();

		S5Service.pushToUndo({'command': 'drag', 'prevIndex': start, 'newIndex': end});
	};

	sortableEle = $('#sortable').sortable({
		start: $scope.dragStart,
		update: $scope.dragEnd
  });

	this.undo = function() {
	var command = S5Service.popUndo();
	if(command.command == 'add_question') {
		$scope.formArr.splice($scope.formArr.length-1, 1); 
	} else if(command.command == 'delete_question') {
		$scope.formArr.splice(command.index, 0, command.question); 
	} else if(command.command == 'setEdit') {
		var question = $scope.formArr[command.index];
		question.title = command.prevTitle;
	} else if(command.command == 'addOptions') {
		var question = $scope.formArr[command.index];
		question.options.splice(question.options.length-1, 1); 
	} else if(command.command == 'delOptions') {
		var question = $scope.formArr[command.index];
		question.options.push(command.option);
	} else if (command.command == 'setOption') {
		var question = $scope.formArr[command.q_index];
		question.options.splice(command.op_index, 1, command.oldOp)
	} else if (command.command == 'drag') {
		$scope.formArr.splice(command.pre, 0, $scope.formArr.splice(command.newIndex, 1)[0]);
	  $scope.$apply();
	}
  }

	this.redo = function() {
	var command = S5Service.popRedo();
	if(command.command == 'add_question') {
		$scope.formArr.push({"title":"click to edit", "edit": false, 'options': []});
	} else if(command.command == 'delete_question') {
		$scope.formArr.splice(command.index, 1); 
	} else if(command.command == 'setEdit') {
		var question = $scope.formArr[command.index];
		question.title = command.newTitle;
	} else if(command.command == 'addOptions') {
		var question = $scope.formArr[command.index];
		question.options.push('Option #' + (question.options.length + 1));
	} else if(command.command == 'delOptions') {
		var question = $scope.formArr[command.index];
		var option = question.options[question.options.length-1];
		question.options.splice(question.options.length - 1, 1);
	} else if (command.command == 'setOption') {
		var question = $scope.formArr[command.q_index];
		  question.options.splice(op_index, 1, command.newOp);
		question.options.splice(command.op_index, 1, command.oldOp)
	} else if (command.command == 'drag') {
		$scope.formArr.splice(command.newIndex, 0, $scope.formArr.splice(command.prevIndex, 1)[0]);
		$scope.$apply();
	}
  };
}]);
