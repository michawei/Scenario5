var mongoose = require('mongoose');

var FormsSchema = new mongoose.Schema({
	name: { type: String, unique: true },
	category: { type: String, default: 'All' },
	form: Array,
	date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Forms', FormsSchema);