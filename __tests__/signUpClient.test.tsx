import { render, fireEvent, screen } from '@testing-library/react';
import SignUpForm from '@/components/SignUpForm';

test('if component rendered', async () => {
    render(<SignUpForm />);
    fireEvent.change(screen.getByLabelText(/Username/i), {
        target: { value: 'ass' },
    });
});
