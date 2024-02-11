import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default
});

export default class LeaftComponent extends Component {
    render() {
        return(
            <div className='WellcomeComponent'>
                <MapContainer center={[40.4186, -3.7037]}  style={{ height: '50vh', width: '50wh' }} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[40.33670764229927, -3.7702241441678535]}>
                    <Popup>
                    Electrosense Sensor: <br /> Rack 1.
                    </Popup>
                </Marker>


                <Marker position={[40.397150086472806, -3.7019798128985144]}></Marker>

                <Marker position={[40.44036077326801, -3.6894107586564564]}></Marker>
                <Marker position={[40.42057783417504, -3.6642070597642027]}></Marker>
                





                </MapContainer>


            </div>
            

    
        )
    }
}