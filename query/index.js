const express = require('express');
const axios = require('axios').default;
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const posts = [];

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    posts.push({ ...data, comments: [] });
  }

  if (type === 'CommentCreated') {
    const post = posts.find((post) => post.id === data.postId);
    if (!post)
      return res.status(404).json({
        error: 'post not found',
      });

    post.comments.push(data);
  }

  if (type === 'CommentModerated') {
    const post = posts.find((post) => post.id === data.postId);
    const index = post.comments.findIndex((comment) => comment.id === data.id);
    post.comments[index] = data;
  }
};

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.status(204).send();
});

app.listen(4002, async () => {
  console.log('Listening on port 4002');

  const response = await axios
    .get('http://events-srv:4005/events')
    .catch(() => {});

  for (let event of response.data) {
    handleEvent(event.type, event.data);
  }
});
