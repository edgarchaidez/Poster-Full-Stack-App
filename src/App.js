import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

//import Users from "./users/pages/Users";
//import NewPost from "./posts/pages/NewPost";
import Navigation from "./shared/components/Navigation/Navigation";
//import UserPosts from "./posts/pages/UserPosts";
//import UpdatePost from "./posts/pages/UpdatePost";
//import Auth from "./users/pages/Auth";
//import Account from './users/pages/Account';

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import Spinner from './shared/components/UI/LoadingSpinner';

const Users = React.lazy(() => import("./users/pages/Users"));
const NewPost = React.lazy(() => import("./posts/pages/NewPost"));
const UserPosts = React.lazy(() => import("./posts/pages/UserPosts"));
const UpdatePost = React.lazy(() => import("./posts/pages/UpdatePost"));
const Auth = React.lazy(() => import("./users/pages/Auth"));
const Account = React.lazy(() => import("./users/pages/Account"));

const App = () => {
  const {
    login,
    logout,
    token,
    userId,
    email,
    name,
    profilePicture,
  } = useAuth();
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/account" exact>
          <Account/>
        </Route>
        <Route path="/:userId/posts" exact>
          <UserPosts />
        </Route>
        <Route path="/posts/new" exact>
          <NewPost />
        </Route>
        <Route path="/posts/:postId">
          <UpdatePost />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/posts" exact>
          <UserPosts />
        </Route>
        <Route path="/login">
          <Auth />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
        email: email,
        name: name,
        profilePicture: profilePicture,
      }}
    >
      <Router>
        <Navigation />
        <Suspense fallback={<div className="center"><Spinner /></div>}><main>{routes}</main></Suspense>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
