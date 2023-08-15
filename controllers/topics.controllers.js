const express = require('express');
const app = express();


const topicData = require('../db/data/development-data/topics');

const getTopics = app.get('/api/topics', (req, res) => {
  const topics = topicData;
  return res.status(200).send(topics);
});

module.exports = getTopics

