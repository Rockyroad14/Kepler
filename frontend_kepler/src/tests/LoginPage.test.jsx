import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {render, fireEvent, waitFor, cleanup} from '@testing-library/react'
import LoginPage from '../components/LoginPage';
import { BrowserRouter } from 'react-router-dom';
import HandleLogin from '../components/HandleLogin';


// Mock the TokenValidation function
vi.mock("../components/TokenValidation")
vi.mock('../components/HandleLogin')


describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })
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
      
      

      const {getByTestId } = render(<BrowserRouter><LoginPage/></BrowserRouter>);

     
      
      const emailInput = getByTestId("email");
      const passwordInput = getByTestId("password");
      const submitForm = getByTestId("submitForm");

      await waitFor(() => {
        fireEvent.change(emailInput, {target: {value: 'email@email.com'}});
        fireEvent.change(passwordInput, {target: {value: 'password'}});
        fireEvent.submit(submitForm)
      });

      expect(HandleLogin).toHaveBeenCalledWith(
        'email@email.com', 'password'
      );

    })

    test('Gives error if improper email', async () => {
      
      

      const {getByTestId, getByText } = render(<BrowserRouter><LoginPage/></BrowserRouter>);

     
      
      const emailInput = getByTestId("email");
      const passwordInput = getByTestId("password");
      const submitForm = getByTestId("submitForm");

      await waitFor(() => {
        fireEvent.submit(submitForm)
      });

      expect(HandleLogin).toBeCalled()

    
      
      

    })
  })