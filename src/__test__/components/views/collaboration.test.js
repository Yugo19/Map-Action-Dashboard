// Colaboration.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Colaboration from '../../../components/views/colaboration';


jest.mock('axios');
describe('Colaboration Component', () => {
    beforeEach(() => {
        mock.reset();
    });

    it('renders correctly and handles month selection', async () => {
        mock.onGet(/\/MapApi\/incidentByMonth\/\?month=\d+/).reply(200, {
            data: [
                {
                    id: 1,
                    title: 'Incident 1',
                    description: 'Description 1',
                    etat: 'taken_into_account',
                    lattitude: 16.2833,
                    longitude: -3.0833,
                    photo: '/path/to/photo1.jpg',
                    video: '/path/to/video1.mp4',
                    audio: '/path/to/audio1.mp3'
                },
            ]
        });

        render(
            <Router>
                <Colaboration />
            </Router>
        );

        expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Nombre d'incidents pris en compte")).toBeInTheDocument();
        });

        expect(screen.getByText('1')).toBeInTheDocument(); // Adjust based on your mock data

        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: '2' } });

        await waitFor(() => {
            expect(screen.getByText('Février')).toBeInTheDocument();
        });
    });
});
