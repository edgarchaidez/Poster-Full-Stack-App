import React, { useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';

import PostsList from '../components/PostsList';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Spinner from '../../shared/components/UI/LoadingSpinner';

const UserPosts = (props) => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [userPosts, setUserPosts] = useState();

    const userId = useParams().userId;

    useEffect( () => {
        const getUserPosts = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/posts/user/${userId}`);
                setUserPosts(responseData.userPosts);
            }
            catch(error) {
            }
        };
        getUserPosts();
    },[sendRequest, userId]);
   
    const deletePostHandler = (postToDeleteId) => {
        setUserPosts(previousUserPosts => 
            previousUserPosts.filter(post => post.id !== postToDeleteId)
        );
    };

    let userName;
    if(props.location && props.location.state) {
      const { name } = props.location.state;
      userName=name;
    }

    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className="center">
            <Spinner />
          </div>
        )}
        {!isLoading && <PostsList name={userName} posts={userPosts} onPostDeleted={deletePostHandler}/>}
      </React.Fragment>
    );
};

export default withRouter(UserPosts);