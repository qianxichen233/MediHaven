import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ChatBox from './ChatBox';

describe('ChatBox Component', () => {
    it('renders without crashing', () => {
        render(<ChatBox />);
    });

    it('displays correct content when no chat is selected', () => {
        const { getByText } = render(<ChatBox />);
        expect(getByText('MEDIHAVEN')).toBeInTheDocument();
    });

    it('allows selecting a chat', () => {
        const { getByText } = render(<ChatBox />);
        fireEvent.click(getByText('example@example.com'));
        // Assert expected behavior after selecting a chat
    });

    it('opens and closes the modal for adding a new chat', () => {
        const { getByText, queryByText } = render(<ChatBox />);
        fireEvent.click(getByText('Add New Chat'));
        expect(getByText('Add New Chat Modal')).toBeInTheDocument();
        fireEvent.click(getByText('Close'));
        expect(queryByText('Add New Chat Modal')).toBeNull();
    });

    it('allows typing and sending a message', async () => {
        const { getByPlaceholderText, getByText } = render(<ChatBox />);
        fireEvent.change(getByPlaceholderText('Type your message here...'), {
            target: { value: 'Hello, World!' },
        });
        fireEvent.click(getByText('SEND'));
        // Assert expected behavior after sending a message
        await waitFor(() => {
            expect(getByText('Hello, World!')).toBeInTheDocument();
        });
    });

    it('disables SEND button when no message is typed', () => {
        const { getByText } = render(<ChatBox />);
        expect(getByText('SEND')).toBeDisabled();
    });


});
