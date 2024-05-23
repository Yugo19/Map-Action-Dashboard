import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Help from '../../../components/views/help';

describe('Help', () => {
  it('renders the correct text', () => {
    render(<Help />);
    const elements = screen.getAllByText('Aide en Ligne');
    expect(elements.length).toBeGreaterThan(0);
  });
});
