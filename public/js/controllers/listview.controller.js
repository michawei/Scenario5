angular.module('scenario5App').controller('ListViewController', function($scope, $http) {
	this.edit = false;
	this.del = false;
	this.newFormName = '';

	$scope.showList = true;

  $scope.formsList = [];
  $scope.name = '';
  $scope.id = '';
  $scope.formArr = [];

	$http.get('/forms').
	  success(function(data) {
	  	$scope.formsList = data;
	  }).
	  error(function() {
		alert("cannot get forms from db");
	  });

	$scope.setShowList = function(bool) {
		$scope.showList = bool;
		if(bool) {
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
			this.edit = false;
			$scope.setShowList(false);
		} else if(this.del) {
		  //do nothing
		} else {
		  alert('use: ' + name);
	  }
	}

	this.editForm = function() {
		this.edit = true;
	}

	this.delAlert = function(name, id) {
		this.del = true;
		$scope.name = name;
		$scope.id = id;
	}

	this.delForm = function(bool, name) {
		if(bool) {
			$http.delete('/forms/' + $scope.id);
			$http.get('/forms').success(function(data) {
			  $scope.formsList = data;
			});
			//$scope.apply();
		}
		this.del = false;
		$scope.name = '';
	}

	this.createForm = function() {
		$scope.name = this.newFormName;
		this.newFormName = '';
		$http.post('/forms', { name : $scope.name }).success(function(data) {
			$scope.formsList.push(data);
		}).error(function() {
			alert('Form ' + $scope.name + ' already exists');
			$scope.name = '';
		});
	}

});