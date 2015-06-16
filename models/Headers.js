var mongoose = require('mongoose');

var HeadersSchema = new mongoose.Schema({
	formId: { type: String },
	headers: Array,
});

module.exports = mongoose.model('Headers', HeadersSchema);