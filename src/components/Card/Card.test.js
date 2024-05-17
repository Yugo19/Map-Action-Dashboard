import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../../components/Card/Card';
describe('Card Component', () => {
  test('renders Card component', () => {
    render(<Card />);
    const cardElement = screen.getByTestId('card-element');
    expect(cardElement).toBeInTheDocument();
  });
});