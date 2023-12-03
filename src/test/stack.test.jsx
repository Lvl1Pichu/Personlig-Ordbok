import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // Import waitFor here
import userEvent from '@testing-library/user-event';
import SearchComponent from '../SearchComponent';

describe('SearchComponent Rendering on Screen', () => {
  test('renders input and search button', () => {
    render(<SearchComponent />);
    expect(screen.getByPlaceholderText('Search for a word...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
});

describe('SearchComponent State Management', () => {
  test('updates searchTerm on input change', () => {
    render(<SearchComponent />);
    const input = screen.getByPlaceholderText('Search for a word...');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(input.value).toBe('hello');
  });
});

describe('SearchComponent Event Handling', () => {
  test('calls handleSearch on button click', async () => {
    render(<SearchComponent />);
    const input = screen.getByPlaceholderText('Search for a word...');
    userEvent.type(input, 'hello');
    const button = screen.getByRole('button', { name: /search/i }); // Corrected button text
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
                  { definition: "Hello!" }
                ]
              }
            ],
            phonetics: [{ audio: 'some-audio-url' }]
          }
        ]),
      })
    );

    render(<SearchComponent />);
    const input = screen.getByPlaceholderText('Search for a word...');
    userEvent.type(input, 'Hello');
    const button = screen.getByRole('button', { name: /search/i });
    userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Hello!")).toBeInTheDocument();
    });

    // Check if the fetch was called correctly
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`https://api.dictionaryapi.dev/api/v2/entries/en/Hello`);
  });
});



describe('SearchComponent Error Handling', () => {
  test('displays error message on fetch failure', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    render(<SearchComponent />);
    const input = screen.getByPlaceholderText('Search for a word...');
    userEvent.type(input, 'hello');
    const button = screen.getByRole('button', { name: /search/i });
    userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});


describe('SearchComponent Error Handling', () => {
  test('displays error message on empty search', async () => {
    render(<SearchComponent />);
    
    // Simulate a click on the search button without typing anything
    const button = screen.getByRole('button', { name: /search/i });
    userEvent.click(button);

    // Wait for the error message to be displayed
    const errorMessage = await screen.findByText('Please enter a word to search.');
    expect(errorMessage).toBeInTheDocument();
  });
});

