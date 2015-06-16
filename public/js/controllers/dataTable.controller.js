angular.module('scenario5App').controller('DataTableController', ['$scope', '$http', 'S5Service', function($scope, $http, S5Service) {

	this.new_data = '';
	this.dataArr = [];

	this.removeData = function(data_id, index) {
		$http.delete('/data/' + data_id);
		$scope.dataArr.splice(index, 1); 
	};

	this.goBack = function() {
		$scope.setPage(4);
		$scope.tableArr = [];
		$scope.formArr = [];
		$scope.dataArr = [];
	};

	this.setTitle = function(form, bool, index){
		form.edit = bool;
		if(form.title != ''){
			$scope.tableArr[index] = form.title;
			if(!bool) {
				if (this.new_data != '') {
					//S5Service.pushToUndo({'command': 'setEdit', 'index': index, 'prevTitle': data.question, 'newTitle': this.new_data});
				  //form.question = this.new_data;
				  //this.new_data = '';
			  	}
			}			
		}
		else{
			form.title = $scope.tableArr[index];
		}

	}

	this.setEdit = function(data, bool, index) {
		data.edit = bool;
		if(!bool) {
			if (this.new_data != '') {
				//S5Service.pushToUndo({'command': 'setEdit', 'index': index, 'prevTitle': data.question, 'newTitle': this.new_data});
			  //data.ans = this.new_data;
			  //this.new_data = '';
		  }
		}
	};

	this.addRemark = function(){
		//$scope.formArr.push();
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

}]);