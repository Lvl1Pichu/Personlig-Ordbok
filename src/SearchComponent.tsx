import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';

const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [definitions, setDefinitions] = useState<string[]>([]);
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDefinition = async (word: string) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Word not found in the dictionary.' : 'Failed to fetch the definition.');
      }
      const data = await response.json();
      const meanings = data[0].meanings;

      const newDefinitions = meanings.flatMap((meaning: any) => meaning.definitions.map((def: any) => def.definition));
      const newSynonyms = meanings.flatMap((meaning: any) => meaning.synonyms).flat().filter(Boolean);


      setDefinitions(newDefinitions);
      setSynonyms(newSynonyms);


      const audio = data[0].phonetics.find((phonetic: any) => phonetic.audio);
      setAudioUrl(audio ? audio.audio : null);
    } catch (error) {
      const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
      console.error('Error fetching definition:', message);
      setErrorMessage(message);
      setDefinitions([]);
      setSynonyms([]);
      setAudioUrl(null);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setErrorMessage('Please enter a word to search.');
      setDefinitions([]);
      setSynonyms([]);
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
      <Content>
        <Column>
          {definitions.length > 0 && (
            <Definition>
              <Header>Definition:</Header>
              {definitions.map((def, index) => <p key={index}>{def}</p>)}
            </Definition>
          )}
        </Column>
        <Column>
          {synonyms.length > 0 && (
            <Synonyms>
              <Header>Synonyms:</Header>
              <p>{synonyms.join(', ')}</p>
            </Synonyms>
          )}
        </Column>
      </Content>
      {audioUrl && (
        <AudioContainer>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </AudioContainer>
      )}
      {errorMessage && <ErrorMessage><p>{errorMessage}</p></ErrorMessage>}
    </div>
  );
};

const Content = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const Column = styled.div`
  flex: 1;
  padding: 0 10px;
`;


const AudioContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;


const Header = styled.h3`
font-weight: bold;
`

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

const Synonyms = styled(Definition)``;


export default SearchComponent;
