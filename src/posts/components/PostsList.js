import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import classes from "./PostsList.module.css";
import PostItem from './PostItem';
import Button from '../../shared/components/InteractiveUI/Button';
import { AuthContext } from '../../shared/context/auth-context';

const PostsList = (props) => {
    const auth = useContext(AuthContext);
    const userId = useParams().userId;
    if(!props.posts || props.posts.length === 0) {
        return (
          <div className={classes["error"]}>
            <h2>No posts found!</h2>
            {auth.userId === userId && (
              <Button to="/posts/new">Create New Post</Button>
            )}
          </div>
        );
    }

    return <ul className={classes["posts-list"]}>
        {props.posts.map((post) => (
            <PostItem
              key={post.id}
              id={post.id}
              image={post.image}
              title={post.title}
              description={post.description}
              address={post.address}
              userId={post.userId}
              coordinates={post.location}
              onDelete={props.onPostDeleted}
              name={props.name}
            />
        ))}
    </ul>;
};

export default PostsList;