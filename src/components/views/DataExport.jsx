import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../../config';

function DataExport() {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post(`${config.url}/MapApi/incident/`, {
        month,
        day,
        year
      });

      console.log('Réponse du serveur :', response.data);
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
    }
  };

  return (
    <div className='body' style={{marginTop:"5%", marginLeft:"15%"}}>
      <h6>Export des données sur les incidents</h6>
      <form onSubmit={handleSubmit}>
        <label>
          Mois:
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
        <label>
          Jour:
          <input
            type="text"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </label>
        <label>
          Année:
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>
        <button type="submit">Exporter</button>
      </form>
    </div>
  );
}

export default DataExport;
