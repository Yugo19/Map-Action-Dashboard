import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminNavbarLinks from '../../../components/Navbars/AdminNavbarLinks';

describe('AdminNavbarLinks', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<AdminNavbarLinks />);
    expect(getByTestId('admin-navbar-links')).toBeInTheDocument();
  });

  it('triggers profile function when profile menu item is clicked', () => {
    sessionStorage.setItem('user_type', 'admin');
    const { getByTestId, getByText } = render(<AdminNavbarLinks />);
    const profileMenuItem = getByText('Profil');
    fireEvent.click(profileMenuItem);
    expect(window.location.pathname).toBe('/admin/profile');
  });

  it('triggers logOut function when log out menu item is clicked', () => {
    const { getByText } = render(<AdminNavbarLinks />);
    const logOutMenuItem = getByText('Log Out');
    fireEvent.click(logOutMenuItem);
    expect(window.location.pathname).toBe('/');
  });
});
