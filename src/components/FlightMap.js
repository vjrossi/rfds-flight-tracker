import React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import australianAirports from '../airportData';
import InfoPanel from './InfoPanel';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoidmpyb3NzaSIsImEiOiJjbHNjb2lzeTQwczJ3MmpxbWh4d2E2YmUwIn0.AvyOfpd5nrPWWMGhpdaZxw';

const calculateBearing = (start, end) => {
  const startLat = start.lat * Math.PI / 180;
  const startLng = start.lon * Math.PI / 180;
  const endLat = end.lat * Math.PI / 180;
  const endLng = end.lon * Math.PI / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
            Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
};

const FlightMap = ({ simulationState }) => {
  const { currentTime, activeFlights, simulationLog } = simulationState;

  const getFlightPosition = (flight) => {
    const departureAirport = australianAirports.find(airport => airport.iataCode === flight.departureAirport);
    const arrivalAirport = australianAirports.find(airport => airport.iataCode === flight.arrivalAirport);
    const departureTime = new Date(flight.departureTime).getTime();
    const arrivalTime = new Date(flight.arrivalTime).getTime();

    const progress = Math.max(0, Math.min(1, (currentTime - departureTime) / (arrivalTime - departureTime)));

    const lon = departureAirport.lon + (arrivalAirport.lon - departureAirport.lon) * progress;
    const lat = departureAirport.lat + (arrivalAirport.lat - departureAirport.lat) * progress;

    const bearing = calculateBearing(departureAirport, arrivalAirport);

    return [lon, lat, bearing];
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', height: '100%', overflowY: 'auto' }}>
        <InfoPanel simulationState={simulationState} />
      </div>
      <div style={{ flex: 1 }}>
        <Map
          initialViewState={{
            longitude: 133.7751,
            latitude: -25.2744,
            center: [134.0, -28.0],
            zoom: 4.0,
            minZoom: 3.5,
            maxZoom: 4.0,
            dragPan: false,
            attributionControl: false
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v10"
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
            const [lon, lat, bearing] = getFlightPosition(flight);
            return (
              <Marker
                key={flight.id}
                longitude={lon}
                latitude={lat}
                anchor="center"
              >
                <img 
                  src="/images/airplane1.png" 
                  alt={`Flight ${flight.id}`}
                  style={{ 
                    width: '30px', 
                    height: 'auto',
                    transform: `rotate(${bearing}deg)`
                  }}
                />
              </Marker>
            );
          })}
        </Map>
      </div>
    </div>
  );
};

export default FlightMap;