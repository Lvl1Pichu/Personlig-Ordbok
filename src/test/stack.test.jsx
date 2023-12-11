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

describe('Can write in the SearchBar', () => {
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
    const user = userEvent.setup(); // Få en user som hanterar async events
    const input = screen.getByPlaceholderText('Search for a word...');
    await user.type(input, 'Hello');
    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Hello!", {exact : false})).toBeInTheDocument();
    });

    //expects för synonymer/definitoner/osv

    //Expect audioelement
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

