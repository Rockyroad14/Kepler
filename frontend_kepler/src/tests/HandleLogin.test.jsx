import { afterEach, describe, expect, test, vi } from 'vitest';
import HandleLogin from '../components/HandleLogin';

describe('HandleLogin', () => {
    
    afterEach(() => {
        globalThis.fetch.mockClear // Restore original fetch function
    });

    test('HandleLogin works as expected', async () => {
        
        globalThis.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: 'mockToken' }),
        });

        // Mock localStorage.setItem
       vi.spyOn(Storage.prototype, 'setItem')
       Storage.prototype.setItem = vi.fn()


        await HandleLogin('test@example.com', 'testpassword');

        expect(localStorage.setItem).toHaveBeenCalledWith('kepler-token', 'mockToken');

        
        
    }) 
})