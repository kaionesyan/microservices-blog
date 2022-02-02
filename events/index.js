const express = require('express');
const axios = require('axios').default;

const app = express();
app.use(express.json());

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post('http://posts-clusterip-srv:4000/events', event).catch(() => {});
  axios.post('http://localhost:4001/events', event).catch(() => {});
  axios.post('http://localhost:4002/events', event).catch(() => {});
  axios.post('http://localhost:4003/events', event).catch(() => {});

  res.status(204).send();
});

app.get('/events', (req, res) => {
  res.json(events);
});

app.listen(4005, () => {
  console.log('Listening on port 4005');
});
