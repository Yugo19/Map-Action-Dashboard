import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../../components/Card/Card';

describe('Card Component', () => {
  test('renders Card component', () => {
    render(<Card />);
    const cardElement = screen.getByTestId('card-element');
    expect(cardElement).toBeInTheDocument();
  });

  test('displays the correct title and category', () => {
    render(<Card title="Test Title" category="Test Category" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  test('displays the correct content and stats', () => {
    render(<Card content="Test Content" stats="Test Stats" />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Stats')).toBeInTheDocument();
  });
});
