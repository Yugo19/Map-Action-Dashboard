import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Parametres from '../../../components/views/Parametres';

describe('Parametres Component', () => {
    test('renders the first name input', () => {
        render(<Parametres />);
        const firstNameInput = screen.getByTestId('first_name');
        expect(firstNameInput).toBeInTheDocument();
    });

    test('renders the last name input', () => {
        render(<Parametres />);
        const lastNameInput = screen.getByTestId('last_name');
        expect(lastNameInput).toBeInTheDocument();
    });

    test('renders the email input', () => {
        render(<Parametres />);
        const emailInput = screen.getByTestId('email');
        expect(emailInput).toBeInTheDocument();
    });

    test('renders the address input', () => {
        render(<Parametres />);
        const addressInput = screen.getByTestId('adresse');
        expect(addressInput).toBeInTheDocument();
    });

    test('renders the phone input', () => {
        render(<Parametres />);
        const phoneInput = screen.getByTestId('phone');
        expect(phoneInput).toBeInTheDocument();
    });

    test('renders the organisation input', () => {
        render(<Parametres />);
        const organisationInput = screen.getByTestId('organisation');
        expect(organisationInput).toBeInTheDocument();
    });

    test('renders the button to change password', () => {
        render(<Parametres />);
        const changePasswordButton = screen.getByRole('button', { name: /Modifier votre mot de passe/i });
        expect(changePasswordButton).toBeInTheDocument();
    });
});
