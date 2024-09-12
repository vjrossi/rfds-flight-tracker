import generateFlightData from './generateFlightData';
import australianAirports from './airportData';

describe('generateFlightData', () => {
  let flights;

  beforeEach(() => {
    flights = generateFlightData();
  });

  test('generates between 13 and 17 flights per day', () => {
    expect(flights.length).toBeGreaterThanOrEqual(13);
    expect(flights.length).toBeLessThanOrEqual(17);
  });

  test('generates flights within a 24-hour period', () => {
    const firstFlightTime = new Date(flights[0].departureTime);
    const lastFlightTime = new Date(flights[flights.length - 1].arrivalTime);
    
    // Check if all flights are within the same day
    expect(firstFlightTime.getDate()).toBe(lastFlightTime.getDate());
    
    // Check if the time difference is less than or equal to 24 hours
    const timeDifference = lastFlightTime.getTime() - firstFlightTime.getTime();
    expect(timeDifference).toBeLessThanOrEqual(24 * 60 * 60 * 1000);
  });

  test('flights are sorted by departure time', () => {
    for (let i = 1; i < flights.length; i++) {
      const prevDepartureTime = new Date(flights[i-1].departureTime).getTime();
      const currentDepartureTime = new Date(flights[i].departureTime).getTime();
      expect(currentDepartureTime).toBeGreaterThanOrEqual(prevDepartureTime);
    }
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

  test('flight duration is between 30 minutes and 2 hours', () => {
    flights.forEach(flight => {
      const departureTime = new Date(flight.departureTime).getTime();
      const arrivalTime = new Date(flight.arrivalTime).getTime();
      const durationMinutes = (arrivalTime - departureTime) / (1000 * 60);
      expect(durationMinutes).toBeGreaterThanOrEqual(30);
      expect(durationMinutes).toBeLessThanOrEqual(120);
    });
  });

  test('flights are skewed towards afternoon and evening (12 PM to midnight)', () => {
    const afternoonEveningFlights = flights.filter(flight => {
      const hour = new Date(flight.departureTime).getHours();
      return hour >= 12 && hour < 24;
    });
    expect(afternoonEveningFlights.length).toBeGreaterThan(flights.length * 0.6); // Expecting more than 60% of flights between 12 PM and midnight
  });
});