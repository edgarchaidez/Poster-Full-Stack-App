import React from 'react';

import classes from './LoadingSpinner.module.css';

const LoadingSpinner = props => {

  let styles = "loading-spinner__overlay";
  if(props.color) styles = "loading-spinner__overlay-color";
  return (
    <div className={props.asOverlay && classes[styles]}>
      <div className={classes["lds-dual-ring"]}></div>
    </div>
  );
};

export default LoadingSpinner;
