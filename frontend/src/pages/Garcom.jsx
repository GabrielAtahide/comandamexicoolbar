import React, { useEffect, useState } from 'react';
import { fetchMesas, createComanda, fetchComandasByMesa, addPedido, fecharComanda } from '../services/Api';
import './Garcom.css';

const Garcom = () => {
  const [mesas, setMesas] = useState([]);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [clienteNome, setClienteNome] = useState('');
  const [novoPedido, setNovoPedido] = useState({ produto_id: '', quantidade: 1, observacao: '' });
  const [comandas, setComandas] = useState([]);
  const [selectedComanda, setSelectedComanda] = useState(null);
  const [totalComanda, setTotalComanda] = useState(null);

  // Busca as mesas ao carregar a página
  useEffect(() => {
    const loadMesas = async () => {
      try {
        const data = await fetchMesas();
        setMesas(data);
      } catch (error) {
        console.error('Erro ao carregar mesas:', error);
      }
    };
    loadMesas();
  }, []);

  // Busca as comandas de uma mesa selecionada
  const handleMesaClick = async (mesa) => {
    if (selectedMesa?.id === mesa.id) {
      setSelectedMesa(null);
      setComandas([]);
      setSelectedComanda(null);
    } else {
      setSelectedMesa(mesa);
      try {
        const data = await fetchComandasByMesa(mesa.id);
        setComandas(data);
      } catch (error) {
        console.error('Erro ao carregar comandas:', error);
      }
    }
  };

  // Cria uma nova comanda
  const handleCreateComanda = async () => {
    if (!selectedMesa || !clienteNome) {
      alert('Por favor, insira o nome do cliente.');
      return;
    }
    try {
      const data = await createComanda(selectedMesa.id, clienteNome);
      setComandas([...comandas, data]);
      setClienteNome('');
    } catch (error) {
      console.error('Erro ao criar comanda:', error);
    }
  };

  // Adiciona um pedido a uma comanda
  const handleAddPedido = async () => {
    if (!selectedComanda || !novoPedido.produto_id || !novoPedido.quantidade) {
      alert('Por favor, selecione uma comanda, um produto e insira a quantidade.');
      return;
    }
    try {
      const data = await addPedido(selectedComanda.id, novoPedido.produto_id, novoPedido.quantidade, novoPedido.observacao);
      setComandas(comandas.map(comanda => {
        if (comanda.id === selectedComanda.id) {
          const pedidos = Array.isArray(comanda.pedidos) ? comanda.pedidos : [];
          return { ...comanda, pedidos: [...pedidos, data] };
        }
        return comanda;
      }));
      setNovoPedido({ produto_id: '', quantidade: 1, observacao: '' });
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error);
    }
  };

  // Fecha uma comanda
  const handleFecharComanda = async (comanda_id) => {
    try {
      const data = await fecharComanda(comanda_id);
      setComandas(comandas.map(comanda => comanda.id === comanda_id ? { ...comanda, status: 'pago', total: data.total } : comanda));
      setTotalComanda(data.total); // Armazena o total
    } catch (error) {
      console.error('Erro ao fechar comanda:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Página do Garçom</h1>
      <div className="mesas-grid">
        {mesas.map(mesa => (
          <button
            key={mesa.id}
            className="mesa-item"
            onClick={() => handleMesaClick(mesa)}
          >
            Mesa {mesa.numero}
          </button>
        ))}
      </div>

      {selectedMesa && (
        <div className="mesa-detalhes">
          <h2>Mesa {selectedMesa.numero}</h2>
          <div>
            <h3>Comandas</h3>
            {comandas.length === 0 ? (
              <p>Nenhuma comanda encontrada.</p>
            ) : (
              comandas.map(comanda => (
                <div
                  key={comanda.id}
                  className={`comanda-card ${selectedComanda?.id === comanda.id ? 'selected' : ''}`}
                  onClick={() => setSelectedComanda(comanda)}
                >
                  <p><strong>Cliente:</strong> {comanda.cliente_nome}</p>
                  <p><strong>Status:</strong> {comanda.status}</p>
                  <button onClick={() => handleFecharComanda(comanda.id)}>Fechar Comanda</button>
                </div>
              ))
            )}
          </div>
          <div>
            <h3>Criar Comanda</h3>
            <input
              type="text"
              placeholder="Nome do Cliente"
              value={clienteNome}
              onChange={(e) => setClienteNome(e.target.value)}
            />
            <button onClick={handleCreateComanda}>Criar Comanda</button>
          </div>
          {selectedComanda && (
            <div>
              <h3>Adicionar Pedido à Comanda de {selectedComanda.cliente_nome}</h3>
              <input
                type="text"
                placeholder="Produto ID"
                value={novoPedido.produto_id}
                onChange={(e) => setNovoPedido({ ...novoPedido, produto_id: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantidade"
                value={novoPedido.quantidade}
                onChange={(e) => setNovoPedido({ ...novoPedido, quantidade: e.target.value })}
              />
              <input
                type="text"
                placeholder="Observação"
                value={novoPedido.observacao}
                onChange={(e) => setNovoPedido({ ...novoPedido, observacao: e.target.value })}
              />
              <button onClick={handleAddPedido}>Adicionar Pedido</button>
            </div>
          )}
          {selectedComanda && selectedComanda.status === 'pago' && (
            <div className="total-card">
              <h3>Total da Comanda</h3>
              <p>R$ {totalComanda?.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Garcom;