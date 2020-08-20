import React, { useContext, useEffect, useState } from 'react';

import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from '../../util/validators';
import { AuthContext } from '../../shared/context/auth-context';
import Card from '../../shared/components/UI/Card';
import Input from '../../shared/components/InteractiveUI/Input';
import Button from '../../shared/components/InteractiveUI/Button';
import Spinner from '../../shared/components/UI/LoadingSpinner';
import classes from './Account.module.css';

const Account = () => {

    const[editState, setEditState] = useState(false);
    const[message, setMessage] = useState();
    const { isLoading, error, sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);

    const [formState, inputHandler, setFormData] = useForm({
        name: {
            value: '',
            isValid: false
        },
        email: {
            value: '',
            isValid: false
        },
    }, false);

    useEffect(() => {
        setFormData({
            name: {
                value: auth.name
            },
            email: {
                value: auth.email,
            }
            }, true);
    }, [setFormData, auth.name, auth.email]);

    const editSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/users/`, 'PATCH', JSON.stringify({
                name: formState.inputs.name.value,
                email: formState.inputs.email.value,
            }), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            });
            auth.name = responseData.user.name;
            auth.email = responseData.user.email;
            localStorage.setItem(
              "userData",
              JSON.stringify({
                userId: auth.userId,
                token: auth.token,
                expirationTime: new Date(new Date().getTime() + 1000 * 60 * 60).toISOString(),
                name: auth.name,
                email: auth.email,
                image: auth.profilePicture,
              })
            );
            setEditState(false);
            setMessage(<p>Account information updated.</p>)
        }
        catch(error) {
     
        }
    };

    const changeMadeHandler = () => {
        setEditState(true);
    };

    return (
      <React.Fragment>
        <Card className={classes.account}>
          {isLoading && <Spinner asOverlay />}
          <h2>Account Information</h2>
          <hr/>
          <form onSubmit={editSubmitHandler}>
            <Input
              id="name"
              element="input"
              type="text"
              placeholder="Name"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Name field cannot be empty."
              initialValue={auth.name}
              initialValid
              onInput={inputHandler}
              changeMade={changeMadeHandler}
            />
            <Input
              id="email"
              element="input"
              type="email"
              placeholder="E-Mail"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email"
              initialValue={auth.email}
              initialValid
              onInput={inputHandler}
              changeMade={changeMadeHandler}
            />
            {message && !error && message}
            {error && <p style={{color: "red"}}>{error}</p>}
            <Button type="submit" disabled={!editState}>
              Confirm Edits
            </Button>
          </form>
        </Card>
        <div className={classes["account-button"]}>
          <Button danger onClick={auth.logout}>
            Logout
          </Button>
        </div>
      </React.Fragment>
    );
};

export default Account;