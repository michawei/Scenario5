angular.module('scenario5App').controller('DataTableController', ['$scope', '$http', 'S5Service', '$window', function($scope, $http, S5Service, $window) {

	this.new_data = '';
	this.dataArr = [];

	this.compute = false;
	this.computing_input = '';

	this.removeData = function(data_id, index) {
		$http.delete('/data/' + data_id);
		$scope.dataArr.splice(index, 1); 
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

	this.setEdit = function(data, bool, index) {
		if(!bool) {
			data.edit = bool;
			if (this.new_data != '') {
				S5Service.pushToUndo({'command': 'setEdit', 'index': index, 'prevData': data.ans, 'newData': this.new_data});
			  data.ans = this.new_data;
			  this.new_data = '';
		  }
		} else if (this.compute && !isNaN(data.ans)) {
			var element = angular.element(this.computing_input);
			element.val(element.val() + data.ans);
			element.focus();
		} else {
			data.edit = bool;
		}
	};

	this.addRemark = function(){
		$scope.formArr.push({"title": "Type title", "edit":false, "options":[], "type":"remark"})
		$scope.tableArr.push('Type title')
		for (var i=0; i < $scope.dataArr.length; i++){
			$scope.dataArr[i].data.push({"question": "Type title", "type": "remark", "ans": "", "options": [], "edit": false})
		}
	};

	this.saveData = function(){
		
		$http.put('/forms/' + $scope.form_id, {form: $scope.formArr});
		
		$http.put('/header/' + $scope.form_id, {'headers': $scope.tableArr});
		
		for (var i = 0; i < $scope.dataArr.length; i++){
			$http.put('/data/' + $scope.dataArr[i]._id, {'data': $scope.dataArr[i].data});
		}
	};

	this.setSelect = function(d_index, q_index, question) {
		var id = '#Question' + d_index + '-' + q_index;
		console.log(id);
		question.ans = angular.element(id).val();
		console.log(question);
	};

	this.listenForCalc = function(d_index, q_index, question) {
		var id = '#Question' + d_index + '-' + q_index;
		this.computing_input = id;
		console.log(event.which);
		if(event.which == 61) {
			this.compute = true;
			console.log('computing')
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
		  	console.log(numArr);
		  }
		  return numArr[numArr.length - 1];
		}
	}

}]);