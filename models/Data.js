var mongoose = require('mongoose');

var DataSchema = new mongoose.Schema({
	formName: String,
	formCategory: String,
	formId: String,
	data: Array,
	status: {type: String, default: 'updated' },
	date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Data', DataSchema);