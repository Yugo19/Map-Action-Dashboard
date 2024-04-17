import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Historique from '../../../components/views/Historique';

describe('Historique Component', () => {
    test('renders the correct content', () => {
        render(<Historique />);
        const historiqueElement = screen.getByText('Historique view');
        expect(historiqueElement).toBeInTheDocument();
    });
});
