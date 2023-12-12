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

describe('Can write in the SearchComponent', () => {
  test('updates searchTerm on input change', async () => {
    render(<SearchComponent />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Search for a word...');
    await user.type(input, 'Hello');
    expect(input.value).toBe('Hello');
  });
});

describe('SearchComponent API Interaction', () => {
  test('fetches data on search', async () => {
    render(<SearchComponent />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Search for a word...');
    await user.type(input, 'Hello');
    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    await waitFor(() => {
      //Expect definition
      expect(screen.getByText("Hello!", {exact : false})).toBeInTheDocument();
      //Expect Synonym
      expect(screen.getByText('greeting')).toBeInTheDocument();
      //Expect audio element
      expect(screen.getByTestId('audio-player')).toBeInTheDocument  
    });
  });
});


describe('SearchComponent Handling Empty Search', () => {
  test('displays error message on empty search', async () => {
    render(<SearchComponent />);
    const button = screen.getByRole('button', { name: /search/i });
    userEvent.click(button);
    const errorMessage = await screen.findByText('Please enter a word to search.');
    expect(errorMessage).toBeInTheDocument();
  });
});


describe('SearchComponent Error Handling', () => {
  test('displays error message when no word matches the search', async () => {
    render(<SearchComponent />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Search for a word...');
    const button = screen.getByRole('button', { name: /search/i });
    await user.type(input, 'Hellfgjgj');
    await user.click(button);

    const errorMessage = await screen.findByText('Word not found in the dictionary.');
    expect(errorMessage).toBeInTheDocument();
  });
});
