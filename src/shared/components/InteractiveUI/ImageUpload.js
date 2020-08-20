import React, { useRef, useState, useEffect } from 'react';

import classes from './ImageUpload.module.css';
import Button from './Button';

const ImageUpload = (props) => {

    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();

    const fileChooser = useRef();

    useEffect(() => {
        if (!file) {
          return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const chosenHandler = (event) => {
        let chosenFile;
        if (event.target.files && event.target.files.length === 1) {
            chosenFile = event.target.files[0];
            setFile(chosenFile);
        }
        props.onInput(props.id, chosenFile, true);
    }

    const choosePictureHandler = () => {
        fileChooser.current.click();
    };

    const cancelPictureHandler = () => {
      setPreviewUrl(null);
      setFile(null);
      props.onCancel();
    }

    let classStyle = classes["image-upload__preview"];
    if(props.creatingPost) {
      classStyle += " " + classes["image-upload__preview-create"];
    }

    return (
      <div className={classes["form-control"]}>
        <input
          ref={fileChooser}
          onChange={chosenHandler}
          id={props.id}
          type="file"
          style={{ display: "none" }}
          accept=".jpg, .png, .jpeg"
        />
        <div className={`${props.center && classes["center"]}`}>
          <div className={classStyle}>
            {previewUrl && <img src={previewUrl} alt="Preview" />}
            {!previewUrl && !props.creatingPost && (
              <img
                src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                alt="Preview"
              />
            )}
          </div>
          <div className={classes["image-upload__buttons"]}>
            {props.creatingPost && (
              <Button type="button" danger size="small" onClick={cancelPictureHandler}>
                Cancel
              </Button>
            )}
            <Button type="button" size="small" onClick={choosePictureHandler}>
              Choose Picture
            </Button>
          </div>
        </div>
      </div>
    );
};

export default ImageUpload;