const endPoints = require("../endpoints.json")
const getEndPoints = (request, res, next) => {
  res.status(200).send(endPoints);
};
module.exports = getEndPoints;



