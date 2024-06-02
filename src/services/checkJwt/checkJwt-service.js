
var { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require('jwks-rsa');
require('dotenv').config()

if (
    !process.env.DOMAIN ||
    !process.env.AUDIENCE
  ) {
  
    console.log(
      "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
    );
  
    process.exit();
  }

  
exports.checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.DOMAIN}/.well-known/jwks.json`,
    }),
    audience: process.env.AUDIENCE,
    issuer: `https://${process.env.DOMAIN}/`,
    algorithms: ['RS256']
});