const request = require('request');
var express = require('express');
var router = express.Router();

router.get('/testStorePreferences', function(req,res,next) {
  
  
  res.json({
    message:res
  })
});

module.exports = router;