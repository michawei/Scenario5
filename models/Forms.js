var mongoose = require('mongoose');

var FormsSchema = new mongoose.Schema({
	name: String,
	completed: Boolean,
	note: String,
	updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Forms', FormsSchema);