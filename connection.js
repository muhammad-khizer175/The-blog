const { connect } = require("mongoose");

let connectToMongoDb = (url) => {
  return connect(url);
};

module.exports = {
  connectToMongoDb,
};
