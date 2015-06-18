angular.module('scenario5App').controller('DataTableController', ['$scope', '$http', 'S5Service', '$window', function($scope, $http, S5Service, $window) {

	this.new_data = '';
	this.dataArr = [];
	this.removed = [];

	this.compute = false;
	this.computing_input = '';

	this.removeData = function(data_id, index) { 
		this.removed.push(data_id);
		var data = $scope.dataArr.splice(index, 1);
		S5Service.pushToUndo({'command': 'removeData', 'data': data, 'index': index});
	};

	this.goBack = function() {
		$scope.setPage(4);
	};

	this.setTitle = function(form, bool, index){
		form.edit = bool;
		if(form.title != ''){
			if(!bool) {
				for(var i = 0; i < $scope.dataArr.length; i++) {
					$scope.dataArr[i].data[index].question = form.title;
				}
				S5Service.pushToUndo({'command': 'setTitle', 'form': form, 'index': index, 'prevTitle': $scope.tableArr[index], 'newTitle': form.title});
			}
			$scope.tableArr[index] = form.title;		
		}
		else{
			form.title = $scope.tableArr[index];
		}

	}

	this.setEdit = function(data, bool) {
		if(!bool) {
			data.edit = bool;
			if (this.new_data != '') {
				S5Service.pushToUndo({'command': 'setEdit', 'data': data, 'prevData': data.ans, 'newData': this.new_data});
			  data.ans = this.new_data;
			  this.new_data = '';
		  }
		} else if (this.compute && !isNaN(data.ans)) {
			var element = angular.element(this.computing_input);
			element.val(element.val() + data.ans);
			element.focus();
		} else {
			data.edit = bool;
			this.new_data = data.ans;
		}
	};

	this.addRemark = function(){
		$scope.formArr.push({"title": "Type title", "edit":false, "options":[], "type":"remark"})
		$scope.tableArr.push('Type title')
		for (var i=0; i < $scope.dataArr.length; i++){
			$scope.dataArr[i].data.push({"question": "Type title", "type": "remark", "ans": "", "options": [], "edit": false})
		}
		S5Service.pushToUndo({'command': 'addRemark'});
	};

	this.delete_col = function(index, colTitle){ 
		var colArr = [];
		$scope.tableArr.splice(index, 1);
		for(var i = 0; i < $scope.dataArr.length; i++) {
			colArr.push($scope.dataArr[i].data.splice(index, 1));
		}
		console.log(colArr);
  	S5Service.pushToUndo({'command': 'delete_col', 'colArr': colArr, 'index': index, 'colTitle': colTitle});
	};

	this.saveData = function(){
		
		$http.put('/forms/' + $scope.form_id, {form: $scope.formArr});
		
		$http.put('/header/' + $scope.form_id, {'headers': $scope.tableArr});
		
		for (var i = 0; i < $scope.dataArr.length; i++){
			$http.put('/data/' + $scope.dataArr[i]._id, {'data': $scope.dataArr[i].data});
		}

		for (var j = 0; j < this.removed.length; j++) {
			$http.delete('/data/' + this.removed[j]);
		}
	};

	this.setSelect = function(d_index, q_index, question) {
		var id = '#Question' + d_index + '-' + q_index;
		var data = angular.element(id).val()
		S5Service.pushToUndo({'command': 'setSelect', 'id': id, 'prevData': question.ans, 'newData' : data, 'question': question});
		question.ans = data;
	};

	this.listenForCalc = function(d_index, q_index, question) {
		var id = '#Question' + d_index + '-' + q_index;
		this.computing_input = id;
		if(event.which == 61) {
			this.compute = true;
		}else if (this.compute && event.which == 13) {
			var numStr = $(id).val();
			var numArr = [];
			numStr = numStr.replace( /\s/g, "");
			var ans = this.computeNum(numStr.slice(1), '+', '-');
			angular.element(id).val(ans);
			question.ans = ans;
			this.compute = false;
		}

		this.computeNum = function(numStr, sep1, sep2) {
			var numArr = [];
			var start = 0;
			var retNum = 0
		  for(var i = 0; i < numStr.length; i++) {
		  	if(numStr[i] == sep1 || numStr[i] == sep2) {
		  		numArr.push(numStr.slice(start,i));
		  		numArr.push(numStr[i]);
		  		start = i + 1;
		  	} 
		  }
		  numArr.push(numStr.slice(start));

		  for(var j = 0; j < numArr.length; j++) {
		  	if(numArr[j].length > 1) {
		  	  if(!Number(numArr[j])) {
		  	    numArr[j] = this.computeNum(numArr[j], '*', '/');
		  	  }
		  	} 
		  }
		  for(var k = 0; k < numArr.length; k++) {
		  	if(numArr[k] == '*') {
		  		numArr[k+1] = Number(numArr[k-1]) * Number(numArr[k+1]);
		  		k++;
		  	} else if(numArr[k] == '/') {
		  		numArr[k+1] = Number(numArr[k-1]) / Number(numArr[k+1]);
		  		k++;
		  	} else if(numArr[k] == '+') {
		  		numArr[k+1] = Number(numArr[k-1]) + Number(numArr[k+1]);
		  		k++;
		  	} else if(numArr[k] == '-') {
		  		numArr[k+1] = Number(numArr[k-1]) - Number(numArr[k+1]);
		  		k++;
		  	}
		  }
		  return numArr[numArr.length - 1];	
		}
	}

	this.undo = function() {
		var action = S5Service.popUndo();
		if (action.command == 'removeData') {
			$scope.dataArr.splice(action.index, 0, action.data[0]);
			this.removed.splice(this.removed.length-1, 1);
		} else if (action.command == 'setTitle') {
			for(var i = 0; i < $scope.dataArr.length; i++) {
					$scope.dataArr[i].data[action.index].question = action.prevTitle;
			}
			$scope.tableArr[action.index] = action.prevTitle;
		} else if (action.command == 'setEdit') {
			action.data.ans = action.prevData;
		} else if (action.command == 'addRemark') {
			$scope.formArr.splice($scope.formArr.length-1, 1);
		  $scope.tableArr.splice($scope.tableArr.length-1, 1);
		  for (var i=0; i < $scope.dataArr.length; i++){
			  $scope.dataArr[i].data.splice($scope.dataArr[i].data.length-1, 1);
		  }
		} else if (action.command == 'setSelect') {
			angular.element(action.id).val(action.prevData);
			action.question.ans = action.prevData;
		} else if (action.command == 'delete_col') {
			$scope.tableArr.splice(action.index, 0, action.colTitle);
		  for(var i = 0; i < $scope.dataArr.length; i++) {
				$scope.dataArr[i].data.splice(action.index, 0, action.colArr[i][0]);
			}
		}
	}

	this.redo = function() {
		var action = S5Service.popRedo();
		if (action.command == 'removeData') {
			$scope.dataArr.splice(action.index, 1);
			this.removed.push(action.data);
		} else if (action.command == 'setTitle') {
			for(var i = 0; i < $scope.dataArr.length; i++) {
					$scope.dataArr[i].data[action.index].question = action.newTitle;
			}
			$scope.tableArr[action.index] = action.prevTitle;
		} else if (action.command == 'setEdit') {
			action.data.ans = action.newData;
		} else if (action.command == 'addRemark') {
			$scope.formArr.push({"title": "Type title", "edit":false, "options":[], "type":"remark"})
			$scope.tableArr.push('Type title')
			for (var i=0; i < $scope.dataArr.length; i++){
				$scope.dataArr[i].data.push({"question": "Type title", "type": "remark", "ans": "", "options": [], "edit": false})
			}
		} else if (action.command == 'setSelect') {
			angular.element(action.id).val(action.newData);
			action.question.ans = action.newData;
		} else if (action.command == 'delete_col') {
			$scope.tableArr.splice(action.index, 1);
		  for(var i = 0; i < $scope.dataArr.length; i++) {
				$scope.dataArr[i].data.splice(action.index, 1);
			}
		}
	}

}]);