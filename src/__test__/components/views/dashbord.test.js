import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../../../components/views/dashboard';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('Dashboard Component', () => {
  test('renders the dashboard title', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const titleElement = screen.getByText(/Tableau de Bord/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the month selector', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  test('renders the number of incidents card', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const incidentsCard = screen.getByText(/Nombre d'incidents/i);
    expect(incidentsCard).toBeInTheDocument();
  });

  test('changes month on select', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: '2' } });

    
  });
});
