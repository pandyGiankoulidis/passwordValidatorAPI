const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const hash = require("./hashing");
const editDistances = require("./editDistance");

const middlewares = {
  authJwt,
  verifySignUp,
  hash,
  editDistances
}


module.exports = middlewares;