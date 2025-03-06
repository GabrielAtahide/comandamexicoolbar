import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Cozinha from './pages/cozinha'; // Importe a página da Cozinha
import Garcom from './pages/Garcom'; // Importe a página do Garçom

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cozinha" element={<Cozinha />} /> {/* Rota da Cozinha */}
        <Route path="/garcom" element={<Garcom />} /> {/* Rota do Garçom */}
        <Route path="*" element={<Navigate to="/" />} /> {/* Redireciona para Home caso a rota não exista */}
      </Routes>
    </Router>
  );
}

export default App;