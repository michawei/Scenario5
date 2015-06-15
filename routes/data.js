var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Forms = require('../models/Data.js');

/* GET forms listing. */
router.get('/', function(req, res, next) {
  Forms.find(function (err, data) {
    if (err) return next(err);
    res.json(data);
  });  
});

/* POST /data */
router.post('/', function(req, res, next) {
  Forms.create(req.body, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* GET /data/fromId 某個id的服務 */
router.get('/:id', function(req, res, next) {
	Forms.find({ 'formId': req.params.id }, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* PUT /data/:id */
router.put('/:id', function(req, res, next) {
  Forms.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* DELETE /data/:id */
router.delete('/:id', function(req, res, next) {
  Forms.findByIdAndRemove(req.params.id, req.body, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

//add another delete method 

module.exports = router;

