import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Diagnose from './Diagnose';
import * as api from '../../../api/patient'; // Import API functions to mock

// Mock API responses
jest.mock('../../../api/patient', () => ({
  get_patient: jest.fn().mockResolvedValue({ 
    patient_ID: 3
  }),
  get_record: jest.fn().mockResolvedValue({
    record_ID: 1
  }),
  add_record: jest.fn().mockResolvedValue({}), // Mock add_record function
}));

describe('Diagnose Component', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  it('renders patient details and input fields', async () => {
    // Render the Diagnose component
    const { getByLabelText, getByText } = render(<Diagnose info={{/* Mock patient info */}} />);

    // Wait for API calls to resolve
    await waitFor(() => {});

    // Check if patient details are rendered
    expect(getByText(/Patient Detail/i)).toBeInTheDocument();

    // Check if input fields are rendered
    expect(getByLabelText(/Encounter Summary/i)).toBeInTheDocument();
    expect(getByLabelText(/Diagnosis/i)).toBeInTheDocument();
  });

  it('submits diagnosis data when submit button is clicked', async () => {
    // Render the Diagnose component
    const { getByText } = render(<Diagnose info={{}} />);

    // Wait for API calls to resolve
    await waitFor(() => {});

    // Click the submit button
    fireEvent.click(getByText('SUBMIT'));

    // Wait for API calls to resolve
    await waitFor(() => {});

    // Check if add_record function is called
    expect(api.add_record).toHaveBeenCalled();
  });
});
