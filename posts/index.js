const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios').default;

const app = express();
app.use(cors());
app.use(express.json());

const posts = [];

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  const post = {
    id,
    title,
  };

  posts.push(post);

  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: post,
  });

  res.status(201).json(post);
});

app.post('/events', (req, res) => {
  res.status(204).send();
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
