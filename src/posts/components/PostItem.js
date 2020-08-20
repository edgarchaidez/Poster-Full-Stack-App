import React, { useState, useContext } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';

import classes from './PostItem.module.css';
import Button from '../../shared/components/InteractiveUI/Button';
import Modal from '../../shared/components/UI/Modal';
import Map from '../../shared/components/UI/Map';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Spinner from '../../shared/components/UI/LoadingSpinner';

const PostItem = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const auth = useContext(AuthContext);

    const showModalHandler = () => setShowModal(true);

    const closeModalHandler = () => setShowModal(false);

    const showDeleteModalHandler = () => setShowDeleteModal(true);

    const cancelDeleteModalHandler = () => setShowDeleteModal(false);

    const confirmDeleteHandler = async () => {
        setShowDeleteModal(false);
        try {
            const responseData = await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/api/posts/${props.id}`,
              "DELETE",
              null,
              {
                Authorization: "Bearer " + auth.token,
              }
            );
            props.onDelete(props.id);
        }
        catch(error) {
        }
    };

    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <Modal
          className={classes["map-container"]}
          show={showModal}
          onCancel={closeModalHandler}
          header={props.address}
          contentClass={classes["post_item__modal-content"]}
          footerClass={classes["post_item__modal-footer"]}
          footer={<Button onClick={closeModalHandler}>Close</Button>}
        >
          <div className={classes["map"]}>
            <Map center={props.coordinates} zoom={16} />
          </div>
        </Modal>
        <Modal
          className={classes["delete-post-container"]}
          header="Delete Post?"
          show={showDeleteModal}
          onCancel={cancelDeleteModalHandler}
          footer={
            <React.Fragment>
              <Button inverse onClick={cancelDeleteModalHandler}>
                Cancel
              </Button>
              <Button danger onClick={confirmDeleteHandler}>
                Delete
              </Button>
            </React.Fragment>
          }
          footerClass={classes["post-item__modal-actions"]}
        >
          <p>Deleting a post cannot be undone.</p>
        </Modal>

        <li className={classes["post-item"]}>
          <div className={classes["place-item__content"]}>
            {isLoading && (
              <div className="center">
                <Spinner asOverlay color />
              </div>
            )}
            <div className={classes["post-item__info"]}>
              {props.name && <h5>@{props.name}</h5>}
              {props.title && <h2>{props.title}</h2>}
              {props.description && <p>{props.description}</p>}
            </div>
            {props.image && (
              <div className={classes["post-item__image"]}>
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${props.image}`}
                  alt={props.title}
                />
              </div>
            )}
            {props.address && (
              <small style={{ color: "#ccc" }}>
                <footer style={{ padding: "0 0 1rem 1rem" }}>
                  {"at " + props.address}
                </footer>
              </small>
            )}
            <div className={classes["post-item__actions"]}>
              {props.address && (
                <Button inverse size="small" onClick={showModalHandler}>
                  View on Map
                </Button>
              )}
              {auth.userId === props.userId && (
                <Button size="small" to={`/posts/${props.id}`}>
                  Edit
                </Button>
              )}
              {auth.userId === props.userId && (
                <Button size="small" danger onClick={showDeleteModalHandler}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        </li>
      </React.Fragment>
    );
};

export default PostItem;