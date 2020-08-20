import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

import Input from '../../shared/components/InteractiveUI/Input';
import Button from '../../shared/components/InteractiveUI/Button';
import classes from './PostForm.module.css';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Spinner from '../../shared/components/UI/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';


const UpdatePost = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPost, setLoadedPost] = useState();
    const history = useHistory();
    const auth = useContext(AuthContext);

    const [formState, inputHandler, setFormData] = useForm({
            title: {
                value: ''
            },
            description: {
                value: ''
            },
            address: {
                value: ''
            }
    }, true);

    const postId = useParams().postId;
    //const postToUpdate = DUMMY_POSTS.find((post) => post.id === postId);

    useEffect( () => {
        const getPost = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`);
                setLoadedPost(responseData.post);
                setFormData({
                    title: {
                        value: responseData.post.title,
                    },
                    description: {
                        value: responseData.post.description,
                    },
                    address: {
                        value: responseData.post.address,
                    },
                    }, true);
            }
            catch(error) {
            }
        };
        getPost();
    },[sendRequest, postId, setFormData]);

    const editSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`, 'PATCH', JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value,
                address: formState.inputs.address.value
            }), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            });

            history.push('/' + auth.userId + '/posts');
        }
        catch(error) {
        
        }
    };

    if(isLoading) {
        return (
            <div className="center">
                <Spinner />
            </div>
        )
    }

    if(!loadedPost && !error) {
        return (
            <div>
                <h2>Could not find post</h2>
            </div>
        )
    }

    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && loadedPost && (
          <form className={classes["post-form"]} onSubmit={editSubmitHandler}>
            <Input
              id="title"
              element="input"
              type="text"
              placeholder="Title"
              onInput={inputHandler}
              initialValue={loadedPost.title}
              initialValid={true}
              validators={[]}
            />
            <Input
              id="description"
              element="textarea"
              type="text"
              placeholder="Description"
              onInput={inputHandler}
              initialValue={loadedPost.description}
              initialValid={true}
              validators={[]}
            />
            <Input
              id="address"
              element="input"
              type="text"
              placeholder="Location"
              onInput={inputHandler}
              initialValue={loadedPost.address}
              initialValid={true}
              validators={[]}
            />
            <Button type="submit">Edit Post</Button>
          </form>
        )}
      </React.Fragment>
    );
};

export default UpdatePost;