import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchComponent from './SearchComponent';

describe('SearchComponent', () => {
  it('calls console.log with the correct search term when search button is clicked', async () => {
    // Mock console.log
    const logSpy = vi.spyOn(console, 'log');

    // Render the component
    render(<SearchComponent />);

    // Find the input element and button
    const input = screen.getByPlaceholderText('Sök efter ett ord...');
    const button = screen.getByText('Sök');

    // Simulate user typing into the input
    await userEvent.type(input, 'test search');

    // Simulate clicking the search button
    fireEvent.click(button);

    // Check if console.log was called with the correct search term
    expect(logSpy).toHaveBeenCalledWith('Searching for: test search');

    // Restore the original console.log function
    logSpy.mockRestore();
  });
});
