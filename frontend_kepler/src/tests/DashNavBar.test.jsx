import { afterEach, describe, expect, test, vi } from 'vitest';
import { getByText, render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import DashNavbar from '../components/DashNavbar';
import { act } from 'react-dom/test-utils';
import getUserRole from '../components/getUserRole';

vi.mock("../components/getUserRole", () => ({
  default: vi.fn()
}))

describe('DashNavBar', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // Deprecated
            removeListener: vi.fn(), // Deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          })),
        });
      });
    
    afterEach(() => {
        globalThis.fetch.mockClear // Restore original fetch function
    });

    test('DashNavBar renders Admin tab if user is Admin', async () => {

        getUserRole.mockReturnValue(true);

        var renderer
        
        await act(async () => { 
          renderer = render(<BrowserRouter><DashNavbar /></BrowserRouter>);
        })

        const text = renderer.getByText("Admin");

        // expect(getUserRole).();
        expect(text).toBeInTheDocument()

        
        
    }) 

    test('DashNavBar does not render Admin if user is not Admin', async () => {

      getUserRole.mockReturnValue(false);

      var renderer
      
      await act(async () => { 
        renderer = render(<BrowserRouter><DashNavbar /></BrowserRouter>);
      })

      const text = screen.queryByText("Admin");

      expect(text).not.toBeInTheDocument()

      
      
  }) 
})