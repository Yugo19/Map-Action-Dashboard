import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Parametres from '../../../components/views/Parametres';

describe('Parametres Component', () => {
    test('renders the Parametres view text', () => {
        render(<Parametres />);
        const parametresTextElement = screen.getByText('Parametres view');
        expect(parametresTextElement).toBeInTheDocument();
    });
});