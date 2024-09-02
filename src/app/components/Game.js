"use client"; // Asegúrate de agregar esto al principio del archivo

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Game = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
        setCountries(response.data.data);
        selectRandomCountry(response.data.data);
      } catch (error) {
        console.error("Error fetching countries", error);
      }
    };

    fetchCountries();
  }, []);

  const selectRandomCountry = (countries) => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    const countryName = countries[randomIndex].name.toLowerCase().replace(/ /g, '');
    setSelectedCountry({
      ...countries[randomIndex],
      name: countryName
    });
    setGuessedLetters(Array(countryName.length).fill(''));
    setMessage('');
  };

  const handleGuess = (event) => {
    const letter = event.target.value.toLowerCase();
    event.target.value = '';

    if (selectedCountry.name.includes(letter)) {
      const updatedGuessedLetters = guessedLetters.map((guessedLetter, index) => 
        selectedCountry.name[index] === letter ? letter : guessedLetter
      );
      setGuessedLetters(updatedGuessedLetters);

      if (updatedGuessedLetters.join('') === selectedCountry.name) {
        setMessage('Correct! Moving to the next country...');
        setScore(score + 10);
        setTimeout(() => selectRandomCountry(countries), 2000); // Delay before moving to the next country
      }
    } else {
      setMessage('Incorrect letter, try again!');
    }
  };

  const skipCountry = () => {
    setMessage('Country skipped!');
    setTimeout(() => selectRandomCountry(countries), 1000);
  };

  const renderCountryName = () => {
    return guessedLetters.map((letter, index) => (
      <span key={index} style={{ marginRight: '5px', color: letter ? 'green' : 'black', fontSize: '24px', fontWeight: 'bold' }}>
        {letter || '_'}
      </span>
    ));
  };

  return (
    <div>
      <h1>Guess the Country</h1>
      {selectedCountry && (
        <div>
          <img src={selectedCountry.flag} alt="Country flag" style={{ width: '300px' }} />
          <div style={{ margin: '20px 0' }}>
            {renderCountryName()}
          </div>
          <input
            type="text"
            maxLength="1"
            onChange={handleGuess}
            placeholder="Enter a letter"
          />
          <div style={{ margin: '20px 0' }}>
            <button onClick={skipCountry} style={{ padding: '10px 20px', fontSize: '16px' }}>
              Skip Country
            </button>
          </div>
        </div>
      )}
      <p>Score: {score}</p>
      <p>{message}</p>
    </div>
  );
};

export default Game;
