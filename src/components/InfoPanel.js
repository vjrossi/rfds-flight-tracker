// src/components/InfoPanel.js

import React from 'react';

const InfoPanel = ({ simulationState }) => {
    const { currentTime, flights, activeFlights, simulationLog } = simulationState;

    return (
        <div style={{
            backgroundColor: '#00205B',
            color: 'white',
            padding: '20px',
            width: '300px',
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h2 style={{ fontSize: '30px', marginBottom: '10px' }}>
                {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Simulation not started'}
            </h2>
            <p style={{ fontSize: '20px', marginBottom: '20px' }}>
                {currentTime ? currentTime.toLocaleDateString([], { day: 'numeric', month: 'long' }) : ''}
            </p>
            <p style={{ fontSize: '14px', marginBottom: '20px' }}>
                The Royal Flying Doctor Service has 81 aircraft that cover the length and breadth of the country. This map shows the RFDS planes that are currently in the air, providing vital services across Australia.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center', maxHeight: '90%', maxWidth: '45%', padding: '15px', borderStyle: 'solid' }}>
                    <h3 style={{ fontSize: '48px', marginBottom: '5px' }}>{activeFlights.length}</h3>
                    <p style={{ fontSize: '20px' }}>flights in the air</p>
                </div>
                <div style={{ textAlign: 'center', maxHeight: '90%', maxWidth: '45%', padding: '15px', borderStyle: 'solid' }}>
                    <h3 style={{ fontSize: '48px', marginBottom: '5px' }}>{flights.length}</h3>
                    <p style={{ fontSize: '20px' }}>flights in 24 hours</p>
                </div>
            </div>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <img src='/images/rf_horizontal_cmyk_ses_white.png' style={{ maxWidth: '100%', height: 'auto' }} alt='RFDS logo' />
            </div>
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Flight Log</h3>
                <div style={{ height: '100%', overflowY: 'auto', fontSize: '14px' }}>
                    {simulationLog.map((log, index) => (
                        <div key={index} style={{ marginBottom: '5px' }}>{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InfoPanel;