import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const response = await axios.get('http://localhost:4002/posts');

    setPosts(response.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {posts.map((post) => {
        return (
          <div
            className="card"
            style={{ width: '30%', marginBottom: '20px' }}
            key={post.id}
          >
            <div className="card-body">
              <h3>{post.title}</h3>
              <CommentList comments={post.comments} />
              <CommentCreate postId={post.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;