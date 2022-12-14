const passwordRouter = require('./password/password.controller');
const testRouter = require('./test/test.controller');
const authRouter = require('./auth/auth.controller');
const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const { hash } = require("../middlewares");
const { editDistances } = require("../middlewares");

module.exports = (app) => {

  app.use('/pwordRequirements', [authJwt.verifyToken], passwordRouter);
  app.use('/pwordValidation', [editDistances.treeEditDistance, editDistances.levenshteinEditDistance, hash.HashPasswordSHA256], passwordRouter);
  app.use('/test', testRouter);
  app.post('/auth/signup', [verifySignUp.checkRequiredFieldsAndDuplicates], authRouter.signup);
  app.post('/auth/signin', authRouter.signin);
}
