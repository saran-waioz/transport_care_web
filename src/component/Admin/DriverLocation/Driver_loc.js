import React, { Component, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Api from 'twilio/lib/rest/Api';
import DriverList from './Driverlist';
 
const AnyReactComponent = ({ text }) => <div>{text}</div>;
 
class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  render() {
    return (
      <div className="d-flex"> 
        <div>
        <DriverList/>
        </div>
      <div style={{ height: '90vh', width: '75%' ,margin:"0px 0px 0px 100px"}} >
        <GoogleMapReact
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
      </div>
    );
  }
}

export default SimpleMap;