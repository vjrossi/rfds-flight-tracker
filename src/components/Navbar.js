import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f8f9fa', padding: '10px' }}>
      <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', margin: 0, padding: 0 }}>
        <li style={{ margin: '0 10px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>Flight Table</Link>
        </li>
        <li style={{ margin: '0 10px' }}>
          <Link to="/simulation" style={{ textDecoration: 'none', color: '#007bff' }}>Flight Simulation</Link>
        </li>
        <li style={{ margin: '0 10px' }}>
          <Link to="/map" style={{ textDecoration: 'none', color: '#007bff' }}>Flight Map</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;