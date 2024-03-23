import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {render, fireEvent, waitFor, cleanup} from '@testing-library/react'
import LoginPage from '../components/LoginPage';
import { BrowserRouter, MemoryRouter, useNavigate } from 'react-router-dom';
import HandleLogin from '../components/HandleLogin';
import TokenValidation from '../components/TokenValidation';
import { act } from 'react-dom/test-utils';


// Mock the TokenValidation function
vi.mock("../components/TokenValidation", () => ({
  default: vi.fn()
}))


vi.mock('../components/HandleLogin', () => ({
  default: vi.fn()
}))

const mockedUsedNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  BrowserRouter: ({ children }) => <div>{children}</div>, // Mock BrowserRouter
  MemoryRouter: ({ children }) => <div>{children}</div>, // Mock BrowserRouter
  
}));




describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUsedNavigate.mockReset();
    

  })

  // afterEach(() => {
  //   window.location.href = 'http://localhost:3000/'
  // })

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

    test('Navigates to dashboard if successful login', async () => {

  
      // for some reason fireEvent submit bypasses the react bootstrap checks so ignore that
      const {getByTestId } = render(<BrowserRouter><LoginPage/></BrowserRouter>);
      const submitForm = getByTestId("submitForm");

      HandleLogin.mockResolvedValue(true);

      await waitFor(() => {
        fireEvent.submit(submitForm)
      });

      

      expect(mockedUsedNavigate).toHaveBeenCalledWith("/dashboard");

    })

    test('Does not navigate to dashboard on unsuccessful login', async () => {
      
       // for some reason fireEvent submit bypasses the react bootstrap checks so ignore that
      const {getByTestId } = render(<BrowserRouter><LoginPage/></BrowserRouter>);
      const submitForm = getByTestId("submitForm");

      HandleLogin.mockResolvedValue(false);

      await waitFor(() => {
        fireEvent.submit(submitForm)
      });

      

      expect(mockedUsedNavigate).not.toHaveBeenCalled();

    })

    test('Existing login token redirects you to dashboard', async () => {

      TokenValidation.mockReturnValue(true);
      
      
      // for some reason fireEvent submit bypasses the react bootstrap checks so ignore that
      await act(async () => {
        render(<MemoryRouter><LoginPage/></MemoryRouter>);
      })

      
      expect(TokenValidation).toHaveBeenCalled()
      expect(mockedUsedNavigate).toHaveBeenCalled();
      // expect(window.location.pathname).toBe("/dashboard")
       
   })
    
  })