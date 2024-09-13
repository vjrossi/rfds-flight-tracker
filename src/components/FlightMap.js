import React from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import australianAirports from '../airportData';
import InfoPanel from './InfoPanel';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoidmpyb3NzaSIsImEiOiJjbHNjb2lzeTQwczJ3MmpxbWh4d2E2YmUwIn0.AvyOfpd5nrPWWMGhpdaZxw';

const calculateCurve = (x0, y0, x1, y1, numPoints = 100) => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const offset = distance * 0.15; // Adjust this value to change the curve intensity

  const controlPoint1 = [
    x0 + dx * 0.25 - dy * offset / distance,
    y0 + dy * 0.25 + dx * offset / distance
  ];
  const controlPoint2 = [
    x0 + dx * 0.75 - dy * offset / distance,
    y0 + dy * 0.75 + dx * offset / distance
  ];

  return Array.from({length: numPoints}, (_, i) => {
    const t = i / (numPoints - 1);
    const u = 1 - t;
    return [
      u*u*u*x0 + 3*u*u*t*controlPoint1[0] + 3*u*t*t*controlPoint2[0] + t*t*t*x1,
      u*u*u*y0 + 3*u*u*t*controlPoint1[1] + 3*u*t*t*controlPoint2[1] + t*t*t*y1
    ];
  });
};

const getFlightPosition = (flight, curvePoints, currentTime) => {
  const departureTime = new Date(flight.departureTime).getTime();
  const arrivalTime = new Date(flight.arrivalTime).getTime();
  const progress = Math.max(0, Math.min(1, (currentTime - departureTime) / (arrivalTime - departureTime)));
  
  const index = Math.floor(progress * (curvePoints.length - 1));
  const nextIndex = Math.min(curvePoints.length - 1, index + 1);
  
  const [lon, lat] = curvePoints[index];
  const [nextLon, nextLat] = curvePoints[nextIndex];
  
  const bearing = (Math.atan2(nextLon - lon, nextLat - lat) * 180 / Math.PI + 360) % 360;

  return [lon, lat, bearing];
};

const FlightMap = ({ simulationState }) => {
  const { currentTime, activeFlights } = simulationState;

  const flightPathsGeoJSON = {
    type: 'FeatureCollection',
    features: activeFlights.map(flight => {
      const departureAirport = australianAirports.find(airport => airport.iataCode === flight.departureAirport);
      const arrivalAirport = australianAirports.find(airport => airport.iataCode === flight.arrivalAirport);
      const curvePoints = calculateCurve(departureAirport.lon, departureAirport.lat, arrivalAirport.lon, arrivalAirport.lat);
      
      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: curvePoints
        }
      };
    })
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
          <Source id="flightPaths" type="geojson" data={flightPathsGeoJSON}>
            <Layer
              id="flightPathLines"
              type="line"
              layout={{
                'line-cap': 'round',
                'line-join': 'round'
              }}
              paint={{
                'line-color': 'rgba(255, 0, 0, 0.5)',
                'line-width': 3
              }}
            />
          </Source>

          {australianAirports.map(airport => (
            <Marker
              key={airport.iataCode}
              longitude={airport.lon}
              latitude={airport.lat}
              anchor="center"
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="6" fill="rgba(173, 216, 230, 0.5)" stroke="rgba(0, 0, 139, 0.5)" strokeWidth="2" />
                <circle cx="7" cy="7" r="3" fill="rgba(0, 0, 139, 0.5)" />
              </svg>
            </Marker>
          ))}
          {activeFlights.map((flight, index) => {
            const departureAirport = australianAirports.find(airport => airport.iataCode === flight.departureAirport);
            const arrivalAirport = australianAirports.find(airport => airport.iataCode === flight.arrivalAirport);
            const curvePoints = calculateCurve(departureAirport.lon, departureAirport.lat, arrivalAirport.lon, arrivalAirport.lat);
            const [lon, lat, bearing] = getFlightPosition(flight, curvePoints, currentTime);
            
            return (
              <Marker
                key={index}
                longitude={lon}
                latitude={lat}
                anchor="center"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/airplane1.png`}
                  alt={`Flight ${flight.id}`}
                  style={{
                    width: '30px',
                    height: 'auto',
                    transform: `rotate(${bearing}deg)`,
                    transformOrigin: 'center',
                    position: 'absolute',
                    top: '-15px',  // Half the height to center vertically
                    left: '-15px', // Half the width to center horizontally
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '15px',  // Adjust based on icon size
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  padding: '2px 4px',
                  borderRadius: '2px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
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