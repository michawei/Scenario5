var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Forms = require('../models/Forms.js');
var Data = require('../models/Data.js');

/* GET forms listing. */
router.get('/', function(req, res, next) {
  Forms.find(function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  });  
});

/* POST /forms */
router.post('/', function(req, res, next) {
  Forms.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /forms/:id 某個id的服務 */
router.get('/:id', function(req, res, next) {
  Forms.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /forms/:id */
router.put('/:id', function(req, res, next) {
  Forms.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /forms/:id */
router.delete('/:id', function(req, res, next) {
  Forms.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
