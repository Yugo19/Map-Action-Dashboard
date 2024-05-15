import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Help from '../../../components/views/help';



describe('Help', () => {
            it('renders the correct text', () => {
                const { getByText } = render( < Help / > );
                it('renders the correct text', () => {
                    const { getByText } = render( < Help / > );
                    expect(getByText('Aide en Ligne')).toBeInTheDocument();
                });
            });