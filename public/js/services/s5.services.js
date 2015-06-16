angular.module('scenario5App').service('S5Service', function() {

  this.undoStack = [];
  this.redoStack = [];

  this.pushToUndo = function(command) {
    this.undoStack.push(command);
  };

  this.popUndo = function() {
  	if(this.undoStack.length > 0) {
	  	var command =  this.undoStack.pop();
	  	this.redoStack.push(command);
	  	return command;
    } else {
    	return {'command': 'none'};
    }
  };

  this.popRedo = function() {
  	if(this.redoStack.length > 0) {
  		var command = this.redoStack.pop();
  		this.undoStack.push(command);
  		return command;
  	} else {
  		return {'commnand': 'none'};
  	}
  };

  this.clearStacks = function() {
    this.undoStack = [];
    this.redoStack = [];
  };


	});