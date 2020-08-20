import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import classes from "./PostForm.module.css";
import Input from "../../shared/components/InteractiveUI/Input";
import Button from "../../shared/components/InteractiveUI/Button";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import Spinner from "../../shared/components/UI/LoadingSpinner";
import ImageUpload from "../../shared/components/InteractiveUI/ImageUpload";

const NewPost = (props) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const auth = useContext(AuthContext);

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
      },
      description: {
        value: "",
      },
      address: {
        value: "",
      },
      image: {
        value: null,
      },
    },
    true
  );

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();

  const postSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (error) {}
    history.push(`/${auth.userId}/posts`);
  };

  const showImageUploadHandler = () => {
    setShowImageUpload(true);
  };

  const hideImageUploadHandler = () => {
    setShowImageUpload(false);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div>
        <form className={classes["post-form"]} onSubmit={postSubmitHandler}>
          {isLoading && <Spinner asOverlay color />}
          <Input
            id="title"
            element="input"
            type="text"
            placeholder="Title"
            onInput={inputHandler}
            initialValid={true}
            validators={[]}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            placeholder="Description"
            onInput={inputHandler}
            initialValid={true}
            validators={[]}
          />
          <Input
            id="address"
            element="input"
            type="text"
            placeholder="Location"
            onInput={inputHandler}
            initialValid={true}
            validators={[]}
          />
          {showImageUpload && (
            <ImageUpload
              id="image"
              onInput={inputHandler}
              creatingPost
              center
              onCancel={hideImageUploadHandler}
            />
          )}
          <div className={classes["form-buttons"]}>
            {!showImageUpload && (
              <Button
                type="button"
                inverse
                size="small"
                onClick={showImageUploadHandler}
              >
                Add Image
              </Button>
            )}
            <Button type="submit">Create New Post</Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default NewPost;
