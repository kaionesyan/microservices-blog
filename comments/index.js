const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios').default;

const app = express();
app.use(cors());
app.use(express.json());

const comments = [];

app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;

  res.json(comments.filter((comment) => comment.postId === id));
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const postId = req.params.id;

  const comment = {
    id: commentId,
    postId,
    content,
    status: 'pending',
  };

  comments.push(comment);

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: comment,
  });

  res.status(201).json(comment);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const comment = comments.find((comment) => comment.id === data.id);
    comment.status = data.status;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: comment,
    });
  }

  res.status(204).send();
});

app.listen(4001, () => {
  console.log('Listening on port 4001');
});
