import { expect, test } from 'vitest';
import {render} from '@testing-library/react'
import LoginPage from '../components/LoginPage';
import { BrowserRouter } from 'react-router-dom';
test('login exists', () => {
    const {getByText } = render(<BrowserRouter><LoginPage/></BrowserRouter>);
    const button = getByText("Login");
    expect(button).toBeInTheDocument();
    // expect(sum(1, 2)).toBe(3)
  })