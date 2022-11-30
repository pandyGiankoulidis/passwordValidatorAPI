const request = require('request');
const config = require("../../config/auth.config");
var express = require('express');
var router = express.Router();
const db = require("../../models");
const User = db.user;
const sessions = require('express-session');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) =>{

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    length: req.body.length,
    upperCase: req.body.uppercase,
    specialCharacters: req.body.special,
    numbers: req.body.number,
    whiteSpacesTabs: req.body.spacestabs,
    incrementNumber: req.body.id,
    critical:req.body.critical
  });

  user.save((err,user)=>{
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Successfully stored preferences" });
  })
  
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .exec((err, user) => {
      
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(200).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(200).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      sessions.user = user;
      
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    });
};