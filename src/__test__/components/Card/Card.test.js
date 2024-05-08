import { render } from '@testing-library/react';
import Card from '../../../components/Card/Card';

describe('Card', () => {
    it('renders without crashing', () => {
        const { getByTestId } = render( < Card / > );
        expect(getByTestId('card')).toBeInTheDocument();
    });

    it('displays the correct title and category', () => {
        const { getByText } = render( < Card title = "Test Title"
            category = "Test Category" / > );
        expect(getByText('Test Title')).toBeInTheDocument();
        expect(getByText('Test Category')).toBeInTheDocument();
    });

    it('displays the correct content and stats', () => {
        const { getByText } = render( < Card content = "Test Content"
            stats = "Test Stats" / > );
        expect(getByText('Test Content')).toBeInTheDocument();
        expect(getByText('Test Stats')).toBeInTheDocument();
    });
});