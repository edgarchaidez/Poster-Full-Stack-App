import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useHttpClient } from "../../../shared/hooks/http-hook";

import classes from "./UserItem.module.css";
import Avatar from "../../../shared/components/UI/Avatar";
import DefaultProfile from '../../../assets/default_profile.png';

const UserItem = (props) => {
  const [userPosts, setUserPosts] = useState();
  const { sendRequest } = useHttpClient();

  const { id } = props;
  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/posts/user/${id}`
        );
        if (responseData.userPosts && responseData.userPosts.length > 0) {
          setUserPosts(responseData.userPosts);
        }
      } catch (error) {}
    };
    getUserPosts();
  }, [sendRequest, id]);

  let image;
  if (props.profileImg === "")
    image = DefaultProfile;
  else image = `${process.env.REACT_APP_BACKEND_URL}/${props.profileImg}`;

  let post = <p>No posts</p>;
  if (userPosts) {
    post = (
      <React.Fragment>
        {userPosts[userPosts.length - 1].title && (
          <h4>{userPosts[userPosts.length - 1].title}</h4>
        )}
        {userPosts[userPosts.length - 1].description && (
          <p>{userPosts[userPosts.length - 1].description}</p>
        )}
        {userPosts[userPosts.length - 1].image && (
          <div>
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/${
                userPosts[userPosts.length - 1].image
              }`}
              alt={props.title || "image"}
            />
          </div>
        )}
        {userPosts[userPosts.length - 1].address && (
          <small style={{color: "#ccc"}}><footer>{'at ' + userPosts[userPosts.length - 1].address}</footer></small>
        )}
      </React.Fragment>
    );
  }

  return (
    <li className={classes["user-item"]}>
      <div className={classes["content"]}>
        <Link to={{ pathname: `${props.id}/posts`, state: { name: props.name } }}>
          <div className={classes["image"]}>
            <Avatar image={image} alt={props.name} />
          </div>
          <div className={classes["info"]}>
            <h2>{'@' + props.name}</h2>
            <div>{post}</div>
          </div>
        </Link>
      </div>
    </li>
  );
};

export default UserItem;
