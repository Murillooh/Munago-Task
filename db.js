require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Importante para conectar ao RDS
  }
});

pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL (AWS RDS).');
});

// Create the tasks table if it doesn't exist
const createTableText = `
  CREATE TABLE IF NOT EXISTS munago_tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT,
    priority TEXT,
    category TEXT,
    "dueDate" TEXT,
    subtasks TEXT,
    "createdAt" TEXT,
    "updatedAt" TEXT
  )
`;

pool.query(createTableText)
  .then(() => console.log('Tabela de tarefas sincronizada com a AWS.'))
  .catch(err => console.error('Erro ao criar tabela', err));

module.exports = {
  query: (text, params) => pool.query(text, params)
};
