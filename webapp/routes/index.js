var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

// black magic
router.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

router.get('*', function(req, res){
  console.log("HITTING UNREGISTERED ROUTE");
  res.render('index');
});

module.exports = router;
