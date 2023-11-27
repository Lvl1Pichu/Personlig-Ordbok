import React, { useState, ChangeEvent } from 'react';

const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [definition, setDefinition] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDefinition = async (word: string) => {
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
      <input
        type="text"
        placeholder="Sök efter ett ord..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Sök</button>
      {errorMessage && (
        <div style={{ color: 'red' }}>
          <p>{errorMessage}</p>
        </div>
      )}
      {definition && (
        <div>
          <h3>Definition:</h3>
          <p>{definition}</p>
        </div>
      )}
      {audioUrl && (
        <div>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
