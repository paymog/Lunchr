var express = require('express');
var mongoose = require('mongoose');

var User = mongoose.model('User');
var router = express.Router();

/* GET home page. */
router.get('/users', function (req, res) {
    User.find({}, function (error, users) {
        res.json(users);
    })
});

router.post('/users', function (req, res, next) {
    var user = new User({email: req.body.email, password: req.body.password})

    user.save(function (error, user) {
        if (error) {
            return next(error)
        }
        res.json(user);
    });
});


module.exports = router;
