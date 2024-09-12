// src/components/FlightMap.js

import React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import useFlightSimulation from '../hooks/useFlightSimulation';
import australianAirports from '../airportData';
import InfoPanel from './InfoPanel'; // Add this import

const MAPBOX_TOKEN = 'pk.eyJ1Ijoidmpyb3NzaSIsImEiOiJjbHNjb2lzeTQwczJ3MmpxbWh4d2E2YmUwIn0.AvyOfpd5nrPWWMGhpdaZxw'; // Replace with your actual Mapbox token

const FlightMap = () => {
  const { currentTime, activeFlights } = useFlightSimulation();

  const getFlightPosition = (flight) => {
    const departureAirport = australianAirports.find(airport => airport.iataCode === flight.departureAirport);
    const arrivalAirport = australianAirports.find(airport => airport.iataCode === flight.arrivalAirport);
    const departureTime = new Date(flight.departureTime);
    const arrivalTime = new Date(flight.arrivalTime);
    const progress = (currentTime - departureTime) / (arrivalTime - departureTime);

    return [
      departureAirport.lon + (arrivalAirport.lon - departureAirport.lon) * progress,
      departureAirport.lat + (arrivalAirport.lat - departureAirport.lat) * progress
    ];
  };

  return (
    <div style={{ display: 'flex' }}>
      <InfoPanel 
        currentTime={currentTime} 
        activeFlights={activeFlights}
      />
      <div style={{ flexGrow: 1 }}>
        <Map
          initialViewState={{
            longitude: 133.7751,
            latitude: -25.2744,
            zoom: 3
          }}
          style={{width: '100%', height: '100vh'}}
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
                color="blue"
              />
            );
          })}
        </Map>
      </div>
    </div>
  );
};

export default FlightMap;