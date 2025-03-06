import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = "#ffff3f"; // Define fundo da página inteira
  }, []);

  const buttonStyle = {
    width: '150px',
    height: '60px',
    borderRadius: '15px',
    backgroundColor: 'yellow',
    color: 'red',
    fontSize: '18px',
    border: 'none',
    cursor: 'pointer',
    margin: '20px',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
    }}>
      <h1 style={{ marginBottom: '30px', color: 'red', fontSize: '2.5rem' }}>
        Bem-vindo a Comanda do MÉXICOOL Bar! 🍹
      </h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          style={buttonStyle} 
          onClick={() => navigate('/cozinha')}
          onMouseOver={(e) => e.target.style.backgroundColor = '#ff9500'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'yellow'}
        >
          Cozinha
        </button>
        <button 
          style={buttonStyle} 
          onClick={() => navigate('/garcom')}
          onMouseOver={(e) => e.target.style.backgroundColor = '#ff9500'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'yellow'}
        >
          Garçom
        </button>
      </div>
    </div>
  );
};

export default Home;
