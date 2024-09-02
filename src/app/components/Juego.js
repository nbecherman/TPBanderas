"use client"; // Asegúrate de agregar esto al principio del archivo

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Juego = () => {
  const [paises, setPaises] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [puntos, setPuntos] = useState(0);
  const [letrasAdivinadas, setLetrasAdivinadas] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const obtenerPaises = async () => {
      try {
        const respuesta = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
        setPaises(respuesta.data.data);
        seleccionarPaisAleatorio(respuesta.data.data);
      } catch (error) {
        console.error("Error al obtener los países", error);
      }
    };

    obtenerPaises();
  }, []);

  const seleccionarPaisAleatorio = (paises) => {
    const indiceAleatorio = Math.floor(Math.random() * paises.length);
    const nombrePais = paises[indiceAleatorio].name.toLowerCase().replace(/ /g, '');
    setPaisSeleccionado({
      ...paises[indiceAleatorio],
      name: nombrePais
    });
    setLetrasAdivinadas(Array(nombrePais.length).fill(''));
    setMensaje('');
  };

  const manejarAdivinanza = (event) => {
    const letra = event.target.value.toLowerCase();
    event.target.value = '';

    if (paisSeleccionado.name.includes(letra)) {
      const letrasActualizadas = letrasAdivinadas.map((letraAdivinada, indice) => 
        paisSeleccionado.name[indice] === letra ? letra : letraAdivinada
      );
      setLetrasAdivinadas(letrasActualizadas);

      if (letrasActualizadas.join('') === paisSeleccionado.name) {
        setMensaje('¡Correcto! Pasando al siguiente país...');
        setPuntos(puntos + 10);
        setTimeout(() => seleccionarPaisAleatorio(paises), 2000); // Retardo antes de pasar al siguiente país
      }
    } else {
      setMensaje('Letra incorrecta, ¡intenta de nuevo!');
    }
  };

  const saltarPais = () => {
    setMensaje('¡País saltado!');
    setTimeout(() => seleccionarPaisAleatorio(paises), 1000);
  };

  const renderizarNombrePais = () => {
    return letrasAdivinadas.map((letra, indice) => (
      <span key={indice} style={{ marginRight: '5px', color: letra ? 'green' : 'black', fontSize: '24px', fontWeight: 'bold' }}>
        {letra || '_'}
      </span>
    ));
  };

  return (
    <div>
      <h1>Adivina el País</h1>
      {paisSeleccionado && (
        <div>
          <img src={paisSeleccionado.flag} alt="Bandera del país" style={{ width: '300px' }} />
          <div style={{ margin: '20px 0' }}>
            {renderizarNombrePais()}
          </div>
          <input
            type="text"
            maxLength="1"
            onChange={manejarAdivinanza}
            placeholder="Ingresa una letra"
          />
          <div style={{ margin: '20px 0' }}>
            <button onClick={saltarPais} style={{ padding: '10px 20px', fontSize: '16px' }}>
              Saltar País
            </button>
          </div>
        </div>
      )}
      <p>Puntos: {puntos}</p>
      <p>{mensaje}</p>
    </div>
  );
};

export default Juego;