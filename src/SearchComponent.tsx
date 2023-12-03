import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';

const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [definition, setDefinition] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDefinition = async (word: string) => {
    // Make call to the API, fails give error messages and empty search too
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        if (response.status === 404) {
          setDefinition('Word not found in the dictionary.');
          setAudioUrl(null);
        } else {
          throw new Error('Failed to fetch the definition.');
        }
        return;
      }
      const data = await response.json();
      const definitions = data[0].meanings.map((meaning: any) => meaning.definitions.map((def: any) => def.definition).join('\n')).join('\n\n');
      setDefinition(definitions);

      // Check if there is an audio URL and set it
      const audio = data[0].phonetics.find((phonetic: any) => phonetic.audio);
      setAudioUrl(audio ? audio.audio : null);
    } catch (error) {
      console.error('Error fetching definition:', error);
      setDefinition(null);
      setAudioUrl(null);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setErrorMessage('Please enter a word to search.');
      setDefinition(null);
      setAudioUrl(null);
      return;
    }

    setErrorMessage(null);
    fetchDefinition(searchTerm);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
   <div>
    <Container>
      <SearchInput
        type="text"
        placeholder="Search for a word..."
        value={searchTerm}
        onChange={handleChange}
      />
      <SearchButton onClick={handleSearch}>Search</SearchButton>
      </Container>

      {errorMessage && <ErrorMessage><p>{errorMessage}</p></ErrorMessage>}
      {definition && (
        <Definition>
          <h3>Definition:</h3>
          <p>{definition}</p>
        </Definition>
      )}
      {audioUrl && (
        <audio controls src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
      )}
  </div>     
  );
};

const Container = styled.div`
display: flex;
align-items: center;
justify-content: center;
`


const SearchInput = styled.input`
  padding: 10px;
  margin-right: 10px;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #4CAF50;
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const Definition = styled.div`
  margin-top: 10px;
`;


export default SearchComponent;
