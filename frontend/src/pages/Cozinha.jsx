import React, { useEffect, useState } from 'react';
import { fetchPedidosCozinha, atualizarStatusPedido } from '../services/Api';
import './Cozinha.css';

const Cozinha = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosProcessados, setPedidosProcessados] = useState([]);

  useEffect(() => {
    const loadPedidos = async () => {
      try {
        const data = await fetchPedidosCozinha();  
        console.log(data); // Verifica a estrutura dos dados
        setPedidos(data);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      }
    };
    loadPedidos();
  }, []);

  const handleMarcarPronto = async (id) => {
    try {
      await atualizarStatusPedido(id, true);
      setPedidosProcessados([...pedidosProcessados, id]);
      const data = await fetchPedidosCozinha();
      setPedidos(data);
    } catch (error) {
      console.error('Erro ao marcar pedido como pronto:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Cozinha</h1>
      <h2>Pedidos Pendentes</h2>
      {pedidos.length === 0 ? (
        <p>Nenhum pedido pendente.</p>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="pedido-card"
              style={{
                backgroundColor: pedidosProcessados.includes(pedido.id) ? '#e0f7fa' : 'white',
              }}
            >
              <h3>Pedido #{pedido.id}</h3>
              <p>
                <strong>Mesa:</strong> {pedido.comandas?.mesa_id || 'Mesa não encontrada'}
              </p>
              <p>
                <strong>Produto:</strong> {pedido.produtos?.nome || 'Produto não encontrado'}
              </p>
              <p>
                <strong>Quantidade:</strong> {pedido.quantidade}
              </p>
              <p>
                <strong>Observação:</strong> {pedido.observacao || 'Nenhuma observação'}
              </p>
              <button onClick={() => handleMarcarPronto(pedido.id)}>
                Marcar como Pronto
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cozinha;
