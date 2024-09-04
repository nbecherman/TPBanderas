"use client"; // Asegúrate de agregar esto al principio del archivo

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Juego = () => {
  const [paises, setPaises] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [puntos, setPuntos] = useState(0);
  const [letrasAdivinadas, setLetrasAdivinadas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [paisesCorrectos, setPaisesCorrectos] = useState([]);
  const [paisesIncorrectos, setPaisesIncorrectos] = useState([]);

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
        setPaisesCorrectos([...paisesCorrectos, paisSeleccionado.flag]); // Añade la bandera a la lista de correctos
        setTimeout(() => seleccionarPaisAleatorio(paises), 2000); // Retardo antes de pasar al siguiente país
      }
    } else {
      setMensaje('Letra incorrecta, ¡intenta de nuevo!');
    }
  };

  const saltarPais = () => {
    setMensaje('¡País saltado!');
    setPuntos(puntos > 0 ? puntos - 5 : 0); // Resta 5 puntos, pero no permite que los puntos sean negativos.
    setPaisesIncorrectos([...paisesIncorrectos, paisSeleccionado.flag]); // Añade la bandera a la lista de incorrectos
    setTimeout(() => seleccionarPaisAleatorio(paises), 1000);
  };

  const renderizarNombrePais = () => {
    return letrasAdivinadas.map((letra, indice) => (
      <span key={indice} style={{ marginRight: '5px', color: letra ? 'green' : 'black', fontSize: '24px', fontWeight: 'bold' }}>
        {letra || '_'}
      </span>
    ));
  };

  const renderizarBanderasCorrectas = () => {
    return (
      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
        {paisesCorrectos.map((bandera, indice) => (
          <img key={indice} src={bandera} alt={`Bandera del país ${indice + 1}`} style={{ width: '50px' }} />
        ))}
      </div>
    );
  };

  const renderizarBanderasIncorrectas = () => {
    return (
      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
        {paisesIncorrectos.map((bandera, indice) => (
          <img key={indice} src={bandera} alt={`Bandera incorrecta del país ${indice + 1}`} style={{ width: '50px', filter: 'grayscale(100%)' }} />
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh', position: 'relative' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Adivina el País</h1>
      {renderizarBanderasCorrectas()} {/* Renderiza las banderas correctas en la parte superior izquierda */}
      {renderizarBanderasIncorrectas()} {/* Renderiza las banderas incorrectas en la parte superior derecha */}
      {paisSeleccionado && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <img src={paisSeleccionado.flag} alt="Bandera del país" style={{ width: '300px', border: '1px solid #ddd', borderRadius: '10px' }} />
          <div style={{ margin: '20px 0' }}>
            {renderizarNombrePais()}
          </div>
          <input
            type="text"
            maxLength="1"
            onChange={manejarAdivinanza}
            placeholder="Ingresa una letra"
            style={{ padding: '10px', fontSize: '18px', borderRadius: '5px', border: '1px solid #ddd', width: '50%' }}
          />
          <div style={{ margin: '20px 0' }}>
            <button onClick={saltarPais} style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Saltar País
            </button>
          </div>
        </div>
      )}
      <p style={{ textAlign: 'center', fontSize: '18px', color: '#333' }}>Puntos: {puntos}</p>
      <p style={{ textAlign: 'center', fontSize: '18px', color: '#d9534f' }}>{mensaje}</p>
    </div>
  );
};

export default Juego;
