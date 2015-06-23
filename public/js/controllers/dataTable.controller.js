angular.module('scenario5App').controller('DataTableController', ['$scope', '$http', 'S5Service', '$window', function($scope, $http, S5Service, $window) {

	this.new_data = '';
	this.dataArr = [];
	this.removed = [];

	this.compute = false;
	this.computing_input = '';

	this.calculating = false;
	this.calcIndex = -1;

	this.showEditView = false;

	this.editView = function() {
		if(this.showEditView) {
			this.showEditView = false;
		} else {
			this.showEditView = true;
		}
	}

	this.removeData = function(data_id, index) { 
		this.removed.push(data_id);
		var data = $scope.dataArr.splice(index, 1);
		S5Service.pushToUndo({'command': 'removeData', 'data': data, 'index': index});
	};

	this.goBack = function() {
		S5Service.clearStacks();
		$scope.setPage(4);
	};

	this.setTitle = function(form, bool, index){
		if(this.calculating) {
			for (var i=0; i < $scope.dataArr.length; i++){
			 var val = $scope.dataArr[i].data[this.calcIndex].ans;
			 $scope.dataArr[i].data[this.calcIndex].ans = val + 'col:' + index;
			 angular.element("#Question0-" + this.calcIndex).focus();
		  }
		} else {
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
	};

	this.setEdit = function(data, bool, index, d_index) {
		if(!bool) {
			data.edit = bool;
			if (this.new_data != '') {
				S5Service.pushToUndo({'command': 'setEdit', 'data': data, 'prevData': data.ans, 'newData': this.new_data});
			  data.ans = this.new_data;
			  this.new_data = '';
			  if(data.inFunc != undefined) {
			  	var func = $scope.dataArr[d_index].data[data.inFunc].func;
					var colReg = /col:(\d+)/;
					while (colReg.test(func)) {
						var index = colReg.exec(func)[1];
						func = func.replace(colReg, $scope.dataArr[d_index].data[index].ans);
					}
					var ans = this.computeNum(func.slice(1));
					$scope.dataArr[d_index].data[data.inFunc].ans = ans;
			  }
		  }
		} else if (this.compute && !isNaN(data.ans)) {
			var element = angular.element(this.computing_input);
			element.val(element.val() + data.ans);
			element.focus();
		} else if (this.calculating) {
			for (var i=0; i < $scope.dataArr.length; i++){
			  var val = $scope.dataArr[i].data[this.calcIndex].ans;
			  $scope.dataArr[i].data[this.calcIndex].ans = val + 'col:' + index;
			  angular.element("#Question0-" + this.calcIndex).focus();
		  }
		}else {
			data.edit = bool;
			this.new_data = data.ans;
		}
	};

	this.setFunc = function(index) {
		for (var i=0; i < $scope.dataArr.length; i++){
			$scope.dataArr[i].data[index].ans = '=';
		}
		angular.element("#Question0-" + index).focus();
		this.calculating = true;
		this.compute = false;
		this.calcIndex = index;
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
		$scope.formArr.splice(index, 1);
		for(var i = 0; i < $scope.dataArr.length; i++) {
			colArr.push($scope.dataArr[i].data.splice(index, 1));
		}
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
		if(question.inFunc != undefined) {
	  	var func = $scope.dataArr[d_index].data[question.inFunc].func;
			var colReg = /col:(\d+)/;
			while (colReg.test(func)) {
				var index = colReg.exec(func)[1];
				func = func.replace(colReg, $scope.dataArr[d_index].data[index].ans);
			}
			var ans = this.computeNum(func.slice(1));
			$scope.dataArr[d_index].data[question.inFunc].ans = ans;
		}
	};

	this.listenForCalc = function(d_index, q_index, question, event) {
		var id = '#Question' + d_index + '-' + q_index;
		this.computing_input = id;
		if(event.which == 61) {
			this.compute = true;
			this.calculating = false;
		} else if (this.compute && event.which == 13) {
			var numStr = $(id).val();
			var numArr = [];
			numStr = numStr.replace( /\s/g, "");
			var ans = this.computeNum(numStr.slice(1));
			angular.element(id).val(ans);
			question.ans = ans;
			this.compute = false;
		} else if (this.calculating) {
		  if (event.which == 13) {
		  	this.calculating = false;
				for (var i=0; i < $scope.dataArr.length; i++){
					var numStr = $scope.dataArr[i].data[this.calcIndex].ans;
					var numArr = [];
					numStr = numStr.replace( /\s/g, "");
					$scope.dataArr[i].data[this.calcIndex].func = numStr;
					var colReg = /col:(\d+)/;
					while (colReg.test(numStr)) {
						var index = colReg.exec(numStr)[1];
						//console.log(a);
						numStr = numStr.replace(colReg, $scope.dataArr[i].data[index].ans);
						$scope.dataArr[i].data[index].inFunc = this.calcIndex;
					}
					var ans = this.computeNum(numStr.slice(1));
					$scope.dataArr[i].data[this.calcIndex].ans = ans;
			  } 
			} else if (event.which == 8 || event.which == 46) {
		  	for (var i=1; i < $scope.dataArr.length; i++){
		  		console.log('deleted');
		  		var val = $scope.dataArr[i].data[this.calcIndex].ans;
		  		$scope.dataArr[i].data[this.calcIndex].ans = val.substring(0, val.length-1);
		    } 
		  } else {
		  	for (var i=1; i < $scope.dataArr.length; i++){
		  		var val = $scope.dataArr[i].data[this.calcIndex].ans;
					 $scope.dataArr[i].data[this.calcIndex].ans = val + String.fromCharCode(event.which);
			  } 
		  }
		}
	};

	this.computeNum = function(numStr) {
		var retVal;
		var pareg = /\(.+\)/;

		while (pareg.test(numStr)) {
			var ans = pareg.exec(numStr);
			ans[0] = ans[0].replace(/\(/g, "");
			ans[0] = ans[0].replace(/\)/g, "");
			numStr = numStr.replace(pareg, this.computeNum(ans[0])); 
		}

		var powReg = /([0-9]+)\^([0-9]+)/;
		while (powReg.test(numStr)) {
			var ans = powReg.exec(numStr);
			numStr = numStr.replace(powReg, Math.pow(Number(ans[1]), Number(ans[2])));
		}
		var muldivReg = /([0-9]+)(\*|\/)([0-9]+)/;
		while (muldivReg.test(numStr)) {
			var ans = muldivReg.exec(numStr);
			if (ans[2] == '*') {
				retVal = Number(ans[1]) * Number(ans[3]);
			} else if (ans[2] == '/') {
				retVal = Number(ans[1]) / Number(ans[3]);
			}
			numStr = numStr.replace(muldivReg, retVal);
		}

		var addsubReg = /([0-9]+)(\+|\-)([0-9]+)/;
		while (addsubReg.test(numStr)) {
			var ans = addsubReg.exec(numStr);
			if (ans[2] == '+') {
				retVal = Number(ans[1]) + Number(ans[3]);
			} else if (ans[2] == '-') {
				retVal = Number(ans[1]) - Number(ans[3]);
			}
			numStr = numStr.replace(addsubReg, retVal);
		}
		return numStr;
	};


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