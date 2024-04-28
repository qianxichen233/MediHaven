// Import necessary dependencies and the component to test
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Schedule from '../Schedule';
import { useMyContext } from '../../MyContext';
import { get_schedule } from '../../../api/schedule';
import { getCurrentDate } from '../../../utils/utils';

// Mock the MyContext hook
jest.mock('../../MyContext', () => ({
  useMyContext: jest.fn(),
}));

// Mock the get_schedule function
jest.mock('../../../api/schedule', () => ({
  get_schedule: jest.fn(),
}));

// Mock the current date function
jest.mock('../../../utils/utils', () => ({
  getCurrentDate: jest.fn(),
}));

describe('Schedule Component', () => {
  beforeEach(() => {
    // Mock the user context
    useMyContext.mockReturnValue({
      user: {
        role: 'role',
        email: 'user@example.com',
      },
    });

    // Mock the current date
    getCurrentDate.mockReturnValue('2024-05-05');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner when schedules are loading', async () => {
    get_schedule.mockResolvedValueOnce([]);
    
    render(<Schedule />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).toBeNull());
  });

  test('renders "No Appointment Today" message when no schedules are available', async () => {
    get_schedule.mockResolvedValueOnce([]);

    render(<Schedule />);

    expect(await screen.findByText('No Appointment Today')).toBeInTheDocument();
  });

  test('renders schedules when schedules are available', async () => {
    const schedules = [
      {
        id: 1,
        patient_first_name: 'John',
        patient_last_name: 'Doe',
        patient_SSN: '123-45-6789',
        schedule_st: '2024-05-05 09:00:00',
        schedule_ed: '2024-05-05 10:00:00',
        description: 'Appointment description',
      },
    ];

    get_schedule.mockResolvedValueOnce(schedules);

    render(<Schedule />);

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('No Appointment Today')).toBeNull();
  });

  test('opens appointment detail modal when a schedule is selected', async () => {
    const schedules = [
      {
        id: 1,
        patient_first_name: 'John',
        patient_last_name: 'Doe',
        patient_SSN: '123-45-6789',
        schedule_st: '2024-05-05 09:00:00',
        schedule_ed: '2024-05-05 10:00:00',
        description: 'Appointment description',
      },
    ];

    get_schedule.mockResolvedValueOnce(schedules);

    render(<Schedule />);

    fireEvent.click(await screen.findByText('John Doe'));

    expect(await screen.findByText('Appointment Detail')).toBeInTheDocument();
    expect(screen.queryByText('No Appointment Today')).toBeNull();
  });

});
