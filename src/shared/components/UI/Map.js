import React, { useRef, useEffect } from 'react';

import classes from './Map.module.css';

const Map = (props) => {
    const mapRef = useRef();

    const { center, zoom } = props;
    useEffect(() => {
        const map = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom
        });
    
        new window.google.maps.Marker({
          position: center,
          zoom: zoom,
        });
    }, [center, zoom])
   
    return <div ref={mapRef} className={`${classes.map} ${props.className}`} style={props.style}></div>
};

export default Map;