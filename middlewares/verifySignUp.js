const db = require("../models");
const jsonParser = require("body-parser").json();
const User = db.user;

checkRequiredFieldsAndDuplicates = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        res.status(200).send({ message: "Username and password are required fields for the body of this request" });
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

        User.findOne({
            email: req.body.email
        }).exec((err, usr) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (usr) {
                res.status(400).send({ message: "Failed! Email is already in use by another user!" });
                return;
            }
            next();
        });
    });
};

const verifySignUp = {
    checkRequiredFieldsAndDuplicates
};
module.exports = verifySignUp;