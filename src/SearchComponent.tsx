import React, { useState, ChangeEvent } from 'react';

interface SearchComponentProps {
  onSearch: (searchTerm: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Sök efter ett ord..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Sök</button>
    </div>
  );
};

export default SearchComponent;
