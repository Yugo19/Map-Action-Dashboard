import { render, fireEvent } from '@testing-library/react';
import  NavHeader  from '../../../components/Navbars/AdminNavbar';

describe('NavHeader', () => {
    it('renders without crashing', () => {
        const { getByTestId } = render( <NavHeader/> );
        expect(getByTestId('header')).toBeInTheDocument();
    });
    it('toggles mobile sidebar on click and removes click listener on body click', () => {
        const { getByTestId } = render(<NavHeader />);
        const toggleButton = getByTestId('navbar-toggle');
        
        fireEvent.click(toggleButton);
        expect(document.documentElement.classList.contains('nav-open')).toBe(true);
      
        fireEvent.click(document.body);
        expect(document.documentElement.classList.contains('nav-open')).toBe(false);
      
        fireEvent.click(document.body);
        expect(document.documentElement.classList.contains('nav-open')).toBe(false);
      });
      
});