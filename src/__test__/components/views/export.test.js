import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import DataExport from '../../../components/views/DataExport';
import { config } from '../../../config';

jest.mock('axios');

describe('DataExport Component', () => {
  beforeEach(() => {
    axios.post.mockClear();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  test('renders correctly and submits data', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Success' } });

    render(<DataExport />);

    expect(screen.getByText('Export des données sur les incidents')).toBeInTheDocument();
    expect(screen.getByLabelText('Mois:')).toBeInTheDocument();
    expect(screen.getByLabelText('Jour:')).toBeInTheDocument();
    expect(screen.getByLabelText('Année:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Exporter/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Mois:'), { target: { value: '01' } });
    fireEvent.change(screen.getByLabelText('Jour:'), { target: { value: '01' } });
    fireEvent.change(screen.getByLabelText('Année:'), { target: { value: '2023' } });

    fireEvent.click(screen.getByRole('button', { name: /Exporter/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    expect(axios.post).toHaveBeenCalledWith(`${config.url}/MapApi/incident/`, {
      month: '01',
      day: '01',
      year: '2023'
    });

    await waitFor(() => expect(console.log).toHaveBeenCalledWith('Réponse du serveur :', { message: 'Success' }));
  });

  test('handles error during form submission', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));

    console.error = jest.fn();

    render(<DataExport />);

    fireEvent.change(screen.getByLabelText('Mois:'), { target: { value: '02' } });
    fireEvent.change(screen.getByLabelText('Jour:'), { target: { value: '02' } });
    fireEvent.change(screen.getByLabelText('Année:'), { target: { value: '2024' } });

    fireEvent.click(screen.getByRole('button', { name: /Exporter/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    
    expect(axios.post).toHaveBeenCalledWith(`${config.url}/MapApi/incident/`, {
      month: '02',
      day: '02',
      year: '2024'
    });

    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Erreur lors de la requête:', expect.any(Error)));
  });
});
