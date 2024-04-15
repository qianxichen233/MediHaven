import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Appointment from '../Appointment';

describe('Test Appointment Component', () => {
  test('Renders appointment form correctly', () => {
    render(<Appointment />);
    
    // Verify that the appointment form elements are rendered correctly
    expect(screen.getByTestId('appointment-form')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
    expect(screen.getByTestId('schedule-section')).toBeInTheDocument();
  });

  test('Displays loading indicator when loading', () => {
    render(<Appointment />);
    
    // Verify that the loading indicator is displayed
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  test('Renders error message if appointment fetch fails', async () => {
    const mockFetchAppointments = jest.fn(() => Promise.reject('Error fetching appointments'));
    jest.mock('../../../api/schedule', () => ({
      get_schedule: mockFetchAppointments
    }));

    render(<Appointment />);
    
    // Wait for error message to be displayed
    const errorMessage = await screen.findByText('Error fetching appointments');
    
    // Verify that the error message is rendered
    expect(errorMessage).toBeInTheDocument();
  });

  test('Displays appointments if fetched successfully', async () => {
    const mockAppointments = [{ id: 1, time: '10:00 AM' }, { id: 2, time: '11:00 AM' }];
    const mockFetchAppointments = jest.fn(() => Promise.resolve(mockAppointments));
    jest.mock('../../../api/schedule', () => ({
      get_schedule: mockFetchAppointments
    }));

    render(<Appointment />);
    
    // Wait for the appointments to be displayed
    const appointment1 = await screen.findByText('10:00 AM');
    const appointment2 = await screen.findByText('11:00 AM');
    
    // Verify that the appointments are rendered correctly
    expect(appointment1).toBeInTheDocument();
    expect(appointment2).toBeInTheDocument();
  });
});
