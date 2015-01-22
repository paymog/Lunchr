//
// This route is to serve json
//

var express = require('express');
var database = require('../database')
var router = express.Router();

router.get('/', function(req, res) {

    var db_res = database.createUser(req.query.usr)
    res.send('res: ' + db_res);
});

module.exports = router;
