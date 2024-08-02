import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Analyze from '../../../components/views/analyze';
import axiosMock from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useParams: () => ({

    incidentId: '123'
  }),
}));

describe('Analyze Component', () => {
  beforeEach(() => {
    axiosMock.get.mockResolvedValueOnce({
      data: { title: 'Test Incident', lattitude: 10, longitude: 20, etat: 'resolved', description: 'Sample incident description', photo: 'src/__test__/components/views/1PYBbzpPfHFayHOoEeHdcOEjGnGnopzmCRXqUIAyDEkYidkfWaVbfQiOH1vk.jpg', audio: '', video: '' },
    });
    axiosMock.get.mockResolvedValueOnce({
      data: [{ piste_solution: 'Immediate evacuation', context: 'Nearby river flooding', impact_potentiel: 'High risk of damage' }],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders incident details from API', async () => {
    render(
      <BrowserRouter>
        <Analyze />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Incident')).toBeInTheDocument();
      expect(screen.getByText('Sample incident description')).toBeInTheDocument();
    });

    expect(axiosMock.get).toHaveBeenCalledTimes(2);
    expect(axiosMock.get).toHaveBeenCalledWith(expect.stringContaining('MapApi/incident/123'));
    expect(axiosMock.get).toHaveBeenCalledWith(expect.stringContaining('MapApi/prediction/123'));
  });

});

