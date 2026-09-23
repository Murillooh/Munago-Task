/**
 * TaskFlow - Store & State Management
 * Gerenciamento centralizado de tarefas, persistência e métricas
 */

const STORAGE_KEY = 'taskflow_data_v1';
const THEME_KEY = 'taskflow_theme';

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Planejamento da Arquitetura do Sistema',
    description: 'Definir estrutura modular, padrões de código e convenções de nomenclatura para a base.',
    status: 'in_progress',
    priority: 'urgent',
    category: 'Trabalho',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0], // Amanhã
    subtasks: [
      { text: 'Mapear requisitos funcionais', done: true },
      { text: 'Definir modelo de dados e store', done: true },
      { text: 'Prototipar layout responsivo', done: false }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: 'task-2',
    title: 'Implementar Componentes do Kanban Board',
    description: 'Criar visualização em 3 colunas com arrastar e soltar (Drag and Drop nativo) e contadores automáticos.',
    status: 'todo',
    priority: 'high',
    category: 'Desenvolvimento',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString().split('T')[0],
    subtasks: [
      { text: 'Criar markup das colunas', done: false },
      { text: 'Adicionar eventos dragstart e drop', done: false }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'task-3',
    title: 'Estudo de CSS Moderno e Glassmorphism',
    description: 'Aprender novas diretivas de estilização, backdrop-filter e animações fluidas para UI premium.',
    status: 'in_progress',
    priority: 'medium',
    category: 'Estudos',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString().split('T')[0],
    subtasks: [
      { text: 'Pesquisar paletas HSL e temas escuros', done: true },
      { text: 'Praticar micro-transições CSS', done: false }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'task-4',
    title: 'Configurar Backup e Exportação JSON',
    description: 'Garantir que o usuário possa fazer download e upload dos dados com um clique de forma confiável.',
    status: 'done',
    priority: 'low',
    category: 'Segurança',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0],
    subtasks: [
      { text: 'Criar função de exportação Blob', done: true },
      { text: 'Validar parse de arquivo importado', done: true }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString()
  }
];

class TaskStore {
  constructor() {
    this.tasks = this.loadTasks();
    this.listeners = [];
    this.theme = localStorage.getItem(THEME_KEY) || 'dark';
    this.viewMode = 'kanban'; // 'kanban' | 'list'
    this.filters = {
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      sortBy: 'dueDate' // 'dueDate' | 'priority' | 'createdAt'
    };
  }

  // Persistência
  loadTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Falha ao carregar do LocalStorage:', e);
    }
    this.saveTasks(INITIAL_TASKS);
    return INITIAL_TASKS;
  }

  saveTasks(tasksToSave = this.tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (e) {
      console.error('Erro ao salvar no LocalStorage:', e);
    }
  }

  // Notificador reativo de ouvintes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveTasks();
    this.listeners.forEach(fn => fn(this));
  }

  // CRUD Tarefas
  addTask(taskData) {
    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      category: taskData.category ? taskData.category.trim() : 'Geral',
      dueDate: taskData.dueDate || '',
      subtasks: taskData.subtasks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.unshift(newTask);
    this.notify();
    return newTask;
  }

  updateTask(id, updatedFields) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks[index] = {
        ...this.tasks[index],
        ...updatedFields,
        updatedAt: new Date().toISOString()
      };
      this.notify();
      return this.tasks[index];
    }
    return null;
  }

  deleteTask(id) {
    const prevLen = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    if (this.tasks.length !== prevLen) {
      this.notify();
      return true;
    }
    return false;
  }

  moveTaskStatus(id, newStatus) {
    const task = this.getTaskById(id);
    if (task && task.status !== newStatus) {
      task.status = newStatus;
      task.updatedAt = new Date().toISOString();
      this.notify();
      return true;
    }
    return false;
  }

  toggleSubtask(taskId, subtaskIndex) {
    const task = this.getTaskById(taskId);
    if (task && task.subtasks && task.subtasks[subtaskIndex]) {
      task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
      this.notify();
      return true;
    }
    return false;
  }

  getTaskById(id) {
    return this.tasks.find(t => t.id === id) || null;
  }

  // Filtragem e Ordenação
  getFilteredTasks() {
    let result = [...this.tasks];

    // Busca textual
    if (this.filters.search) {
      const q = this.filters.search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    // Filtro por Status
    if (this.filters.status !== 'all') {
      result = result.filter(t => t.status === this.filters.status);
    }

    // Filtro por Prioridade
    if (this.filters.priority !== 'all') {
      result = result.filter(t => t.priority === this.filters.priority);
    }

    // Filtro por Categoria
    if (this.filters.category !== 'all') {
      result = result.filter(t => t.category === this.filters.category);
    }

    // Ordenação
    const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
    result.sort((a, b) => {
      if (this.filters.sortBy === 'priority') {
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      }
      if (this.filters.sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      // Padrão: mais recentes primeiro
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
  }

  // Categorias únicas
  getCategories() {
    const set = new Set();
    this.tasks.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }

  // Métricas do Dashboard
  getMetrics() {
    const total = this.tasks.length;
    const inProgress = this.tasks.filter(t => t.status === 'in_progress').length;
    const done = this.tasks.filter(t => t.status === 'done').length;
    const today = new Date().toISOString().split('T')[0];
    
    // Atrasadas: data de entrega menor que hoje e status não concluído
    const overdue = this.tasks.filter(t => {
      return t.status !== 'done' && t.dueDate && t.dueDate < today;
    }).length;

    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, inProgress, done, overdue, completionRate };
  }

  // Tema
  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }

  // Backup JSON
  exportData() {
    const exportObject = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks: this.tasks
    };
    const jsonString = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `munago_tasks_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importData(jsonData) {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (Array.isArray(parsed.tasks)) {
        this.tasks = parsed.tasks;
        this.notify();
        return true;
      }
    } catch (e) {
      console.error('Falha ao importar JSON:', e);
    }
    return false;
  }
}

// Instância singleton global do store
export const store = new TaskStore();
