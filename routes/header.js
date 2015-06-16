var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Headers = require('../models/Headers.js');

/* GET header listing. */
router.get('/', function(req, res, next) {
  Headers.find(function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  });  
});

/* POST /header */
router.post('/', function(req, res, next) {
  Headers.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /header/:id 某個id的服務 */
router.get('/:id', function(req, res, next) {
  Headers.find({ 'formId': req.params.id }, function (err, data) {
    if (err) return next(err);
    console.log(data[0].headers);
    res.json(data[0].headers);
  });
});

/* PUT /header/:id */
router.put('/:id', function(req, res, next) {
  Headers.findOneAndUpdate({ 'formId': req.params.id }, req.body, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* DELETE /header/:id */
router.delete('/:id', function(req, res, next) {
  Headers.findOneAndRemove({ 'formId': req.params.id }, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

module.exports = router;
