import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import UserForm from './userform';

const mock = new MockAdapter(axios);

// ✅ Mock window.location to prevent JSDOM errors
delete window.location;
window.location = { href: jest.fn() };

describe('UserForm Component Tests', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('should submit form data successfully', async () => {
    mock.onPost('http://localhost:5000/user').reply(200);

    render(<UserForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter your username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'testuser@example.com' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(window.location.href).toBe("http://localhost:3000/waitingroom");
    });
  });
});
