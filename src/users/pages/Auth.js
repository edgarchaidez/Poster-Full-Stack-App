import React, { useState, useContext } from "react";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import classes from "./Auth.module.css";
import Input from "../../shared/components/InteractiveUI/Input";
import Button from "../../shared/components/InteractiveUI/Button";
import Card from "../../shared/components/UI/Card";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import Spinner from "../../shared/components/UI/LoadingSpinner";
import ImageUpload from "../../shared/components/InteractiveUI/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);

  const [loginMode, setLoginMode] = useState(true);
  const[switched, setSwitched] = useState(true);
  const { isLoading, error, sendRequest } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const loginSubmitHandler = async (event) => {
    event.preventDefault();
    setSwitched(true);
    if (loginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(
          responseData.userId,
          responseData.token,
          null,
          responseData.email,
          responseData.name,
          responseData.image
        );
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/api/users/signup",
          "POST",
          formData
        );

        auth.login(
          responseData.userId,
          responseData.token,
          null,
          responseData.email,
          responseData.name,
          responseData.image
        );
      } catch (error) {}
    }
  };

  const switchModeHandler = () => {
    setSwitched(false);
    if (!loginMode) {
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: true,
          },
        },
        false
      );
    }
    setLoginMode((prevMode) => !prevMode);
  };

  return (
    <React.Fragment>
      <Card className={classes.authentication}>
        {isLoading && <Spinner asOverlay />}
        <h2>{loginMode ? "Login" : "Sign-up"}</h2>
        <hr />
        <form onSubmit={loginSubmitHandler}>
          {!loginMode && (
            <ImageUpload id="image" center onInput={inputHandler} />
          )}
          {!loginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              placeholder="Enter Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name"
              onInput={inputHandler}
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            placeholder="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            placeholder="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Password must be at least 6 characters long"
            onInput={inputHandler}
          />
          {error && switched && <p style={{ color: "red" }}>{error}</p>}
          <Button type="submit" disabled={!formState.isValid}>
            {loginMode ? "Login" : "Sign-up"}
          </Button>
        </form>
        <Button inverse size="small" onClick={switchModeHandler}>
          {loginMode ? "Go to Sign-up" : "Go to Login"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
