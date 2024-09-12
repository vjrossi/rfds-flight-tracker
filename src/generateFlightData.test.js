import generateFlightData from './generateFlightData';
import australianAirports from './airportData';

describe('generateFlightData', () => {
  let flights;
  const startDate = new Date('2023-01-01T00:00:00Z');

  beforeAll(() => {
    flights = generateFlightData(startDate);
  });

  test('generates flights within a 24-hour period', () => {
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
    flights.forEach(flight => {
      expect(new Date(flight.departureTime).getTime()).toBeGreaterThanOrEqual(startDate.getTime());
      expect(new Date(flight.arrivalTime).getTime()).toBeLessThanOrEqual(endDate.getTime());
    });
  });

  test('uses no more than 77 unique planes', () => {
    const uniquePlanes = new Set(flights.map(flight => flight.aircraft));
    expect(uniquePlanes.size).toBeLessThanOrEqual(77);
  });

  test('each flight has the required properties', () => {
    flights.forEach(flight => {
      expect(flight).toHaveProperty('id');
      expect(flight).toHaveProperty('departureAirport');
      expect(flight).toHaveProperty('arrivalAirport');
      expect(flight).toHaveProperty('departureTime');
      expect(flight).toHaveProperty('arrivalTime');
      expect(flight).toHaveProperty('aircraft');
    });
  });

  test('departure and arrival airports are different', () => {
    flights.forEach(flight => {
      expect(flight.departureAirport).not.toBe(flight.arrivalAirport);
    });
  });

  test('departure and arrival airports are valid', () => {
    const airportCodes = australianAirports.map(airport => airport.iataCode);
    flights.forEach(flight => {
      expect(airportCodes).toContain(flight.departureAirport);
      expect(airportCodes).toContain(flight.arrivalAirport);
    });
  });

  test('arrival time is after departure time', () => {
    flights.forEach(flight => {
      expect(new Date(flight.arrivalTime).getTime()).toBeGreaterThan(new Date(flight.departureTime).getTime());
    });
  });

  test('flight duration is between 30 minutes and 2 hours', () => {
    flights.forEach(flight => {
      const durationMs = new Date(flight.arrivalTime) - new Date(flight.departureTime);
      const durationMinutes = durationMs / (1000 * 60);
      expect(durationMinutes).toBeGreaterThanOrEqual(30);
      expect(durationMinutes).toBeLessThanOrEqual(120);
    });
  });

  test('flights are skewed towards 6 AM to midnight', () => {
    const dayFlights = flights.filter(flight => {
      const hour = new Date(flight.departureTime).getUTCHours();
      return hour >= 6 && hour < 24;
    });
    expect(dayFlights.length).toBeGreaterThan(flights.length * 0.6); // Expecting more than 60% of flights during day time
  });

  test('flights are sorted by departure time', () => {
    for (let i = 1; i < flights.length; i++) {
      const prevDepartureTime = new Date(flights[i - 1].departureTime).getTime();
      const currentDepartureTime = new Date(flights[i].departureTime).getTime();
      expect(currentDepartureTime).toBeGreaterThanOrEqual(prevDepartureTime);
    }
  });
});