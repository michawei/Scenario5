angular.module('scenario5App').controller('ListViewController', function($scope, $http) {
	this.edit = false;
	this.del = false;

  $scope.forms = [];
  $scope.name = '';

	$http.get('/forms').
	  success(function(data) {
	  	$scope.forms = data;
	  }).
	  error(function() {
		alert("cannot get forms from db");
	  });

	$scope.showList = true

	$scope.setShowList = function(bool) {
		$scope.showList = bool;
		if(bool) {
			$http.get('/forms').
			  success(function(data) {
			  	this.forms = data;
			  }).
			  error(function() {
			  	alert("cannot get forms from db");
			  });
		}
	}

	this.useForm = function(name, category, formArr) {
		if(this.edit) {
			alert('edit: '+ name);
			this.edit = false;
		} else if(this.del) {
		  //do nothing
		} else {
		  alert('use: ' + name);
	  }
	}

	this.editForm = function() {
		this.edit = true;
	}

	this.delAlert = function(name) {
		this.del = true;
		$scope.name = name;
	}

	this.delForm = function(bool, name) {
		if(bool) {
			alert($scope.name + ' deleted');
		}
		this.del = false;
		$scope.name = '';
	}

});