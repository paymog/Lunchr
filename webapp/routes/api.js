var express = require('express');
var mongoose = require('mongoose');

var User = mongoose.model('User');
var router = express.Router();

/* GET home page. */
router.get('/users', function (req, res, next) {
    if(req.query.email)
    {
        User.find({email: req.query.email},function (error, users) {
            if(error)
            {
                return next(error);
            }
            res.json(users);
        });
    }
    else
    {
        User.find({}, function (error, users) {
            res.json(users);
        });
    }
});

router.post('/users/register', function (req, res, next) {
    User.find({email: req.body.email}, function (error, users) {
        if (error) {
            return next(error)
        }
        if (users.length > 0) {
            return next(Error("Username already exists"));
        }

        // create and save the user
        var user = new User({
            email: req.body.email, password: req.body.password,
            firstname: req.body.firstname, lastname: req.body.lastname,
            age: req.body.age, radius: req.body.radius
        });

        user.save(function (error, user) {
            if (error) {
                return next(error)
            }
            user.password = null;
            res.json(user);
        });
    })
});

router.post('/users/authenticate', function (req, res, next) {
    User.findOne({email: req.body.email, password: req.body.password}, function (error, user) {
        if (error) {
            return next(error);
        }

        if (!user) {
            return next(new Error("User not found"));
        }
        user.password = null;
        res.json(user);
    })
});

module.exports = router;
