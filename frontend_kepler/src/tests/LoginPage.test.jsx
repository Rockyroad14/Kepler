import { describe, expect, test, vi } from 'vitest';
import {render, fireEvent, waitFor} from '@testing-library/react'
import LoginPage from '../components/LoginPage';
import { BrowserRouter } from 'react-router-dom';
import HandleLogin from '../components/HandleLogin';


// Mock the TokenValidation function
vi.mock("../components/TokenValidation")


describe('LoginPage', () => {
  test('LoginPage renders as expected', async () => {
      const {getByTestId } = render(<BrowserRouter><LoginPage /></BrowserRouter>);
      const emailInput = getByTestId("email");
      const passwordInput = getByTestId("password");

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      // expect(sum(1, 2)).toBe(3)
    })

    test('Allows email and password fields to be changed', async () => {
      const {getByTestId } = render(<BrowserRouter><LoginPage /></BrowserRouter>);
      const emailInput = getByTestId("email");
      const passwordInput = getByTestId("password");

      await waitFor(() => {
        fireEvent.change(emailInput, {target: {value: 'testuser'}});
        fireEvent.change(passwordInput, {target: {value: 'password'}});
      });

      expect(emailInput.value).toBe('testuser');
      expect(passwordInput.value).toBe('password');
    })

    test('Submits login form with info provided', async () => {
      
      vi.mock('../components/HandleLogin')

      const {getByTestId } = render(<BrowserRouter><LoginPage/></BrowserRouter>);

     
      
      const emailInput = getByTestId("email");
      const passwordInput = getByTestId("password");
      const submitForm = getByTestId("submitForm");

      await waitFor(() => {
        fireEvent.change(emailInput, {target: {value: 'testuser'}});
        fireEvent.change(passwordInput, {target: {value: 'password'}});
        fireEvent.submit(submitForm)
      });

      expect(HandleLogin).toHaveBeenCalledWith(
        'testuser', 'password'
      );

    })
  })