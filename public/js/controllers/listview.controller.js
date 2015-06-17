angular.module('scenario5App').controller('ListViewController', ['$scope', '$http', function($scope, $http) {
	this.edit = false;
	this.del = false;
	this.newFormName = '';

	$scope.page = 1;

  $scope.formsList = [];
  $scope.name = '';
  $scope.id = '';
  $scope.formArr = [];
  $scope.index = -1;

  $scope.form_id = '';
  $scope.dataArr = [];
  $scope.tableArr = [];

	$http.get('/forms').
	  success(function(data) {
	  	$scope.formsList = data;
	  }).
	  error(function() {
		alert("cannot get forms from db");
	  });

	$scope.setPage = function(num) {
		$scope.page = num;
		if(num == 1) {
			$http.get('/forms').
			  success(function(data) {
			  	$scope.formsList = data;
			  }).
			  error(function() {
			  	alert("cannot get forms from db");
			  });
		}
	}

	this.useForm = function(name, category, formArr, id) {
		if(this.edit) {
			$scope.name = name;
		  $scope.category = category;
		  $scope.formArr = formArr;
		  $scope.id = id;
			$scope.setPage(2);
			this.edit = false;
		} else if(this.del) {
		  //do nothing
		  this.del = false;
		} else {
			$scope.name = name;
			$scope.category = category;
			$scope.formArr = formArr;
			$scope.id = id;
		  $scope.setPage(3);
	  }
	}

	this.editForm = function() {
		this.edit = true;
	}

	this.delAlert = function(name, id, index) {
		this.del = true;
		$scope.name = name;
		$scope.id = id;
		$scope.index = index;
	}

	this.delForm = function(bool) {
		if(bool) {
			$http.delete('/forms/' + $scope.id);
			$scope.formsList.splice($scope.index, 1);
			$http.get('/data/' + $scope.id).
			  success(function(data) {
			  	for (var i = 0; i < data.length; i++) {
			  		$http.delete('/data/' + data[i]._id);
			  	}
			  });
			$http.delete('/header/' + $scope.id);
		}
		this.del = false;
		$scope.name = '';
		$scope.id = '';
		$scope.index = '';
	}

	this.createForm = function() {
		$scope.name = this.newFormName;
		this.newFormName = '';
		$http.post('/forms', { name : $scope.name }).success(function(data) {
			$scope.formsList.push(data);
			$http.post('/header', { 'formId': data._id });
			$scope.name = data.name;
			$scope.category =  data.category;
			$scope.formArr =  data.form;
			$scope.id = data._id;
			$scope.setPage(2);
		}).error(function() {
			alert('Form ' + $scope.name + ' already exists');
			$scope.name = '';
		});
	}

	this.getData = function(form_id) {
  	$scope.form_id = form_id;
  	$scope.dataArr = [];
  	$scope.tableArr = [];
  	$scope.formArr = [];

  	$http.get('/forms/' + $scope.form_id)
  	.success(function(data) {
  		$scope.formArr = data.form;
  	});

  	$http.get('/data/' + $scope.form_id)
  	.success(function(data) {
  		if(data.length > 0) {
	  		$scope.dataArr = data;
	  	}
  	});
  	$http.get('/header/' + $scope.form_id).
  	  success(function(data) {
  	  	$scope.tableArr = data;
  	  	$scope.setPage(5);
  	  });
  }

	this.labelHover = function(id, color) {
		$(id).css('color', color);
	}


}]);