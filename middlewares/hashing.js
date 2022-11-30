const {Md5} = require("ts-md5");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

HashPasswordMD5 = (req,res,next) =>{
    if(req.body.password){
        const pword = req.body.password;
        const hash = Md5.hashAsciiStr(pword);
        req.md5hash = hash;
        next();
    }else{
        return res.status(200).send({message:"Password not provided in request body"});
    }
}

HashPasswordBCrypt = (req,res,next) => {
    if(req.body.password){
        const pword = req.body.password;
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err,salt){
            if(err){
                console.log("Something wrong with bcrypt password hashing");
                return res.status(500).send({message:"Something went wrong with bcrypt password hashing"});
            }
            bcrypt.hash(pword,salt,function(err,hash){
                req.bcryptHash = hash;
                next();
            })
        });
    }else{
        return res.status(200).send({message:"Password not provided in request body"});
    }
}

HashPasswordSHA256 = (req,res,next) =>{
    if(req.body.password){
        if(req.body.secret){
            const pword = req.body.password;
            const secret = req.body.secret;
            const hash = crypto.createHmac("sha256",secret).update(pword).digest("hex");
            req.sha256Hash = hash;
            next();
        }else{
            return res.status(200).send({message:"Secret for SHA256 hashing not provided in request body"});
        }
    }else{
        return res.status(200).send({message:"Password not provided in request body"});
    }
}

const hash = {
    HashPasswordMD5,
    HashPasswordBCrypt,
    HashPasswordSHA256
};

module.exports = hash;

