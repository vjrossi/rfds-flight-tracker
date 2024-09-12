import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import generateFlightData from '../generateFlightData';

const FlightTable = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    setFlights(generateFlightData());
  }, []);

  return (
    <Container>
      <h1 className="my-4">RFDS Flight Schedule</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Flight ID</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Aircraft</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.id}>
              <td>{flight.id}</td>
              <td>{`${flight.departureAirport} - ${new Date(flight.departureTime).toLocaleString()}`}</td>
              <td>{`${flight.arrivalAirport} - ${new Date(flight.arrivalTime).toLocaleString()}`}</td>
              <td>{flight.aircraft}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default FlightTable;