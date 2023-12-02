import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchComponent from '../SearchComponent';

describe('SearchComponent Rendering on Screen', () => {
  test('renders input and search button', () => {
    render(<SearchComponent />);
    expect(screen.getByPlaceholderText('Sök efter ett ord...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sök/i })).toBeInTheDocument();
  });
});

describe('SearchComponent State Management', () => {
  test('updates searchTerm on input change', () => {
    render(<SearchComponent />);
    const input = screen.getByPlaceholderText('Sök efter ett ord...');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(input.value).toBe('hello');
  });
});

describe('SearchComponent Event Handling', () => {
  test('calls handleSearch on button click', async () => {
    render(<SearchComponent />);
    const input = screen.getByPlaceholderText('Sök efter ett ord...');
    userEvent.type(input, 'hello');
    const button = screen.getByRole('button', { name: /sök/i });
    userEvent.click(button);
    // Additional assertions or wait operations might be required here
  });
});

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ /* Mocked response data */ }),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe('SearchComponent API Interaction', () => {
  test('fetches data on search', async () => {
    // Mock the fetch call
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          {
            meanings: [
              {
                definitions: [
                  { definition: "Hello!" } // Mock a simpler version for the test
                ]
              }
            ],
            phonetics: [{ audio: 'some-audio-url' }]
          }
        ]),
      })
    );

    render(<SearchComponent />);
    const input = screen.getByPlaceholderText('Sök efter ett ord...');
    userEvent.type(input, 'Hello');
    const button = screen.getByRole('button', { name: /sök/i });
    userEvent.click(button);

    // Check if the mocked definition text appears in the document
    const definitionText = await screen.findByText((content, element) => 
    element.textContent === "Hello!"
  );    expect(definitionText).toBeInTheDocument();

    // Check if the fetch was called correctly
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`https://api.dictionaryapi.dev/api/v2/entries/en/hello`);
  });
});

describe('SearchComponent Error Handling', () => {
  test('displays error message on fetch failure', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    render(<SearchComponent />);
    const input = screen.getByPlaceholderText('Sök efter ett ord...');
    userEvent.type(input, 'hello');
    const button = screen.getByRole('button', { name: /sök/i });
    userEvent.click(button);

    const errorMessage = await screen.findByText(/* Correct error message text */);
    expect(errorMessage).toBeInTheDocument();
  });
});

describe('SearchComponent Error Handling', () => {
  test('displays error message on empty search', async () => {
    render(<SearchComponent />);
    
    // Simulate a click on the search button without typing anything
    const button = screen.getByRole('button', { name: /sök/i });
    userEvent.click(button);

    // Wait for the error message to be displayed
    const errorMessage = await screen.findByText('Please enter a word to search.');
    expect(errorMessage).toBeInTheDocument();
  });
});

