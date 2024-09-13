import React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import australianAirports from '../airportData';
import InfoPanel from './InfoPanel';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoidmpyb3NzaSIsImEiOiJjbHNjb2lzeTQwczJ3MmpxbWh4d2E2YmUwIn0.AvyOfpd5nrPWWMGhpdaZxw';

const FlightMap = ({ simulationState }) => {
  const { currentTime, activeFlights } = simulationState;

  const getFlightPosition = (flight) => {
    const departureAirport = australianAirports.find(airport => airport.iataCode === flight.departureAirport);
    const arrivalAirport = australianAirports.find(airport => airport.iataCode === flight.arrivalAirport);
    const departureTime = new Date(flight.departureTime).getTime();
    const arrivalTime = new Date(flight.arrivalTime).getTime();
    
    const progress = Math.max(0, Math.min(1, (currentTime - departureTime) / (arrivalTime - departureTime)));

    const lon = departureAirport.lon + (arrivalAirport.lon - departureAirport.lon) * progress;
    const lat = departureAirport.lat + (arrivalAirport.lat - departureAirport.lat) * progress;

    return [lon, lat];
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', overflowY: 'auto' }}>
        <InfoPanel simulationState={simulationState} />
      </div>
      <div style={{ flex: 1 }}>
        <Map
          initialViewState={{
            longitude: 133.7751,
            latitude: -25.2744,
            zoom: 3
          }}
          style={{width: '100%', height: '100%'}}
          mapStyle="mapbox://styles/mapbox/light-v10"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {australianAirports.map(airport => (
            <Marker 
              key={airport.iataCode}
              longitude={airport.lon}
              latitude={airport.lat}
              color="red"
            />
          ))}
          {activeFlights.map(flight => {
            const [lon, lat] = getFlightPosition(flight);
            return (
              <Marker
                key={flight.id}
                longitude={lon}
                latitude={lat}
                anchor="center"
              >
                <div style={{ 
                  backgroundColor: 'blue', 
                  color: 'white',
                  padding: '10px 15px', 
                  borderRadius: '50%', 
                  fontSize: '18px',
                  fontWeight: 'bold',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                  border: '2px solid white',
                  minWidth: '40px',
                  minHeight: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {flight.id}
                </div>
              </Marker>
            );
          })}
        </Map>
      </div>
    </div>
  );
};

export default FlightMap;