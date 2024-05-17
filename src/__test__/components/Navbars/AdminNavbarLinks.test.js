import { render, fireEvent } from '@testing-library/react';
import AdminNavbarLinks from '../../../components/Navbars/AdminNavbarLinks';
import { components } from 'react-select';

describe('AdminNavbarLinks', () => {
    it('renders without crashing', () => {
        const { getByTestId } = render( < AdminNavbarLinks / > );
        expect(getByTestId('admin-navbar-links')).toBeInTheDocument();
    });

    it('triggers profile function when profile menu item is clicked', () => {
        const { getByText } = render( < AdminNavbarLinks / > );
        const profileMenuItem = getByText('Profil');
        fireEvent.click(profileMenuItem);
        // Here you should check if the profile function has been called
    });

    it('triggers logOut function when log out menu item is clicked', () => {
        const { getByText } = render( < AdminNavbarLinks / > );
        const logOutMenuItem = getByText('Log Out');
        fireEvent.click(logOutMenuItem);
        // Here you should check if the logOut function has been called
    });
});