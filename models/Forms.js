var mongoose = require('mongoose');

var FormsSchema = new mongoose.Schema({
	name: { type: String, unique: true },
	category: String,
	form: Array,
	date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Forms', FormsSchema);