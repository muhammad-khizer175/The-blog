const JWT = require("jsonwebtoken");
const secret = "Galaxy$20";

const convertUserToToken = (user) => {
  return JWT.sign(user, secret);
};

const convertTokenToUser = (token) => {
  return JWT.verify(token, secret);

};

module.exports = {
    convertUserToToken,
    convertTokenToUser,

}
