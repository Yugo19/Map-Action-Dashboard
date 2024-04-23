import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FAQ from '../../../components/views/FAQ'

describe('FAQ Component', () => {
    test('renders the FAQ view text', () => {
        render(<FAQ />);
        const faqTextElement = screen.getByText('FAQ view');
        expect(faqTextElement).toBeInTheDocument();
    });
});
