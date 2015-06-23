angular.module('scenario5App').controller('ChartCtrl', ['$scope', '$http', 'S5Service', function($scope, $http, S5Service){

	this.maxY;
	this.maxX;
	this.minY;
	this.minX;

	this.type == undefined;

	this.settings = false;

	this.charts = [
	  {'type' : 'Line Graph', 'x': undefined, 'y': 'x-axis', 'z': 'y-axis' },
	  {'type' : 'Bar Chart', 'x': 'label', 'y': 'value', 'z': undefined},
	  {'type' : 'Pie Chart', 'x': 'key', 'y': 'value', 'z': undefined},
	  {'type' : 'Scattered Plot', 'x': 'label', 'y': 'x-axis', 'z': 'y-axis'},
	];

	this.generateChart = function(type, x_index, y_index, z_index) {
		if(this.type == 0) {
			this.generateLineGraph(y_index, z_index, false);
		} else if(this.type == 1) {
			this.generateBarChart(x_index, y_index);
		} else if(this.type == 2) {
			this.generatePieChart(x_index, y_index);
		} else if (this.type == 3) {
			this.generateScatteredPlot(y_index, z_index, x_index);
		}
	};

	this.showSettings = function(bool, chart) {
		if(bool) {
			this.minY = chart.forceY[0];
			this.maxY = chart.forceY[1];
			this.minX = chart.forceX[0];
			this.maxX = chart.forceX[1];
		} else {
			this.generateLineGraph(y_index, z_index, true);
		}
		this.settings = bool;
	}

	this.generateLineGraph = function(x_index, y_index, update) {
		$scope.graphData = generateData();
		$scope.options = {
	    chart: {
	        type: 'lineChart',
	        height: 450,
	        margin : {
	            top: 20,
	            right: 40,
	            bottom: 60,
	            left: 80
	        },
	        x: function(d){ return d.x; },
	        y: function(d){ return d.y; },
	        useInteractiveGuideline: true,
	        xAxis: {
	            axisLabel: $scope.tableArr[x_index],
	        },
	        yAxis: {
	            axisLabel: $scope.tableArr[y_index],
	        },
	        forceY: [0, getMaxY()],
	        forceX: [0, getMaxX()]
		    }
		};

		//$scope.graphData = generateData();

		/*Random Data Generator */
		function generateData() {
			  this.maxY = 0;
			  this.maxX = 0;
			  var graphDataArr = [];
		    for(var i = 0; i < $scope.dataArr.length; i++) {
			  	var data = $scope.dataArr[i].data;
			  	graphDataArr.push({'x': data[x_index].ans, 'y': data[y_index].ans});
			  	if(!update) {
			  	  this.maxY = Math.max(this.maxY, data[y_index].ans);
			  	  this.maxX = Math.max(this.maxX, data[x_index].ans);
			    }
			  }

			  console.log(graphDataArr);

			  return [{
		  		values: graphDataArr, 
		  		key: 'test graph',
		  		color: '#ff7f0e'
			  }];
		};

		function getMaxY() {
	  	console.log(this.maxY);
	  	return this.maxY;
	  }

	  function getMaxX() {
	  	console.log(this.maxX);
	  	return this.maxX;
	  }
  };

  this.generateBarChart = function(lab_index, val_index) {
  	$scope.graphData = generateData();
		$scope.options = {
	    chart: {
	        type: 'discreteBarChart',
	        height: 450,
	        margin : {
	            top: 20,
	            right: 40,
	            bottom: 60,
	            left: 80
	        },
	        x: function(d){ return d.label; },
	        y: function(d){ return d.value; },
	        showValues: true,
	        valueFormat: function(d){
              return d3.format(',.4f')(d);
          },
          transitionDuration: 500,
          xAxis: {
              axisLabel: $scope.tableArr[lab_index]
          },
          yAxis: {
              axisLabel: $scope.tableArr[val_index]
          },
	        forceY: [0, getMaxY()]
		    }
		};

		function generateData() {
			  this.maxY = 0;
			  var graphDataArr = [];
		    for(var i = 0; i < $scope.dataArr.length; i++) {
			  	var data = $scope.dataArr[i].data;
			  	graphDataArr.push({'label': data[lab_index].ans, 'value': data[val_index].ans});
			  	this.maxY = Math.max(this.maxY, data[lab_index].ans);
			  }

			  console.log(graphDataArr);

			  return [{
		  		values: graphDataArr, 
		  		key: "Cumulative Return",
			  }];
		};

		function getMaxY() {
	  	console.log(this.maxY);
	  	return this.maxY;
	  }
  };

  this.generatePieChart = function(x_index, y_index) {
  	$scope.options = {
      chart: {
          type: 'pieChart',
          height: 450,
          x: function(d){return d.key;},
          y: function(d){return d.y;},
          showLabels: true,
          transitionDuration: 500,
          labelThreshold: 0.01,
          legend: {
            margin: {
							top: 5,
              right: 35,
              bottom: 5,
              left: 0
            }
          }
      }
    };

    $scope.graphData = generateData();

		function generateData() {
			  var graphDataArr = [];
		    for(var i = 0; i < $scope.dataArr.length; i++) {
			  	var data = $scope.dataArr[i].data;
			  	graphDataArr.push({'key': data[x_index].ans, 'y': data[y_index].ans});
			  }

			  return graphDataArr;
		};
  };

  this.generateScatteredPlot = function(x_index, y_index, gr_index) {
    $scope.graphData = generateData();
		$scope.options = {
        chart: {
            type: 'scatterChart',
            height: 450,
            color: d3.scale.category10().range(),
            margin : {
	            top: 20,
	            right: 40,
	            bottom: 60,
	            left: 80
	          },
            scatter: {
                onlyCircles: false
            },
            showDistX: true,
            showDistY: true,
            tooltipContent: function(key) {
                return '<h3>' + key + '</h3>';
            },
            transitionDuration: 350,
            xAxis: {
                axisLabel: $scope.tableArr[x_index],
                tickFormat: function(d){
                    return d3.format('.02f')(d);
                }
            },
            yAxis: {
                axisLabel: $scope.tableArr[y_index],
                tickFormat: function(d){
                    return d3.format('.02f')(d);
                },
                axisLabelDistance: 30
            },
            forceY: [0, getMaxY()],
	          forceX: [0, getMaxX()]
        }
    };

    function generateData() {
        var shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];

        this.maxY = 0;
			  this.maxX = 0;
			  var graphDataArr = [];

			  for(var i = 0; i < $scope.dataArr.length; i++) {
			  	var data = $scope.dataArr[i].data;
			  	graphDataArr.push({ 'key': data[gr_index].ans, 
			  		'values':[{ 
			  			'x': data[x_index].ans, 
			  			'y': data[y_index].ans, 
			  			size: Math.random(), 
			  			shape: shapes[i % 6] }] 
			  	});
			  	this.maxY = Math.max(this.maxY, data[y_index].ans);
			  	this.maxX = Math.max(this.maxX, data[x_index].ans);
			  }

			  return graphDataArr
    };

		function getMaxY() {
	  	return this.maxY;
	  };

	  function getMaxX() {
	  	return this.maxX;
	  };
  };

}]);