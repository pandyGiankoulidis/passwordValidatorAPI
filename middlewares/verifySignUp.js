const db = require("../models");
const jsonParser = require("body-parser").json();
const User = db.user;

checkRequiredFieldsAndDuplicateUsername = (req, res, next) => {
    if(!req.body.username || !req.body.password){
        res.status(200).send({ message: "Username and password are required fields"});
        return;
    }

  // Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {

        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }
        next();
    });
};

const verifySignUp = {
    checkRequiredFieldsAndDuplicateUsername
};
module.exports = verifySignUp;