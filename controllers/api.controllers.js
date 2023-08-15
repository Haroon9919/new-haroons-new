const fetchEndPoints = require("../models/api.models");

const getEndPoints = (request, res, next) => {
  res.status(200).send(fetchEndPoints());
};
module.exports = getEndPoints;
