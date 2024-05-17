import { render, fireEvent } from '@testing-library/react';
import { Header } from '../../../components/Navbars/AdminNavbar'; // Import the Header component correctly

describe('Header', () => {
    it('renders without crashing', () => {
        const { getByTestId } = render( < Header / > );
        expect(getByTestId('header')).toBeInTheDocument();
    });
    it('toggles mobile sidebar on click', () => {
        const { getByTestId } = render( < Header / > ); // Use the imported Header component
        fireEvent.click(getByTestId('navbar-toggle'));
        expect(document.body.querySelector('#bodyClick')).toBeInTheDocument();
        expect(document.documentElement.classList.contains('nav-open')).toBe(true);
    });
});