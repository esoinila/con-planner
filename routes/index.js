var express = require('express');
var router = express.Router();

// GET home page.
router.get("/", function (req, res) {
  //res.redirect("/catalog");
  res.redirect("/con");
});


module.exports = router;
