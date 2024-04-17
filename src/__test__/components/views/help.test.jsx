import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HelpOnline from '../../../components/views/help';

describe('HelpOnline Component', () => {
    test('renders the HelpOnline view text', () => {
        render(<HelpOnline />);
        const helpOnlineTextElement = screen.getByText('HelpOnline view');
        expect(helpOnlineTextElement).toBeInTheDocument();
    });
});
