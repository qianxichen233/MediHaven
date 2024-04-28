import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditableSingleSchedule from '../EditableSingleSchedule';

describe('EditableSingleSchedule Component', () => {
  test('renders physician details correctly', () => {
    const physician = {
      first_name: 'John',
      last_name: 'Doe',
      title: 'Dr.',
    };
    const schedules = [];

    render(
      <EditableSingleSchedule
        allowEdit={false}
        physician={physician}
        schedules={schedules}
      />
    );

    expect(screen.getByText('Physician Detail')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Dr.')).toBeInTheDocument();
  });

  test('renders schedule properly', () => {
    const physician = {
      first_name: 'John',
      last_name: 'Doe',
      title: 'Dr.',
    };
    const schedules = [
      {
        schedule_st: '2024-05-05 09:00:00',
        schedule_ed: '2024-05-05 10:00:00',
      },
    ];

    render(
      <EditableSingleSchedule
        allowEdit={false}
        physician={physician}
        schedules={schedules}
      />
    );

    expect(screen.getByTestId('appointment')).toBeInTheDocument();
  });

 
});
