import React from 'react';

import classes from './UsersList.module.css';
import UserItem from './UserItem/UserItem.js';

const UsersList = (props) => {
    if(props.users.length === 0) {
        return (
          <div className={classes["no-users"]}>
            <h2>No Users Found</h2>
          </div>
        )
    }
    else {
        return (
            <ul className={classes["users-list"]}>
                {props.users.map(user => (
                    <UserItem
                      key={user.id}
                      id={user.id}
                      profileImg={user.image}
                      name={user.name}
                      posts={user.posts}
                    />
                ))}
            </ul>
        );
    }
};

export default UsersList;