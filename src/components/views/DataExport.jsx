import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../../config';
import "../../assets/css/global.css"

function DataExport() {
  const [period, setPeriod] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); 

  const handleExport = async () => {
    try {
      let response;
      if (period === 'day') {
        response = await axios.get(`${config.url}/MapApi/incidentByWeek/`, {
          params: {
            day: selectedDate.toISOString().slice(0, 10),
          },
          headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        });
        downloadFile(response.data, `incidents_${selectedDate.toISOString().slice(0, 10)}.csv`);
      } else if (period === 'month') {
        const monthNumber = new Date(selectedMonth + '-01').getMonth() + 1;
        response = await axios.get(`${config.url}/MapApi/incidentByMonth/`, {
          params: {
            month: monthNumber,
          },
          headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        });
        console.log(response.data.data)
        const csvData = convertToCSV(response.data.data);
        downloadFile(csvData, `incidents_${selectedMonth}.csv`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'exportation des données :', error.message);
    }
  };
  
  const convertToCSV = (data) => {
    if (!data || !data.length) return '';

    const headers = Object.keys(data[0]).map(header => `"${header}"`).join(',') + '\n';
    const rows = data.map(obj => 
      Object.values(obj).map(value => `"${value}"`).join(',')
    ).join('\n');
    return headers + rows;
  };

  const downloadFile = (data, filename) => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='body'>
      <h2>Export des Données {period === 'day' ? 'par Jour' : 'par Mois'}</h2>
      {period === 'day' && (
        <div>
          <label htmlFor="datePicker">Sélectionnez une Date:</label>
          <input
            type="date"
            id="datePicker"
            value={selectedDate.toISOString().slice(0, 10)}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
      )}
      {period === 'month' && (
        <div>
          <label htmlFor="monthPicker">Sélectionnez un Mois:</label>
          <input
            type="month"
            id="monthPicker"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      )}
      <div className='choiceData'>
        <input
          type="radio"
          id="day"
          name="period"
          value="day"
          checked={period === 'day'}
          onChange={() => setPeriod('day')}
        />
        <label htmlFor="day">Par Jour</label>

        <input
          type="radio"
          id="month"
          name="period"
          value="month"
          checked={period === 'month'}
          onChange={() => setPeriod('month')}
        />
        <label htmlFor="month">Par Mois</label>
      </div>
      <button onClick={handleExport}>Exporter les Données</button>
    </div>
  );
}
export default DataExport;
