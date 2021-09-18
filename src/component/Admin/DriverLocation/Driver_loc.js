import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import DriverList from "./Driverlist";
import Apicall from "../../../Api/Api";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import {initiateSocket,testing,subscribeDriverLocation,disconnectSocket} from '../../../socketio'
const AnyReactComponent = ({ text }) => <div>{text}</div>;
const SimpleMap = (props) => {
  const history = useHistory();
  const { id } = useParams();
  const [user, setuser] = useState([]);
  const [center, set_center] = useState({
    lat: 59.955413,
    lng: 30.337844,
  });
  const [zoom, set_zoom] = useState(11);

  const getdata = async () => {
    await Apicall({ role: "2" }, "/user/get_users").then((res) => {
      console.log(res.data.data.docs);
    });
  };
  useEffect(() => {
    initiateSocket();
    subscribeDriverLocation((err,data)=>{
      console.log(data)
    })
    return () => {
      disconnectSocket();
    }
  }, []);

  const _onBoundsChange = (center, zoom, bounds, marginBounds) => {
    console.log(center, "center");
    console.log(zoom, "xomm");
    console.log(bounds, "bound");
    console.log(marginBounds, "margin bound");
  };

  return (
    <div>
      <div>
        <DriverList />
      </div>
      <div style={{ height: "100vh", width: "100%", marginTop: 5 }}>
        <GoogleMapReact
          defaultCenter={center}
          defaultZoom={zoom}
          onBoundsChange={_onBoundsChange}
        >
          <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default SimpleMap;
