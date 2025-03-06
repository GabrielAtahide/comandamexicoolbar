import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adicione o prefixo, se necessário'; // Altere para a URL do seu backend

// Listar todas as mesas
export const fetchMesas = async () => {
  try {
    const response = await axios.get(`${API_URL}/mesas`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar mesas:', error);
    throw error;
  }
};

// Criar uma nova comanda
export const createComanda = async (mesa_id, cliente_nome) => {
  try {
    console.log('Dados enviados para criar comanda:', { mesa_id, cliente_nome });
    const response = await axios.post(`${API_URL}/comandas`, { mesa_id, cliente_nome });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar comanda:', error);
    throw error;
  }
};

// Adicionar um pedido a uma comanda
export const addPedido = async (comanda_id, produto_id, quantidade, observacao) => {
  try {
    console.log('Dados enviados para adicionar pedido:', { comanda_id, produto_id, quantidade, observacao });
    const response = await axios.post(`${API_URL}/pedidos`, { comanda_id, produto_id, quantidade, observacao });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar pedido:', error);
    throw error;
  }
};

// Listar comandas de uma mesa
export const fetchComandasByMesa = async (mesa_id) => {
  try {
    const response = await axios.get(`${API_URL}/comandas/${mesa_id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar comandas:', error);
    throw error;
  }
};

// Fechar uma comanda
export const fecharComanda = async (comanda_id) => {
  try {
    const response = await axios.put(`${API_URL}/comandas/${comanda_id}/fechar`);
    return response.data;
  } catch (error) {
    console.error('Erro ao fechar comanda:', error);
    throw error;
  }
};

// Listar todos os pedidos não prontos
export const fetchPedidosCozinha = async () => {
  try {
    const response = await axios.get(`${API_URL}/pedidos`);
    return response.data;  // Certifique-se de retornar os dados da resposta corretamente
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;  // Re-throw o erro para ser tratado no componente
  }
};


// Atualizar o status de um pedido para "pronto"
export const atualizarStatusPedido = async (id, pronto) => {
  try {
    const response = await axios.put(`${API_URL}/pedidos/${id}/status`, { pronto });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    throw error;
  }
};