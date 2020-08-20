import React, { useState } from "react";
import { Link } from 'react-router-dom';

import classes from './Navigation.module.css';
import Header from './Header';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UI/Backdrop';

const Navigation = (props) => {

    const [showDrawer, setShowDrawer] = useState(false);

    const openDrawer = () => {
        setShowDrawer(true);
    };

    const closeDrawer = () => { 
        setShowDrawer(false);
    };

    return (
      <React.Fragment>
        {showDrawer && <Backdrop onClick={closeDrawer} />}
        <SideDrawer show={showDrawer} onClick={closeDrawer}>
          <nav className={classes["drawer-nav"]}>
            <NavLinks mobile/>
          </nav>
        </SideDrawer>
        <Header>
          <button className={classes.btn} onClick={openDrawer}>
            <span />
            <span />
            <span />
          </button>
          <h1 className={classes.title}>
            <Link to="/">Poster</Link>
          </h1>
          <nav className={classes["nav"]}>
            <NavLinks />
          </nav>
        </Header>
      </React.Fragment>
    );
};

export default Navigation;