const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (Frontend)
app.use(express.static(__dirname));

// ==========================================
// ROTAS DA API DE TAREFAS
// ==========================================

// Obter todas as tarefas
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM munago_tasks ORDER BY "createdAt" DESC');
    // Converter 'subtasks' de volta para array JSON, pois foi salvo como string
    const tasks = result.rows.map(row => {
      try {
        row.subtasks = JSON.parse(row.subtasks || '[]');
      } catch (e) {
        row.subtasks = [];
      }
      return row;
    });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adicionar uma nova tarefa
app.post('/api/tasks', async (req, res) => {
  const { id, title, description, status, priority, category, dueDate, subtasks, createdAt, updatedAt } = req.body;
  const subtasksString = JSON.stringify(subtasks || []);

  const sql = `INSERT INTO munago_tasks (id, title, description, status, priority, category, "dueDate", subtasks, "createdAt", "updatedAt") 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`;
  
  const params = [id, title, description, status, priority, category, dueDate, subtasksString, createdAt, updatedAt];

  try {
    const result = await db.query(sql, params);
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar uma tarefa
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, category, dueDate, subtasks, updatedAt } = req.body;
  const subtasksString = JSON.stringify(subtasks || []);

  const sql = `UPDATE munago_tasks 
               SET title = $1, description = $2, status = $3, priority = $4, category = $5, "dueDate" = $6, subtasks = $7, "updatedAt" = $8 
               WHERE id = $9`;
               
  const params = [title, description, status, priority, category, dueDate, subtasksString, updatedAt, id];

  try {
    const result = await db.query(sql, params);
    res.json({ success: true, updatedID: id, changes: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir uma tarefa
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM munago_tasks WHERE id = $1', [id]);
    res.json({ success: true, deletedID: id, changes: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// ROTA DO RELATÓRIO IA (GEMINI)
// ==========================================
const { GoogleGenerativeAI } = require('@google/generative-ai');

app.post('/api/ai-report', async (req, res) => {
  try {
    const { tasks, metrics } = req.body;
    
    // Inicializar o Gemini com a chave do .env
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Chave da API do Gemini não configurada no .env' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

    const prompt = `Você é um assistente de produtividade e gestão de tarefas.
    Gere um relatório gerencial conciso, em português do Brasil, analisando as seguintes tarefas e métricas.
    Destaque:
    1. Resumo do status atual
    2. Gargalos (tarefas atrasadas ou urgentes paradas)
    3. Recomendações práticas para melhorar a produtividade.
    Responda usando formatação Markdown. Seja direto e encorajador.

    Métricas:
    - Total: ${metrics.total}
    - Em Andamento: ${metrics.inProgress}
    - Concluídas: ${metrics.done}
    - Atrasadas/Urgentes: ${metrics.urgent}

    Lista de Tarefas:
    ${JSON.stringify(tasks, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reportText = response.text();

    res.json({ report: reportText });
  } catch (err) {
    console.error("Erro na geração do relatório de IA:", err);
    
    let errorMessage = 'Erro ao gerar relatório com IA. Verifique sua chave de API e a cota do Gemini.';
    if (err.status === 503) {
      errorMessage = 'O serviço do Google Gemini está sobrecarregado no momento (Erro 503). A API que você enviou é válida, mas os servidores do Google estão lotados. Por favor, tente novamente em alguns instantes.';
    } else if (err.status === 404) {
      errorMessage = 'O modelo selecionado não está disponível para esta chave de API.';
    }

    res.status(500).json({ error: errorMessage });
  }
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`API Disponível em http://localhost:${PORT}/api/tasks`);
  console.log(`===========================================`);
});
