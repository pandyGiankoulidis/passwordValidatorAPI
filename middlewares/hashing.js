const { Md5 } = require("ts-md5");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const url = require('url');


HashPasswordMD5 = (req, res, next) => {
    const queryObject = url.parse(req.url, true).query
    if (queryObject.password) {
        const pword = queryObject.password;
        const hash = Md5.hashAsciiStr(pword);
        req.md5hash = hash;
        next();
    } else {
        return res.status(200).send({ message: "Password not provided in request URL" });
    }
}

HashPasswordBCrypt = (req, res, next) => {
    const queryObject = url.parse(req.url, true).query
    if (queryObject.password) {
        const pword = queryObject.password;
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                console.log("Something wrong with bcrypt password hashing");
                return res.status(500).send({ message: "Something went wrong with bcrypt password hashing" });
            }
            bcrypt.hash(pword, salt, function (err, hash) {
                req.bcryptHash = hash;
                next();
            })
        });
    } else {
        return res.status(200).send({ message: "Password not provided in request URL" });
    }
}

HashPasswordSHA256 = (req, res, next) => {
    const queryObject = url.parse(req.url, true).query
    if (queryObject.password) {
        if (queryObject.secret) {
            const pword = queryObject.password;
            const secret = queryObject.secret;
            const hash = crypto.createHmac("sha256", secret).update(pword).digest("hex");
            req.sha256Hash = hash;
            next();

        } else {
            return res.status(200).send({ message: "Secret for SHA256 hashing not provided in request URL" });
        }
    } else {
        return res.status(200).send({ message: "Password not provided in request URL" });
    }
}

const hash = {
    HashPasswordMD5,
    HashPasswordBCrypt,
    HashPasswordSHA256
};

module.exports = hash;

