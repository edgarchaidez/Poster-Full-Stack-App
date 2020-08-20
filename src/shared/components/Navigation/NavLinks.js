import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavLinks.module.css';
import { AuthContext } from '../../../shared/context/auth-context';
import Avatar from "../UI/Avatar";
import DefaultProfile from '../../../assets/default_profile.png';

const NavLinks = (props) => {
    const auth = useContext(AuthContext);

    let image = DefaultProfile;
    if(auth.profilePicture) image = process.env.REACT_APP_BACKEND_URL + "/" + auth.profilePicture;

    if(props.mobile) {
      return (
        <React.Fragment>
          {!auth.name && (
            <p style={{ marginLeft: "1rem" }}>Logged in as a Guest</p>
          )}
          <ul className={classes["nav-links"]}>
            {auth.isLoggedIn && (
              <li>
                <NavLink
                  activeClassName={classes.active}
                  to={`/${auth.userId}/account`}
                >
                  <div className={classes.avatar}>
                    <Avatar image={image} alt={props.name} />
                  </div>
                </NavLink>
                <p style={{ textDecorationLine: "none" }}>{"@" + auth.name}</p>
              </li>
            )}
            <li>
              <NavLink activeClassName={classes.active} to="/" exact>
                Home
              </NavLink>
            </li>
            {auth.isLoggedIn && (
              <li>
                <NavLink
                  activeClassName={classes.active}
                  to={{
                    pathname: `/${auth.userId}/posts`,
                    state: { name: auth.name },
                  }}
                >
                  My Posts
                </NavLink>
              </li>
            )}
            {auth.isLoggedIn && (
              <li>
                <NavLink activeClassName={classes.active} to="/posts/new">
                  Create Posts
                </NavLink>
              </li>
            )}
            {!auth.isLoggedIn && (
              <li>
                <NavLink activeClassName={classes.active} to="/login">
                  Login / Sign-Up
                </NavLink>
              </li>
            )}
            {auth.isLoggedIn && (
              <li>
                <button onClick={auth.logout}>Logout</button>
              </li>
            )}
          </ul>
        </React.Fragment>
      );
    }

    return (
      <ul className={classes["nav-links"]}>
        <li>
          <NavLink activeClassName={classes.active} to="/" exact>
            Home
          </NavLink>
        </li>
        {auth.isLoggedIn && (
          <li>
            <NavLink
              activeClassName={classes.active}
              to={{ pathname:`/${auth.userId}/posts`, state: { name: auth.name } }}
            >
              My Posts
            </NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink activeClassName={classes.active} to="/posts/new">
              Create Posts
            </NavLink>
          </li>
        )}
        {!auth.isLoggedIn && (
          <li>
            <NavLink activeClassName={classes.active} to="/login">
              Login / Sign-Up
            </NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink activeClassName={classes.active} to={`/${auth.userId}/account`}>
              <div className={classes.avatar}>
                <Avatar image={image} alt={props.name} />
              </div>
            </NavLink>
          </li>
        )}
      </ul>
    );
};

export default NavLinks;