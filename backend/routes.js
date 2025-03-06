import express from 'express';
import { supabase } from './supabaseClient.js';

const router = express.Router();

// Criar as mesas no banco de dados por padrão (20 mesas)
router.post('/mesas/setup', async (req, res) => {
    try {
        for (let i = 1; i <= 20; i++) {
            const { error } = await supabase.from('mesas').insert([{ numero: i }]);
            if (error) {
                console.log(`Erro ao inserir mesa ${i}:`, error.message);
            } else {
                console.log(`Mesa ${i} criada com sucesso!`);
            }
        }
        res.status(201).json({ message: '20 mesas criadas com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cadastrar múltiplos produtos
router.post('/produtos', async (req, res) => {
    const produtos = req.body;

    if (!Array.isArray(produtos) || produtos.length === 0) {
        return res.status(400).json({ error: 'O corpo da requisição deve conter uma lista de produtos' });
    }

    // Validar que cada produto tem o campo nome e preço
    for (const produto of produtos) {
        if (!produto.nome || !produto.preco_unitario) {
            return res.status(400).json({ error: 'Cada produto deve conter nome e preço unitário' });
        }
    }

    const { data, error } = await supabase.from('produtos').insert(produtos).select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// Listar todas as mesas
router.get('/mesas', async (req, res) => {
    const { data, error } = await supabase.from('mesas').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Remover uma mesa
router.delete('/mesas/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('mesas').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: `Mesa ${id} removida com sucesso.` });
});

// Criar uma nova comanda para um cliente em uma mesa
router.post('/comandas', async (req, res) => {
    const { mesa_id, cliente_nome } = req.body;
    
    if (!mesa_id || !cliente_nome) {
        return res.status(400).json({ error: 'Mesa e nome do cliente são obrigatórios' });
    }

    const { data, error } = await supabase
        .from('comandas')
        .insert([{ mesa_id, cliente_nome, status: 'aberta' }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// Adicionar um pedido a uma comanda existente
router.post('/pedidos', async (req, res) => {
    const { comanda_id, produto_id, quantidade, observacao } = req.body;
    
    if (!comanda_id || !produto_id || !quantidade) {
        return res.status(400).json({ error: 'Comanda, produto e quantidade são obrigatórios' });
    }

    const { data, error } = await supabase
        .from('pedidos')
        .insert([{ comanda_id, produto_id, quantidade, observacao }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// Listar todas as comandas de uma mesa
router.get('/pedidos', async (req, res) => {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        produtos (nome),
        comandas (mesa_id, cliente_nome, mesas (numero))
      `)
      .eq('pronto', false);
  
    if (error) {
      console.error('Erro ao buscar pedidos:', error.message);
      return res.status(500).json({ error: error.message });
    }
  
    console.log('Pedidos não prontos:', data);
    res.status(200).json(data);
  });


// Fechar uma comanda e calcular o total
router.put('/comandas/:comanda_id/fechar', async (req, res) => {
    const { comanda_id } = req.params;
    
    // Obter os pedidos da comanda, buscando o preço unitário do produto relacionado
    const { data: pedidos, error: pedidosError } = await supabase
        .from('pedidos')
        .select('quantidade, produtos:produto_id(preco_unitario)')
        .eq('comanda_id', comanda_id);
    
    if (pedidosError) return res.status(500).json({ error: pedidosError.message });

    // Calcular o total com base na quantidade e no preço unitário
    const total = pedidos.reduce((acc, pedido) => {
        return acc + (pedido.quantidade * pedido.produtos.preco_unitario);
    }, 0);
    
    // Atualizar o status da comanda para "pago" e salvar o total calculado
    const { error: updateError } = await supabase
        .from('comandas')
        .update({ status: 'pago', total })
        .eq('id', comanda_id);
    
    if (updateError) return res.status(500).json({ error: updateError.message });
    
    res.status(200).json({ message: 'Comanda fechada', total });
});

export default router;
