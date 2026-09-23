/**
 * TaskFlow - Sistema Base de Controle de Tarefas
 * Arquivo principal unificado para compatibilidade total com execução local direta (file:// e http://)
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Constantes e Dados Iniciais
  // ==========================================================================
  const STORAGE_KEY = 'taskflow_data_v1';
  const THEME_KEY = 'taskflow_theme';

  const STATUS_CONFIG = {
    done: { label: 'Feito', colorClass: 'status-done', color: '#00c875' },
    review: { label: 'Aguardando revis...', fullLabel: 'Aguardando revisão', colorClass: 'status-review', color: '#579bfc' },
    in_progress: { label: 'Em andamento', colorClass: 'status-progress', color: '#fdab3d' },
    todo: { label: 'A Fazer', colorClass: 'status-todo', color: '#64748b' }
  };

  const TYPE_CONFIG = {
    'Estoque': { label: 'Estoque', colorClass: 'type-estoque', hasFold: true, color: '#579bfc' },
    'Funcionalidade': { label: 'Funcionalidade', colorClass: 'type-funcionalidade', color: '#00c875' },
    'Outro': { label: 'Outro', colorClass: 'type-outro', color: '#2ba7ff' },
    'Resolução de Problemas': { label: 'Resolução de Pro...', fullLabel: 'Resolução de Problemas', colorClass: 'type-resolucao', color: '#ffcb00' },
    'Redução de Custos': { label: 'Redução de Custos', colorClass: 'type-reducao', color: '#ff642e' },
    'Infraestrutura': { label: 'Infraestrutura', colorClass: 'type-infra', color: '#8b5cf6' },
    'Segurança': { label: 'Segurança', colorClass: 'type-seguranca', color: '#ef4444' },
    'Desenvolvimento': { label: 'Desenvolvimento', colorClass: 'type-funcionalidade', color: '#00c875' },
    'Trabalho': { label: 'Trabalho', colorClass: 'type-outro', color: '#2ba7ff' },
    'Estudos': { label: 'Estudos', colorClass: 'type-estoque', color: '#579bfc' }
  };

  const INITIAL_TASKS = [
    {
      id: 'task-s1',
      taskCode: 'TMYT-008',
      title: 'Inventário Aparelhos e linhas',
      description: 'Levantamento e auditoria completa de aparelhos, chips e linhas ativas da operação.',
      status: 'done',
      priority: 'high',
      category: 'Estoque',
      type: 'Estoque',
      epic: 'Estoque',
      github: 'visiun/infra#08',
      assignee: { name: 'Fillipe Felix', initials: 'FF' },
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString().split('T')[0],
      subtasks: [
        { text: 'Auditar aparelhos em estoque', done: true },
        { text: 'Conferir faturas de telefonia', done: true }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString()
    },
    {
      id: 'task-s2',
      taskCode: 'TMYT-009',
      title: 'Sistema operacional VISIUN',
      description: 'Deploy e validação da nova versão do sistema operacional e ambiente de produção.',
      status: 'done',
      priority: 'urgent',
      category: 'Funcionalidade',
      type: 'Funcionalidade',
      epic: 'Sistemas',
      github: 'visiun/core#09',
      assignee: { name: 'Fillipe Felix', initials: 'FF' },
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString().split('T')[0],
      subtasks: [
        { text: 'Executar pipeline CI/CD', done: true },
        { text: 'Testes de regressão', done: true }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString()
    },
    {
      id: 'task-s3',
      taskCode: 'TMYT-010',
      title: 'Mudança Alphaville',
      description: 'Planejamento e coordenação logística da infraestrutura do novo escritório Alphaville.',
      status: 'done',
      priority: 'medium',
      category: 'Outro',
      type: 'Outro',
      epic: 'Aguardando Aprov...',
      github: 'visiun/ops#10',
      assignee: { name: 'Fillipe Felix', initials: 'FF' },
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0],
      subtasks: [
        { text: 'Mapear layout das mesas e rede', done: true }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 84).toISOString()
    },
    {
      id: 'task-s4',
      taskCode: 'TMYT-011',
      title: 'Ponto Zona sul',
      description: 'Configuração do relógio de ponto e integração com sistema de RH da unidade Zona Sul.',
      status: 'done',
      priority: 'high',
      category: 'Resolução de Problemas',
      type: 'Resolução de Problemas',
      epic: 'Sistemas',
      github: 'visiun/rh#11',
      assignee: { name: 'Fillipe Felix', initials: 'FF' },
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString().split('T')[0],
      subtasks: [
        { text: 'Instalar leitor biométrico', done: true }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
    },
    {
      id: 'task-s5',
      taskCode: 'TMYT-012',
      title: 'Atualizar linhas canceladas',
      description: 'Processar solicitações de cancelamento de planos e atualizar planilha de custos de telecom.',
      status: 'review',
      priority: 'medium',
      category: 'Outro',
      type: 'Outro',
      epic: 'Infraestrutura',
      github: 'visiun/infra#12',
      assignee: { name: 'Fillipe Felix', initials: 'FF' },
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0],
      subtasks: [
        { text: 'Conferir faturas', done: true },
        { text: 'Dar baixa no ERP', done: false }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    },
    {
      id: 'task-s6',
      taskCode: 'TMYT-013',
      title: 'Aparelhos na manutenção',
      description: 'Acompanhar ordem de serviço dos smartphones enviados para assistência técnica autorizada.',
      status: 'review',
      priority: 'high',
      category: 'Resolução de Problemas',
      type: 'Resolução de Problemas',
      epic: 'Infraestrutura',
      github: 'visiun/hardware#13',
      assignee: { name: 'Fillipe Felix', initials: 'FF' },
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString().split('T')[0],
      subtasks: [
        { text: 'Solicitar laudo técnico', done: true },
        { text: 'Aprovar orçamento', done: false }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
    },
    {
      id: 'task-s7',
      taskCode: 'TMYT-014',
      title: 'Notebook Lenovo na manutenção',
      description: 'Troca de teclado e upgrade de memória SSD do notebook do time financeiro.',
      status: 'review',
      priority: 'urgent',
      category: 'Resolução de Problemas',
      type: 'Resolução de Problemas',
      epic: 'Infraestrutura',
      github: 'visiun/hardware#14',
      assignee: { name: 'Fillipe Felix', initials: 'FF' },
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString().split('T')[0],
      subtasks: [
        { text: 'Backup dos dados do usuário', done: true },
        { text: 'Troca do módulo SSD', done: false }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: 'task-s8',
      taskCode: 'TMYT-015',
      title: 'Manutenção e redução de custos Brick',
      description: 'Negociação de licenças corporativas de software e reestruturação de servidores cloud.',
      status: 'in_progress',
      priority: 'high',
      category: 'Redução de Custos',
      type: 'Redução de Custos',
      epic: 'Infraestrutura',
      github: 'visiun/finance#15',
      assignee: { name: 'Fillipe Felix', initials: 'FF' },
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString().split('T')[0],
      subtasks: [
        { text: 'Levantar consumo AWS', done: true },
        { text: 'Aplicar instâncias reservadas', done: false }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
    },
    {
      id: 'task-s9',
      taskCode: 'TMYT-016',
      title: 'Excluir usuários desligados da Visiun',
      description: 'Revogação de acessos no Google Workspace, GitHub, VPN e autenticação em dois fatores.',
      status: 'in_progress',
      priority: 'urgent',
      category: 'Funcionalidade',
      type: 'Funcionalidade',
      epic: 'Infraestrutura',
      github: 'visiun/sec#16',
      assignee: { name: 'Fillipe Felix', initials: 'FF' },
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString().split('T')[0],
      subtasks: [
        { text: 'Bloquear e-mail institucional', done: true },
        { text: 'Remover credenciais SSH', done: false }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString()
    },
    {
      id: 'task-s10',
      taskCode: 'TMYT-017',
      title: 'Portabilidade linhas vivo e do Fillipe Felix',
      description: 'Finalização do processo de portabilidade de operadora e ativação de e-SIM corporativo.',
      status: 'in_progress',
      priority: 'medium',
      category: 'Outro',
      type: 'Outro',
      epic: 'Infraestrutura',
      github: 'visiun/telecom#17',
      assignee: { name: 'Fillipe Felix', initials: 'FF' },
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 144).toISOString().split('T')[0],
      subtasks: [
        { text: 'Confirmar SMS de segurança da Vivo', done: true },
        { text: 'Configurar eSIM no aparelho', done: false }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
    }
  ];

  const PRIORITY_LABELS = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente'
  };

  // ==========================================================================
  // 2. TaskStore (Estado e Persistência)
  // ==========================================================================
  class TaskStore {
    constructor() {
      this.tasks = [];
      this.listeners = [];
      this.theme = localStorage.getItem(THEME_KEY) || 'dark';
      this.viewMode = 'sprint';
      this.filters = {
        search: '',
        status: 'all',
        priority: 'all',
        category: 'all',
        sortBy: 'dueDate'
      };
      this.fetchTasks();
    }

    async fetchTasks() {
      try {
        const res = await fetch('http://localhost:3000/api/tasks');
        const data = await res.json();
        if (data.tasks && Array.isArray(data.tasks)) {
          this.tasks = data.tasks.map((t, idx) => ({
            ...t,
            taskCode: t.taskCode || ('TMYT-' + String(idx + 8).padStart(3, '0')),
            type: t.type || t.category || 'Funcionalidade',
            epic: t.epic || (t.category || 'Sistemas'),
            assignee: t.assignee || { name: 'Fillipe Felix', initials: 'FF' }
          }));
        }
        this.notify(false); // Notify without saving to localstorage
      } catch (e) {
        console.error('Falha ao carregar do Backend:', e);
        // Fallback to local storage se o backend cair
        try {
          const data = localStorage.getItem(STORAGE_KEY);
          if (data) this.tasks = JSON.parse(data);
        } catch (err) {}
        this.notify(false);
      }
    }

    saveTasks(tasksToSave = this.tasks) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
      } catch (e) {
        console.error('Erro ao salvar no LocalStorage:', e);
      }
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }

    notify(save = true) {
      if (save) this.saveTasks();
      this.listeners.forEach(fn => fn(this));
    }

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
      
      fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      }).catch(e => console.error('Erro na API:', e));

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
        
        fetch(`http://localhost:3000/api/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.tasks[index])
        }).catch(e => console.error('Erro na API:', e));

        return this.tasks[index];
      }
      return null;
    }

    deleteTask(id) {
      const prevLen = this.tasks.length;
      this.tasks = this.tasks.filter(t => t.id !== id);
      if (this.tasks.length !== prevLen) {
        this.notify();
        
        fetch(`http://localhost:3000/api/tasks/${id}`, {
          method: 'DELETE'
        }).catch(e => console.error('Erro na API:', e));

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
        
        fetch(`http://localhost:3000/api/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task)
        }).catch(e => console.error('Erro na API:', e));

        return true;
      }
      return false;
    }

    getTaskById(id) {
      return this.tasks.find(t => t.id === id) || null;
    }

    getFilteredTasks() {
      let result = [...this.tasks];

      if (this.filters.search) {
        const q = this.filters.search.toLowerCase();
        result = result.filter(t =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      }

      if (this.filters.status !== 'all') {
        result = result.filter(t => t.status === this.filters.status);
      }

      if (this.filters.priority !== 'all') {
        result = result.filter(t => t.priority === this.filters.priority);
      }

      if (this.filters.category !== 'all') {
        result = result.filter(t => t.category === this.filters.category);
      }

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
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return result;
    }

    getCategories() {
      const set = new Set();
      this.tasks.forEach(t => {
        if (t.category) set.add(t.category);
      });
      return Array.from(set).sort();
    }

    getMetrics() {
      const total = this.tasks.length;
      const inProgress = this.tasks.filter(t => t.status === 'in_progress').length;
      const done = this.tasks.filter(t => t.status === 'done').length;
      const today = new Date().toISOString().split('T')[0];

      const overdue = this.tasks.filter(t => {
        return t.status !== 'done' && t.dueDate && t.dueDate < today;
      }).length;

      const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
      return { total, inProgress, done, overdue, completionRate };
    }

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

    exportData() {
      const exportObject = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        tasks: this.tasks
      };
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
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

  const store = new TaskStore();

  // ==========================================================================
  // 3. Utilitários (Datas, Confetes, Toasts)
  // ==========================================================================
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDueDate(dateString) {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;

    const dueDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let label = `${parts[2]}/${parts[1]}`;
    let statusClass = '';

    if (diffDays < 0) {
      label = `Atrasado (${Math.abs(diffDays)}d)`;
      statusClass = 'is-overdue';
    } else if (diffDays === 0) {
      label = 'Vence Hoje';
      statusClass = 'is-today';
    } else if (diffDays === 1) {
      label = 'Amanhã';
    }

    return { label, statusClass, diffDays };
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
      success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
      info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
      warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" x2="12"/><line x1="12" x2="12.01" y1="17" x2="17"/></svg>',
      error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" x2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>'
    };

    toast.innerHTML = `
      ${iconMap[type] || iconMap.success}
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#6366f1', '#10b981', '#fbbf24', '#ec4899', '#38bdf8', '#8b5cf6'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 200,
        y: window.innerHeight * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let animationFrame;
    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38;
        p.rotation += p.vRot;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(update);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    update();
  }

  // ==========================================================================
  // 4. Drag & Drop Nativo
  // ==========================================================================
  let draggedTaskId = null;

  function initDragAndDrop() {
    const columns = document.querySelectorAll('.kanban-column');

    columns.forEach(column => {
      column.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        column.classList.add('drag-over');
      });

      column.addEventListener('dragleave', (e) => {
        if (!column.contains(e.relatedTarget)) {
          column.classList.remove('drag-over');
        }
      });

      column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('drag-over');

        const targetStatus = column.dataset.status;
        if (draggedTaskId && targetStatus) {
          const task = store.getTaskById(draggedTaskId);
          const previousStatus = task ? task.status : null;

          const updated = store.moveTaskStatus(draggedTaskId, targetStatus);
          if (updated && targetStatus === 'done' && previousStatus !== 'done') {
            triggerConfetti();
            showToast('Tarefa movida para Concluído! 🎉', 'success');
          }
        }
      });
    });
  }

  function attachCardDragListeners(cardElement, taskId) {
    cardElement.setAttribute('draggable', 'true');

    cardElement.addEventListener('dragstart', (e) => {
      draggedTaskId = taskId;
      cardElement.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', taskId);
    });

    cardElement.addEventListener('dragend', () => {
      draggedTaskId = null;
      cardElement.classList.remove('dragging');
      document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.remove('drag-over');
      });
    });
  }

  // ==========================================================================
  // 5. Renderização (Sprint Table, Kanban, Lista, Métricas)
  // ==========================================================================

  function closeAllSprintPopovers() {
    document.querySelectorAll('.sprint-popover-menu').forEach(el => el.remove());
  }

  function renderSprintTableView(tasks) {
    const container = document.getElementById('view-container');
    if (!container) return;

    closeAllSprintPopovers();

    // Segmented Status Bar calculation
    const total = tasks.length;
    let doneCount = 0, reviewCount = 0, progressCount = 0, todoCount = 0;
    const typeDistribution = {};

    tasks.forEach(t => {
      if (t.status === 'done') doneCount++;
      else if (t.status === 'review') reviewCount++;
      else if (t.status === 'in_progress') progressCount++;
      else todoCount++;

      const typeKey = t.type || t.category || 'Outro';
      typeDistribution[typeKey] = (typeDistribution[typeKey] || 0) + 1;
    });

    let statusSegmentsHtml = '';
    if (total > 0) {
      const donePct = ((doneCount / total) * 100).toFixed(1);
      const reviewPct = ((reviewCount / total) * 100).toFixed(1);
      const progressPct = ((progressCount / total) * 100).toFixed(1);
      const todoPct = ((todoCount / total) * 100).toFixed(1);

      statusSegmentsHtml = `
        <div class="sprint-segmented-bar" title="Distribuição de Status do Sprint">
          ${doneCount > 0 ? `<div class="seg-part status-done" style="width: ${donePct}%" data-tooltip="Feito: ${doneCount} (${donePct}%)"></div>` : ''}
          ${reviewCount > 0 ? `<div class="seg-part status-review" style="width: ${reviewPct}%" data-tooltip="Aguardando revisão: ${reviewCount} (${reviewPct}%)"></div>` : ''}
          ${progressCount > 0 ? `<div class="seg-part status-progress" style="width: ${progressPct}%" data-tooltip="Em andamento: ${progressCount} (${progressPct}%)"></div>` : ''}
          ${todoCount > 0 ? `<div class="seg-part status-todo" style="width: ${todoPct}%" data-tooltip="A Fazer: ${todoCount} (${todoPct}%)"></div>` : ''}
        </div>
      `;
    }

    let typeSegmentsHtml = '';
    if (total > 0) {
      typeSegmentsHtml = '<div class="sprint-segmented-bar" title="Distribuição por Tipo">';
      Object.keys(typeDistribution).forEach(typeKey => {
        const count = typeDistribution[typeKey];
        const pct = ((count / total) * 100).toFixed(1);
        const config = TYPE_CONFIG[typeKey] || { colorClass: 'type-default', label: typeKey };
        typeSegmentsHtml += `<div class="seg-part ${config.colorClass}" style="width: ${pct}%" data-tooltip="${escapeHtml(config.label || typeKey)}: ${count} (${pct}%)"></div>`;
      });
      typeSegmentsHtml += '</div>';
    }

    // Build rows
    let rowsHtml = '';
    tasks.forEach((task, idx) => {
      const isDone = task.status === 'done';
      const statusInfo = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
      const typeKey = task.type || task.category || 'Outro';
      const typeInfo = TYPE_CONFIG[typeKey] || { label: typeKey, colorClass: 'type-outro' };
      const taskCode = task.taskCode || ('TMYT-' + String(idx + 8).padStart(3, '0'));
      const epicName = task.epic || (task.category || 'Sistemas');
      const githubLink = task.github || ('visiun/core#' + (idx + 8));
      const hasFold = typeInfo.hasFold ? 'has-fold' : '';
      const notesCount = (task.subtasks && task.subtasks.length) || 0;

      rowsHtml += `
        <tr class="sprint-row ${isDone ? 'is-done' : ''}" data-task-id="${task.id}">
          <td class="col-stripe"></td>
          <td class="col-check">
            <input type="checkbox" class="sprint-checkbox task-check-toggle" data-action="toggle-done" ${isDone ? 'checked' : ''} title="${isDone ? 'Reabrir tarefa' : 'Concluir tarefa'}">
          </td>
          <td class="col-task">
            <div class="col-task-inner">
              <span class="col-task-title" data-action="edit" title="${escapeHtml(task.description || task.title)}">${escapeHtml(task.title)}</span>
              <button class="col-task-chat-btn ${notesCount > 0 ? 'has-notes' : ''}" data-action="open-notes" title="${notesCount > 0 ? notesCount + ' subtarefas / notas' : 'Adicionar notas'}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </td>
          <td class="col-resp center">
            <div class="resp-avatar-wrap" title="Responsável: ${escapeHtml(task.assignee ? task.assignee.name : 'Fillipe Felix')}">
              <div class="resp-avatar">
                ${task.assignee && task.assignee.initials ? task.assignee.initials : 'FF'}
              </div>
              <div class="resp-avatar-badge">
                <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              </div>
            </div>
          </td>
          <td class="col-status center" style="padding:0;">
            <div class="col-status-cell ${statusInfo.colorClass}" data-action="change-status" data-task-id="${task.id}" title="Clique para alterar status">
              <span>${statusInfo.label}</span>
            </div>
          </td>
          <td class="col-type center" style="padding:0;">
            <div class="col-type-cell ${typeInfo.colorClass} ${hasFold}" data-action="change-type" data-task-id="${task.id}" title="Clique para alterar tipo">
              <span>${typeInfo.label}</span>
            </div>
          </td>
          <td class="col-id center">
            <span>${escapeHtml(taskCode)}</span>
          </td>
          <td class="col-epic center">
            <span class="epic-pill" title="Épico: ${escapeHtml(epicName)}">
              <span>${escapeHtml(epicName)}</span>
              <button class="epic-pill-remove" data-action="remove-epic" data-task-id="${task.id}" title="Remover épico">×</button>
            </span>
          </td>
          <td class="col-github center">
            <a href="https://github.com" target="_blank" rel="noopener" class="github-link-chip" title="Ver no GitHub">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              <span>${escapeHtml(githubLink)}</span>
            </a>
          </td>
          <td class="col-actions-quick center">
            <div class="sprint-row-actions">
              <button class="sprint-action-btn" data-action="edit" data-task-id="${task.id}" title="Editar Tarefa">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </button>
              <button class="sprint-action-btn del" data-action="delete" data-task-id="${task.id}" title="Excluir Tarefa">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    container.innerHTML = `
      <div class="sprint-board-container animated-fade-in">
        <div class="sprint-card">
          <!-- Cabeçalho do Sprint -->
          <div class="sprint-header-bar">
            <div class="sprint-header-left">
              <button class="sprint-collapse-btn" id="sprint-toggle-collapse" title="Recolher / Expandir Sprint">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <h2 class="sprint-title">
                Sprint 1
                <span class="sprint-task-count">${total}</span>
              </h2>
            </div>
            <div class="sprint-header-right">
              <span class="sprint-date-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                fev 10 - 23
              </span>
              <button class="sprint-pill-btn" title="Capacidade da Equipe (100h disponíveis)">Capacity</button>
              <button class="sprint-tab-btn" title="Reunião Diária de Alinhamento (Standup)">Reunião em pé</button>
              <button class="sprint-start-btn" id="btn-start-sprint" title="Iniciar ciclo da Sprint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>
                Começar
              </button>
              <button class="sprint-icon-btn" title="Mais opções da Sprint">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>
            </div>
          </div>

          <!-- Tabela com Scroll Horizontal Suave -->
          <div class="sprint-table-wrapper" id="sprint-table-wrapper">
            <table class="sprint-table">
              <thead class="sprint-thead">
                <tr>
                  <th class="col-stripe"></th>
                  <th class="col-check">
                    <input type="checkbox" class="sprint-checkbox" id="sprint-select-all" title="Selecionar todas">
                  </th>
                  <th class="col-task">Tarefa</th>
                  <th class="col-resp center">Resp.</th>
                  <th class="col-status center" style="width:140px;">Status</th>
                  <th class="col-type center" style="width:140px;">Tipo <span style="font-size:0.9em;opacity:0.8">+</span></th>
                  <th class="col-id center">ID da tarefa</th>
                  <th class="col-epic center">Épico <span style="font-size:0.8em;opacity:0.7">ⓘ</span></th>
                  <th class="col-github center">Link do GitHub <span style="font-size:0.9em;opacity:0.8">+</span></th>
                  <th class="col-add" title="Adicionar coluna">+</th>
                </tr>
              </thead>
              <tbody class="sprint-tbody" id="sprint-tbody">
                ${rowsHtml}
                <!-- Linha rápida para adicionar tarefa -->
                <tr class="sprint-add-row">
                  <td class="col-stripe"></td>
                  <td class="col-check">
                    <span style="color: #64748b; font-size: 1.15rem; line-height: 1;">+</span>
                  </td>
                  <td class="col-task" colspan="8">
                    <div class="sprint-add-input-wrap">
                      <input type="text" class="sprint-add-input" id="sprint-add-task-input" placeholder="+ Adicionar tarefa (Pressione Enter para salvar)...">
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot class="sprint-tfoot">
                <tr>
                  <td class="col-stripe"></td>
                  <td class="col-check"></td>
                  <td class="col-task">
                    <span style="color: #64748b; font-size: 0.78rem; font-weight: 500;">
                      ${total} ${total === 1 ? 'tarefa' : 'tarefas'} no Sprint
                    </span>
                  </td>
                  <td class="col-resp"></td>
                  <td class="col-status">
                    ${statusSegmentsHtml}
                  </td>
                  <td class="col-type">
                    ${typeSegmentsHtml}
                  </td>
                  <td class="col-id"></td>
                  <td class="col-epic"></td>
                  <td class="col-github"></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    `;

    // Attach inline add task listener
    const addInput = document.getElementById('sprint-add-task-input');
    if (addInput) {
      addInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = addInput.value.trim();
          if (val) {
            store.addTask({
              title: val,
              status: 'in_progress',
              priority: 'medium',
              category: 'Funcionalidade',
              type: 'Funcionalidade',
              epic: 'Sistemas'
            });
            showToast('Tarefa adicionada à Sprint! 🚀', 'success');
            renderApp();
          }
        }
      });
    }

    // Attach collapse toggle
    const collapseBtn = document.getElementById('sprint-toggle-collapse');
    const tableWrapper = document.getElementById('sprint-table-wrapper');
    if (collapseBtn && tableWrapper) {
      collapseBtn.addEventListener('click', () => {
        collapseBtn.classList.toggle('collapsed');
        tableWrapper.style.display = collapseBtn.classList.contains('collapsed') ? 'none' : 'block';
      });
    }

    // Attach select all checkbox
    const selectAll = document.getElementById('sprint-select-all');
    if (selectAll) {
      selectAll.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        document.querySelectorAll('.task-check-toggle').forEach(chk => {
          chk.checked = isChecked;
          const tr = chk.closest('tr');
          if (tr) tr.classList.toggle('is-done', isChecked);
        });
      });
    }

    // Attach Começar button
    const startBtn = document.getElementById('btn-start-sprint');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        triggerConfetti();
        showToast('Sprint 1 iniciado com sucesso! 🚀 Boas entregas!', 'success');
      });
    }
  }

  function renderKanbanView(tasks) {
    const container = document.getElementById('view-container');
    container.innerHTML = `
      <div class="kanban-board animated-fade-in">
        <div class="kanban-column" data-status="todo" id="col-todo">
          <div class="column-header">
            <div class="column-title-wrap">
              <span class="column-indicator todo"></span>
              <span class="column-title">A Fazer</span>
              <span class="column-count" id="count-todo">0</span>
            </div>
            <button class="column-btn-add" data-add-status="todo" title="Adicionar tarefa em A Fazer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
          <div class="task-list" id="list-todo"></div>
        </div>

        <div class="kanban-column" data-status="in_progress" id="col-in_progress">
          <div class="column-header">
            <div class="column-title-wrap">
              <span class="column-indicator in_progress"></span>
              <span class="column-title">Em Andamento</span>
              <span class="column-count" id="count-in_progress">0</span>
            </div>
            <button class="column-btn-add" data-add-status="in_progress" title="Adicionar tarefa em Em Andamento">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
          <div class="task-list" id="list-in_progress"></div>
        </div>

        <div class="kanban-column" data-status="done" id="col-done">
          <div class="column-header">
            <div class="column-title-wrap">
              <span class="column-indicator done"></span>
              <span class="column-title">Concluído</span>
              <span class="column-count" id="count-done">0</span>
            </div>
            <button class="column-btn-add" data-add-status="done" title="Adicionar tarefa em Concluído">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
          <div class="task-list" id="list-done"></div>
        </div>
      </div>
    `;

    const grouped = { todo: [], in_progress: [], done: [] };
    tasks.forEach(t => {
      if (grouped[t.status]) grouped[t.status].push(t);
    });

    document.getElementById('count-todo').textContent = grouped.todo.length;
    document.getElementById('count-in_progress').textContent = grouped.in_progress.length;
    document.getElementById('count-done').textContent = grouped.done.length;

    Object.keys(grouped).forEach(status => {
      const listEl = document.getElementById(`list-${status}`);
      const items = grouped[status];

      if (items.length === 0) {
        listEl.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 12h6"/></svg>
            </div>
            <span>Nenhuma tarefa aqui</span>
          </div>
        `;
        return;
      }

      items.forEach(task => {
        const card = createTaskCard(task);
        listEl.appendChild(card);
        attachCardDragListeners(card, task.id);
      });
    });
  }

  function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.status === 'done' ? 'is-done' : ''}`;
    card.dataset.taskId = task.id;

    const dueInfo = formatDueDate(task.dueDate);

    let subtasksHtml = '';
    if (task.subtasks && task.subtasks.length > 0) {
      const totalSub = task.subtasks.length;
      const completedSub = task.subtasks.filter(s => s.done).length;
      const pct = Math.round((completedSub / totalSub) * 100);
      subtasksHtml = `
        <div class="subtasks-mini-progress">
          <div class="subtasks-mini-header">
            <span>Checklist</span>
            <span>${completedSub}/${totalSub} (${pct}%)</span>
          </div>
          <div class="subtasks-mini-bar">
            <div class="subtasks-mini-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }

    let nextActionBtn = '';
    if (task.status === 'todo') {
      nextActionBtn = `<button class="action-btn" data-action="advance" data-next="in_progress" title="Mover para Em Andamento"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 18 6-6-6-6"/></svg></button>`;
    } else if (task.status === 'in_progress') {
      nextActionBtn = `<button class="action-btn" data-action="advance" data-next="done" title="Concluir tarefa"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg></button>`;
    }

    card.innerHTML = `
      <div class="task-card-header">
        <div class="task-card-badges">
          <span class="badge badge-priority-${task.priority}">
            ${PRIORITY_LABELS[task.priority] || task.priority}
          </span>
          <span class="badge badge-category">${escapeHtml(task.category)}</span>
        </div>
        <div class="task-card-actions">
          ${nextActionBtn}
          <button class="action-btn" data-action="edit" title="Editar Tarefa">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          <button class="action-btn delete" data-action="delete" title="Excluir Tarefa">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <h3 class="task-card-title">${escapeHtml(task.title)}</h3>
      ${task.description ? `<p class="task-card-desc">${escapeHtml(task.description)}</p>` : ''}
      
      ${subtasksHtml}

      <div class="task-card-footer">
        ${dueInfo ? `
          <div class="due-date-badge ${dueInfo.statusClass}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span>${dueInfo.label}</span>
          </div>
        ` : '<div></div>'}
        <span style="color: var(--text-muted); font-size: 0.7rem;">
          #${task.id.substring(task.id.lastIndexOf('-') + 1)}
        </span>
      </div>
    `;

    return card;
  }

  function renderListView(tasks) {
    const container = document.getElementById('view-container');
    if (tasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state animated-fade-in">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
          </div>
          <h3>Nenhuma tarefa encontrada</h3>
          <p>Ajuste os filtros ou crie uma nova tarefa.</p>
        </div>
      `;
      return;
    }

    const itemsHtml = tasks.map(task => {
      const dueInfo = formatDueDate(task.dueDate);
      const isDone = task.status === 'done';

      return `
        <div class="list-item ${isDone ? 'is-done' : ''} animated-fade-in" data-task-id="${task.id}">
          <button class="list-item-status-toggle" data-action="toggle-status" title="${isDone ? 'Marcar como não concluído' : 'Marcar como concluído'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </button>

          <div class="list-item-main">
            <span class="list-item-title">${escapeHtml(task.title)}</span>
            ${task.description ? `<span class="list-item-desc">${escapeHtml(task.description)}</span>` : ''}
          </div>

          <span class="badge badge-category list-item-category">${escapeHtml(task.category)}</span>
          
          <span class="badge badge-priority-${task.priority}">
            ${PRIORITY_LABELS[task.priority] || task.priority}
          </span>

          ${dueInfo ? `
            <div class="due-date-badge ${dueInfo.statusClass}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              <span>${dueInfo.label}</span>
            </div>
          ` : '<span>-</span>'}

          <div class="task-card-actions">
            <button class="action-btn" data-action="edit" title="Editar Tarefa">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </button>
            <button class="action-btn delete" data-action="delete" title="Excluir Tarefa">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="list-view-container">
        ${itemsHtml}
      </div>
    `;
  }

  // ==========================================================================
  // Visualização em Calendário (Full Calendar View)
  // ==========================================================================
  let calendarCurrentDate = new Date();

  const MONTH_NAMES_PT = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  function renderCalendarView(tasks) {
    const container = document.getElementById('view-container');
    const year = calendarCurrentDate.getFullYear();
    const month = calendarCurrentDate.getMonth();
    const today = new Date();

    const monthName = MONTH_NAMES_PT[month];

    // Dia da semana do 1º dia do mês (0 = Domingo, 1 = Segunda...)
    const firstDay = new Date(year, month, 1).getDay();
    // Começar na Segunda-feira: (0 = Dom -> offset 6, 1 = Seg -> offset 0)
    const startOffset = (firstDay + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Agrupar tarefas por dueDate (YYYY-MM-DD)
    const tasksByDate = {};
    tasks.forEach(t => {
      if (t.dueDate) {
        if (!tasksByDate[t.dueDate]) tasksByDate[t.dueDate] = [];
        tasksByDate[t.dueDate].push(t);
      }
    });

    const totalSlots = (startOffset + daysInMonth > 35) ? 42 : 35;
    let daysHtml = '';
    const todayStr = new Date().toISOString().split('T')[0];

    for (let i = 0; i < totalSlots; i++) {
      let cellDay = 0;
      let cellMonth = month;
      let cellYear = year;
      let isOtherMonth = false;

      if (i < startOffset) {
        cellDay = daysInPrevMonth - startOffset + i + 1;
        cellMonth = month - 1;
        if (cellMonth < 0) { cellMonth = 11; cellYear--; }
        isOtherMonth = true;
      } else if (i >= startOffset + daysInMonth) {
        cellDay = i - (startOffset + daysInMonth) + 1;
        cellMonth = month + 1;
        if (cellMonth > 11) { cellMonth = 0; cellYear++; }
        isOtherMonth = true;
      } else {
        cellDay = i - startOffset + 1;
      }

      const mm = String(cellMonth + 1).padStart(2, '0');
      const dd = String(cellDay).padStart(2, '0');
      const dateKey = `${cellYear}-${mm}-${dd}`;

      const isToday = !isOtherMonth &&
        today.getFullYear() === cellYear &&
        today.getMonth() === cellMonth &&
        today.getDate() === cellDay;

      const dayTasks = tasksByDate[dateKey] || [];

      let taskPillsHtml = '';
      const maxDisplay = 3;
      const displayTasks = dayTasks.slice(0, maxDisplay);

      displayTasks.forEach(task => {
        const isDone = task.status === 'done';
        const isOverdue = !isDone && dateKey < todayStr;
        const statusClass = `status-${task.status}`;
        taskPillsHtml += `
          <div class="cal-task-chip ${statusClass} ${isDone ? 'is-done' : ''} ${isOverdue ? 'is-overdue' : ''}" 
               data-task-id="${task.id}" 
               title="${escapeHtml(task.title)} (${PRIORITY_LABELS[task.priority] || task.priority})">
            <span class="cal-task-priority-dot"></span>
            <span class="cal-task-title">${escapeHtml(task.title)}</span>
          </div>
        `;
      });

      if (dayTasks.length > maxDisplay) {
        taskPillsHtml += `
          <div class="cal-more-badge" data-date="${dateKey}" title="Ver todas as ${dayTasks.length} tarefas deste dia">
            +${dayTasks.length - maxDisplay} mais
          </div>
        `;
      }

      daysHtml += `
        <div class="calendar-day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'is-today' : ''}" data-date="${dateKey}">
          <div class="calendar-cell-top">
            <span class="calendar-day-number">${cellDay}</span>
            <button class="calendar-cell-add-btn" data-date="${dateKey}" title="Adicionar tarefa em ${dd}/${mm}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
          <div class="calendar-day-tasks">
            ${taskPillsHtml}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="calendar-container animated-fade-in">
        <div class="calendar-header">
          <div class="calendar-header-left">
            <h2 class="calendar-month-title">
              <span>${monthName}</span>
              <span class="calendar-year-badge">${year}</span>
            </h2>
            <div class="calendar-nav-group">
              <button class="calendar-nav-btn" id="btn-cal-prev" title="Mês Anterior">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button class="calendar-today-btn" id="btn-cal-today" title="Ir para Hoje">Hoje</button>
              <button class="calendar-nav-btn" id="btn-cal-next" title="Próximo Mês">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div class="calendar-legend">
            <div class="legend-item"><span class="legend-dot todo"></span><span>A Fazer</span></div>
            <div class="legend-item"><span class="legend-dot progress"></span><span>Em Andamento</span></div>
            <div class="legend-item"><span class="legend-dot review"></span><span>Revisão</span></div>
            <div class="legend-item"><span class="legend-dot done"></span><span>Concluído</span></div>
          </div>
        </div>

        <div class="calendar-weekdays">
          <div class="calendar-weekday">Seg</div>
          <div class="calendar-weekday">Ter</div>
          <div class="calendar-weekday">Qua</div>
          <div class="calendar-weekday">Qui</div>
          <div class="calendar-weekday">Sex</div>
          <div class="calendar-weekday">Sáb</div>
          <div class="calendar-weekday">Dom</div>
        </div>

        <div class="calendar-days-grid">
          ${daysHtml}
        </div>
      </div>
    `;

    // Event listeners do Calendário
    document.getElementById('btn-cal-prev').addEventListener('click', () => {
      calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
      renderApp();
    });

    document.getElementById('btn-cal-today').addEventListener('click', () => {
      calendarCurrentDate = new Date();
      renderApp();
    });

    document.getElementById('btn-cal-next').addEventListener('click', () => {
      calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
      renderApp();
    });

    // Botão de adicionar tarefa rápida na data da célula
    container.querySelectorAll('.calendar-cell-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const date = btn.dataset.date;
        openTaskModal(null);
        const dueInput = document.getElementById('task-duedate');
        if (dueInput) dueInput.value = date;
      });
    });

    // Clique duplo na célula abre cadastro de tarefa com aquela data
    container.querySelectorAll('.calendar-day-cell').forEach(cell => {
      cell.addEventListener('dblclick', () => {
        const date = cell.dataset.date;
        openTaskModal(null);
        const dueInput = document.getElementById('task-duedate');
        if (dueInput) dueInput.value = date;
      });
    });

    // Clique no chip da tarefa abre modal de edição
    container.querySelectorAll('.cal-task-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = chip.dataset.taskId;
        const task = store.getTaskById(taskId);
        if (task) openTaskModal(task);
      });
    });
  }

  // ==========================================================================
  // Visualização de Métricas Avançadas (Analytics Dashboard View)
  // ==========================================================================
  // ==========================================================================
  // Visualização de Relatório IA
  // ==========================================================================
  async function renderAiReportView() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
      <div class="analytics-dashboard animated-fade-in" style="max-width: 800px; margin: 0 auto; padding: 2rem;">
        <div class="analytics-header" style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.8rem; margin-bottom: 1rem; background: linear-gradient(90deg, #b829ff, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Relatório Inteligente de IA</h2>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Deixe a Inteligência Artificial analisar suas tarefas e gerar um relatório completo de progresso.</p>
          <button id="btn-generate-ai-report" class="btn btn-primary" style="font-size: 1.1rem; padding: 0.8rem 2rem; border-radius: 30px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
            Gerar Relatório Agora
          </button>
        </div>
        <div id="ai-report-content" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; min-height: 200px; line-height: 1.6; display: none;">
        </div>
        <div id="ai-report-loading" style="display: none; text-align: center; padding: 3rem;">
          <div class="loader" style="width: 40px; height: 40px; border: 4px solid rgba(99, 102, 241, 0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
          <p style="color: var(--text-muted);">A Inteligência Artificial está escrevendo o seu relatório...</p>
        </div>
      </div>
    `;

    document.getElementById('btn-generate-ai-report').addEventListener('click', async () => {
      const btn = document.getElementById('btn-generate-ai-report');
      const content = document.getElementById('ai-report-content');
      const loading = document.getElementById('ai-report-loading');
      
      btn.disabled = true;
      content.style.display = 'none';
      loading.style.display = 'block';

      try {
        const metrics = {
          total: store.tasks.length,
          inProgress: store.tasks.filter(t => t.status === 'in_progress').length,
          done: store.tasks.filter(t => t.status === 'done').length,
          urgent: store.tasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length
        };
        const response = await fetch('http://localhost:3000/api/ai-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tasks: store.tasks, metrics })
        });
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);

        // Simple markdown parsing to HTML
        let htmlReport = data.report
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/gim, '<em>$1</em>')
          .replace(/^\- (.*$)/gim, '<li>$1</li>')
          .replace(/\n/gim, '<br>');
        
        content.innerHTML = htmlReport;
        content.style.display = 'block';
      } catch (err) {
        content.innerHTML = `<div style="color: #ef4444;">Erro ao gerar relatório: ${err.message}</div>`;
        content.style.display = 'block';
        showToast('Erro ao contatar a IA', 'error');
      } finally {
        loading.style.display = 'none';
        btn.disabled = false;
      }
    });
  }

  // ==========================================================================
  // Visualização de Métricas Avançadas (Analytics Dashboard View)
  // ==========================================================================
  function renderAnalyticsView(tasks, metrics) {
    const container = document.getElementById('view-container');
    const total = tasks.length;

    // Status breakdown
    const doneCount = tasks.filter(t => t.status === 'done').length;
    const reviewCount = tasks.filter(t => t.status === 'review').length;
    const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
    const todoCount = tasks.filter(t => t.status === 'todo').length;

    const donePct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    const reviewPct = total > 0 ? Math.round((reviewCount / total) * 100) : 0;
    const inProgressPct = total > 0 ? Math.round((inProgressCount / total) * 100) : 0;
    const todoPct = total > 0 ? Math.max(0, 100 - donePct - reviewPct - inProgressPct) : 0;

    // Subtasks / Checklist
    let totalSubtasks = 0;
    let doneSubtasks = 0;
    tasks.forEach(t => {
      if (Array.isArray(t.subtasks)) {
        totalSubtasks += t.subtasks.length;
        doneSubtasks += t.subtasks.filter(s => s.done).length;
      }
    });
    const subtaskPct = totalSubtasks > 0 ? Math.round((doneSubtasks / totalSubtasks) * 100) : 0;

    // Priority breakdown
    const priorityWeights = {
      urgent: { label: 'Urgente', count: 0, class: 'urgent' },
      high: { label: 'Alta', count: 0, class: 'high' },
      medium: { label: 'Média', count: 0, class: 'medium' },
      low: { label: 'Baixa', count: 0, class: 'low' }
    };
    tasks.forEach(t => {
      if (priorityWeights[t.priority]) priorityWeights[t.priority].count++;
    });

    const priorityRowsHtml = Object.keys(priorityWeights).map(pKey => {
      const p = priorityWeights[pKey];
      const pct = total > 0 ? Math.round((p.count / total) * 100) : 0;
      return `
        <div class="priority-row">
          <div class="priority-row-info">
            <span class="priority-badge-pill ${p.class}">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
              ${p.label}
            </span>
            <span style="font-weight: 700; color: var(--text-primary); font-size: 0.82rem;">
              ${p.count} tarefa${p.count !== 1 ? 's' : ''} (${pct}%)
            </span>
          </div>
          <div class="priority-bar-track">
            <div class="priority-bar-fill ${p.class}" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    // Categorias em Grid de Cards
    const categories = store.getCategories();
    const catStats = {};
    const catColors = {
      'Estoque': '#579bfc',
      'Funcionalidade': '#00c875',
      'Outro': '#2ba7ff',
      'Resolução de Problemas': '#ffcb00',
      'Redução de Custos': '#ff642e',
      'Infraestrutura': '#8b5cf6',
      'Segurança': '#ef4444',
      'Desenvolvimento': '#00c875',
      'Trabalho': '#2ba7ff',
      'Estudos': '#579bfc'
    };

    categories.forEach(c => {
      catStats[c] = { total: 0, done: 0, inProgress: 0, color: catColors[c] || '#6366f1' };
    });
    tasks.forEach(t => {
      if (!catStats[t.category]) {
        catStats[t.category] = { total: 0, done: 0, inProgress: 0, color: catColors[t.category] || '#6366f1' };
      }
      catStats[t.category].total++;
      if (t.status === 'done') catStats[t.category].done++;
      if (t.status === 'in_progress') catStats[t.category].inProgress++;
    });

    const catCardsHtml = Object.keys(catStats).map(cat => {
      const stat = catStats[cat];
      const pct = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;
      const isComplete = pct === 100 && stat.total > 0;
      return `
        <div class="category-stat-card">
          <div class="category-card-top">
            <div class="category-card-title-group">
              <span class="category-card-dot" style="background: ${stat.color};"></span>
              <span class="category-card-name">${escapeHtml(cat)}</span>
            </div>
            <span class="category-card-badge ${isComplete ? 'is-complete' : ''}">
              ${isComplete ? '100% Concluído' : `${pct}%`}
            </span>
          </div>

          <div class="category-progress-track">
            <div class="category-progress-fill" style="width: ${pct}%; background: ${stat.color};"></div>
          </div>

          <div class="category-card-stats">
            <span>Tarefas: <strong>${stat.done}/${stat.total}</strong></span>
            <span>Em andamento: <strong>${stat.inProgress}</strong></span>
          </div>
        </div>
      `;
    }).join('');

    // Membros da Equipe
    const teamStats = {};
    tasks.forEach(t => {
      const name = t.assignee?.name || 'Fillipe Felix';
      const initials = t.assignee?.initials || 'FF';
      if (!teamStats[name]) {
        teamStats[name] = { name, initials, total: 0, done: 0, inProgress: 0 };
      }
      teamStats[name].total++;
      if (t.status === 'done') teamStats[name].done++;
      if (t.status === 'in_progress') teamStats[name].inProgress++;
    });

    const teamCardsHtml = Object.keys(teamStats).map(member => {
      const stat = teamStats[member];
      const pct = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;
      return `
        <div class="team-card">
          <div class="team-member-info">
            <div class="team-avatar">${stat.initials}</div>
            <div>
              <div class="team-name">${escapeHtml(stat.name)}</div>
              <div class="team-role">${stat.total} tarefa${stat.total > 1 ? 's' : ''} atribuída${stat.total > 1 ? 's' : ''} &bull; ${stat.inProgress} ativa${stat.inProgress > 1 ? 's' : ''}</div>
            </div>
          </div>
          <div class="team-metrics">
            <span class="team-completed-count">${stat.done}/${stat.total}</span>
            <span class="team-rate-text">${pct}% entregue</span>
          </div>
        </div>
      `;
    }).join('');

    // Cálculos de Anéis SVG
    const r = 22;
    const circ = 2 * Math.PI * r;
    const compRingOffset = circ - (metrics.completionRate / 100) * circ;
    const subtaskRingOffset = circ - (subtaskPct / 100) * circ;

    container.innerHTML = `
      <div class="analytics-dashboard">
        <!-- 1. Header do Painel -->
        <div class="analytics-header-card">
          <div>
            <div class="analytics-title-group">
              <h2 class="analytics-main-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                Painel de Inteligência & Métricas
              </h2>
              <span class="analytics-live-tag">
                <span class="analytics-live-dot"></span>
                Tempo Real
              </span>
            </div>
            <p class="analytics-summary-text">Visão consolidada de desempenho, distribuição de demandas, SLA e eficiência do time.</p>
          </div>
        </div>

        <!-- 2. Grid de KPIs Executivos com Anéis Visuais -->
        <div class="analytics-kpi-grid">
          <div class="analytics-kpi-card">
            <div class="analytics-kpi-info">
              <span class="analytics-kpi-label">Taxa de Conclusão</span>
              <span class="analytics-kpi-value">${metrics.completionRate}%</span>
              <span class="analytics-kpi-sub">${metrics.done} de ${metrics.total} tarefas finalizadas</span>
            </div>
            <div class="analytics-kpi-ring-wrap" title="Taxa de Conclusão: ${metrics.completionRate}%">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle class="analytics-kpi-ring-bg" cx="28" cy="28" r="${r}"></circle>
                <circle class="analytics-kpi-ring-fill" cx="28" cy="28" r="${r}" 
                        stroke="#10b981" 
                        stroke-dasharray="${circ}" 
                        stroke-dashoffset="${compRingOffset}"></circle>
              </svg>
              <span class="analytics-kpi-ring-text">${metrics.completionRate}%</span>
            </div>
          </div>

          <div class="analytics-kpi-card">
            <div class="analytics-kpi-info">
              <span class="analytics-kpi-label">Em Execução</span>
              <span class="analytics-kpi-value" style="color: #fdab3d;">${metrics.inProgress}</span>
              <span class="analytics-kpi-sub">${reviewCount} aguardando revisão</span>
            </div>
            <div class="metric-icon-box progress" style="width: 52px; height: 52px; border-radius: var(--radius-lg);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>

          <div class="analytics-kpi-card">
            <div class="analytics-kpi-info">
              <span class="analytics-kpi-label">Prazos & SLA</span>
              <span class="analytics-kpi-value" style="color: ${metrics.overdue > 0 ? '#ef4444' : '#10b981'};">
                ${metrics.overdue > 0 ? `${metrics.overdue} Atraso${metrics.overdue > 1 ? 's' : ''}` : '100% no Prazo'}
              </span>
              <span class="analytics-kpi-sub">${metrics.overdue > 0 ? 'Exigem ação e prioridade' : 'Nenhuma tarefa vencida'}</span>
            </div>
            <div class="metric-icon-box ${metrics.overdue > 0 ? 'urgent' : 'completed'}" style="width: 52px; height: 52px; border-radius: var(--radius-lg);">
              ${metrics.overdue > 0 
                ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" x2="12"/><line x1="12" x2="12.01" y1="17" x2="17"/></svg>'
                : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
              }
            </div>
          </div>

          <div class="analytics-kpi-card">
            <div class="analytics-kpi-info">
              <span class="analytics-kpi-label">Checklists / Subitens</span>
              <span class="analytics-kpi-value">${subtaskPct}%</span>
              <span class="analytics-kpi-sub">${doneSubtasks} de ${totalSubtasks} itens validados</span>
            </div>
            <div class="analytics-kpi-ring-wrap" title="Checklist: ${subtaskPct}%">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle class="analytics-kpi-ring-bg" cx="28" cy="28" r="${r}"></circle>
                <circle class="analytics-kpi-ring-fill" cx="28" cy="28" r="${r}" 
                        stroke="#6366f1" 
                        stroke-dasharray="${circ}" 
                        stroke-dashoffset="${subtaskRingOffset}"></circle>
              </svg>
              <span class="analytics-kpi-ring-text">${subtaskPct}%</span>
            </div>
          </div>
        </div>

        <!-- 3. Grid Principal de Distribuição (Status & Prioridades) -->
        <div class="analytics-content-grid">
          
          <!-- Painel: Distribuição de Tarefas por Status -->
          <div class="analytics-panel">
            <div class="analytics-panel-header">
              <div>
                <h3 class="analytics-panel-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                  Distribuição por Status
                </h3>
                <span class="analytics-panel-subtitle">Composição atual da esteira de trabalho</span>
              </div>
            </div>

            <!-- Barra Segmentada Visual -->
            <div class="status-segmented-track" title="Distribuição de Status">
              ${donePct > 0 ? `<div class="status-segment seg-done" style="width: ${donePct}%;" title="Concluído: ${doneCount} (${donePct}%)"></div>` : ''}
              ${reviewPct > 0 ? `<div class="status-segment seg-review" style="width: ${reviewPct}%;" title="Revisão: ${reviewCount} (${reviewPct}%)"></div>` : ''}
              ${inProgressPct > 0 ? `<div class="status-segment seg-progress" style="width: ${inProgressPct}%;" title="Em Andamento: ${inProgressCount} (${inProgressPct}%)"></div>` : ''}
              ${todoPct > 0 ? `<div class="status-segment seg-todo" style="width: ${todoPct}%;" title="A Fazer: ${todoCount} (${todoPct}%)"></div>` : ''}
            </div>

            <!-- Lista de Cards por Status -->
            <div class="status-breakdown-list">
              <div class="status-breakdown-item item-done">
                <span class="status-item-label">Concluído</span>
                <span class="status-item-count" style="color: #00c875;">${doneCount}</span>
                <span class="status-item-pct">${donePct}% do total</span>
              </div>

              <div class="status-breakdown-item item-progress">
                <span class="status-item-label">Em Andamento</span>
                <span class="status-item-count" style="color: #fdab3d;">${inProgressCount}</span>
                <span class="status-item-pct">${inProgressPct}% do total</span>
              </div>

              <div class="status-breakdown-item item-review">
                <span class="status-item-label">Revisão</span>
                <span class="status-item-count" style="color: #579bfc;">${reviewCount}</span>
                <span class="status-item-pct">${reviewPct}% do total</span>
              </div>

              <div class="status-breakdown-item item-todo">
                <span class="status-item-label">A Fazer</span>
                <span class="status-item-count" style="color: #64748b;">${todoCount}</span>
                <span class="status-item-pct">${todoPct}% do total</span>
              </div>
            </div>
          </div>

          <!-- Painel: Carga por Nível de Prioridade -->
          <div class="analytics-panel">
            <div class="analytics-panel-header">
              <div>
                <h3 class="analytics-panel-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Carga por Prioridade
                </h3>
                <span class="analytics-panel-subtitle">Nível de criticidade das demandas cadastradas</span>
              </div>
            </div>

            <div class="priority-breakdown-stack">
              ${priorityRowsHtml}
            </div>
          </div>

        </div>

        <!-- 4. Desempenho por Categoria em Card Grid -->
        <div class="analytics-panel">
          <div class="analytics-panel-header">
            <div>
              <h3 class="analytics-panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                Desempenho por Categoria
              </h3>
              <span class="analytics-panel-subtitle">Progresso e volume de entrega por área de negócio</span>
            </div>
          </div>

          <div class="category-card-grid">
            ${catCardsHtml}
          </div>
        </div>

        <!-- 5. Distribuição por Responsável -->
        <div class="analytics-panel">
          <div class="analytics-panel-header">
            <div>
              <h3 class="analytics-panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Carga de Trabalho da Equipe
              </h3>
              <span class="analytics-panel-subtitle">Volume e taxa de finalização por membro responsável</span>
            </div>
          </div>

          <div class="team-workload-grid">
            ${teamCardsHtml}
          </div>
        </div>

      </div>
    `;
  }

  function renderMetrics(metrics) {
    document.getElementById('metric-total').textContent = metrics.total;
    document.getElementById('metric-progress').textContent = metrics.inProgress;
    document.getElementById('metric-done').textContent = metrics.done;
    document.getElementById('metric-urgent').textContent = metrics.overdue;

    document.getElementById('metric-rate-text').textContent = `${metrics.completionRate}%`;
    document.getElementById('metric-progress-bar').style.width = `${metrics.completionRate}%`;
  }

  function updateCategoryFilter(categories) {
    const select = document.getElementById('filter-category');
    const currentValue = select.value;

    select.innerHTML = '<option value="all">Todas as Categorias</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      if (cat === currentValue) opt.selected = true;
      select.appendChild(opt);
    });
  }

  // ==========================================================================
  // 6. Modal de Criação / Edição de Tarefas
  // ==========================================================================
  let currentModalSubtasks = [];

  function openTaskModal(task = null, defaultStatus = 'todo') {
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const taskIdInput = document.getElementById('task-id');
    const titleInput = document.getElementById('task-title');
    const descInput = document.getElementById('task-description');
    const statusSelect = document.getElementById('task-status');
    const prioritySelect = document.getElementById('task-priority');
    const categoryInput = document.getElementById('task-category');
    const dueDateInput = document.getElementById('task-duedate');

    if (task) {
      modalTitle.textContent = 'Editar Tarefa';
      taskIdInput.value = task.id;
      titleInput.value = task.title;
      descInput.value = task.description || '';
      statusSelect.value = task.status;
      prioritySelect.value = task.priority;
      categoryInput.value = task.category || 'Geral';
      dueDateInput.value = task.dueDate || '';
      currentModalSubtasks = task.subtasks ? JSON.parse(JSON.stringify(task.subtasks)) : [];
    } else {
      modalTitle.textContent = 'Nova Tarefa';
      taskIdInput.value = '';
      titleInput.value = '';
      descInput.value = '';
      statusSelect.value = defaultStatus;
      prioritySelect.value = 'medium';
      categoryInput.value = 'Trabalho';
      dueDateInput.value = '';
      currentModalSubtasks = [];
    }

    renderModalSubtasks();
    modal.classList.add('open');
    setTimeout(() => titleInput.focus(), 100);
  }

  function closeTaskModal() {
    const modal = document.getElementById('task-modal');
    modal.classList.remove('open');
  }

  function renderModalSubtasks() {
    const container = document.getElementById('modal-subtasks-list');
    container.innerHTML = '';

    currentModalSubtasks.forEach((sub, idx) => {
      const item = document.createElement('div');
      item.className = `checklist-item ${sub.done ? 'checked' : ''}`;
      item.innerHTML = `
        <input type="checkbox" ${sub.done ? 'checked' : ''} data-index="${idx}" class="subtask-checkbox" />
        <span>${escapeHtml(sub.text)}</span>
        <button type="button" class="checklist-item-remove" data-remove-index="${idx}" title="Remover item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      `;
      container.appendChild(item);
    });
  }

  function addModalSubtask(text) {
    if (!text.trim()) return;
    currentModalSubtasks.push({ text: text.trim(), done: false });
    renderModalSubtasks();
  }

  function removeModalSubtask(index) {
    currentModalSubtasks.splice(index, 1);
    renderModalSubtasks();
  }

  function toggleModalSubtask(index) {
    if (currentModalSubtasks[index]) {
      currentModalSubtasks[index].done = !currentModalSubtasks[index].done;
      renderModalSubtasks();
    }
  }

  function updateThemeIcon(theme) {
    const iconContainer = document.getElementById('theme-icon');
    if (theme === 'dark') {
      iconContainer.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
    } else {
      iconContainer.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
    }
  }

  // ==========================================================================
  // 7. Orquestração e Eventos
  // ==========================================================================
  function renderApp() {
    closeAllSprintPopovers();
    const filteredTasks = store.getFilteredTasks();
    const metrics = store.getMetrics();
    const categories = store.getCategories();

    const topMetricsGrid = document.querySelector('.metrics-grid');
    if (topMetricsGrid) {
      topMetricsGrid.style.display = (store.viewMode === 'analytics') ? 'none' : 'grid';
    }

    renderMetrics(metrics);
    updateCategoryFilter(categories);

    if (store.viewMode === 'sprint') {
      renderSprintTableView(filteredTasks);
    } else if (store.viewMode === 'kanban') {
      renderKanbanView(filteredTasks);
      initDragAndDrop();
    } else if (store.viewMode === 'calendar') {
      renderCalendarView(filteredTasks);
    } else if (store.viewMode === 'analytics') {
      renderAnalyticsView(filteredTasks, metrics);
    } else if (store.viewMode === 'ai-report') {
      renderAiReportView();
    } else {
      renderListView(filteredTasks);
    }
    updateSidebarBadges(store.tasks);
  }

  function updateSidebarBadges(tasks) {
    const kanbanBadge = document.querySelector('.sidebar-item[data-page="kanban"] .sidebar-badge');
    if (kanbanBadge) {
      const activeTasks = tasks.filter(t => t.status !== 'done').length;
      kanbanBadge.textContent = activeTasks;
    }

    const catItems = document.querySelectorAll('.sidebar-cat-item');
    catItems.forEach(item => {
      const cat = item.dataset.cat;
      const countSpan = item.querySelector('.sidebar-cat-count');
      if (countSpan && cat) {
        const count = tasks.filter(t => t.category === cat).length;
        countSpan.textContent = count;
      }
    });
  }

  function setupEventListeners() {
    const viewSprintBtn = document.getElementById('view-sprint-btn');
    const viewKanbanBtn = document.getElementById('view-kanban-btn');
    const viewListBtn = document.getElementById('view-list-btn');
    const viewCalendarBtn = document.getElementById('view-calendar-btn');
    const viewAnalyticsBtn = document.getElementById('view-analytics-btn');
    const viewAiReportBtn = document.getElementById('view-ai-report-btn');

    function updateViewTabs(activeMode) {
      if (viewSprintBtn) {
        viewSprintBtn.classList.toggle('active', activeMode === 'sprint');
        viewSprintBtn.setAttribute('aria-selected', activeMode === 'sprint');
      }
      if (viewKanbanBtn) {
        viewKanbanBtn.classList.toggle('active', activeMode === 'kanban');
        viewKanbanBtn.setAttribute('aria-selected', activeMode === 'kanban');
      }
      if (viewListBtn) {
        viewListBtn.classList.toggle('active', activeMode === 'list');
        viewListBtn.setAttribute('aria-selected', activeMode === 'list');
      }
      if (viewCalendarBtn) {
        viewCalendarBtn.classList.toggle('active', activeMode === 'calendar');
        viewCalendarBtn.setAttribute('aria-selected', activeMode === 'calendar');
      }
      if (viewAnalyticsBtn) {
        viewAnalyticsBtn.classList.toggle('active', activeMode === 'analytics');
        viewAnalyticsBtn.setAttribute('aria-selected', activeMode === 'analytics');
      }
      if (viewAiReportBtn) {
        viewAiReportBtn.classList.toggle('active', activeMode === 'ai-report');
        viewAiReportBtn.setAttribute('aria-selected', activeMode === 'ai-report');
      }

      // Sincronizar sidebar
      const sidebarItems = document.querySelectorAll('#app-sidebar .sidebar-item');
      sidebarItems.forEach(item => {
        const page = item.dataset.page;
        const shouldBeActive = (page === 'dashboard' && activeMode === 'sprint') ||
                               (page === 'kanban' && activeMode === 'kanban') ||
                               (page === 'calendar' && activeMode === 'calendar') ||
                               (page === 'analytics' && activeMode === 'analytics') ||
                               (page === 'ai-report' && activeMode === 'ai-report');
        item.classList.toggle('active', shouldBeActive);
      });
    }

    window.MunagoSetViewMode = (mode) => {
      store.viewMode = mode;
      updateViewTabs(mode);
      renderApp();
    };
    window.TaskFlowSetViewMode = window.MunagoSetViewMode;

    if (viewSprintBtn) {
      viewSprintBtn.addEventListener('click', () => {
        window.MunagoSetViewMode('sprint');
      });
    }

    if (viewKanbanBtn) {
      viewKanbanBtn.addEventListener('click', () => {
        window.MunagoSetViewMode('kanban');
      });
    }

    if (viewListBtn) {
      viewListBtn.addEventListener('click', () => {
        window.MunagoSetViewMode('list');
      });
    }

    if (viewCalendarBtn) {
      viewCalendarBtn.addEventListener('click', () => {
        window.MunagoSetViewMode('calendar');
      });
    }

    if (viewAnalyticsBtn) {
      viewAnalyticsBtn.addEventListener('click', () => {
        window.MunagoSetViewMode('analytics');
      });
    }

    if (viewAiReportBtn) {
      viewAiReportBtn.addEventListener('click', () => {
        window.MunagoSetViewMode('ai-report');
      });
    }

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
      store.filters.search = e.target.value.trim();
      renderApp();
    });

    const filterStatus = document.getElementById('filter-status');
    filterStatus.addEventListener('change', (e) => {
      store.filters.status = e.target.value;
      renderApp();
    });

    const filterPriority = document.getElementById('filter-priority');
    filterPriority.addEventListener('change', (e) => {
      store.filters.priority = e.target.value;
      renderApp();
    });

    const filterCategory = document.getElementById('filter-category');
    filterCategory.addEventListener('change', (e) => {
      store.filters.category = e.target.value;
      renderApp();
    });

    const sortBy = document.getElementById('sort-by');
    sortBy.addEventListener('change', (e) => {
      store.filters.sortBy = e.target.value;
      renderApp();
    });

    const clearFiltersBtn = document.getElementById('btn-clear-filters');
    clearFiltersBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterStatus.value = 'all';
      filterPriority.value = 'all';
      filterCategory.value = 'all';
      sortBy.value = 'dueDate';

      store.filters = {
        search: '',
        status: 'all',
        priority: 'all',
        category: 'all',
        sortBy: 'dueDate'
      };
      renderApp();
      showToast('Filtros redefinidos', 'info');
    });

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = store.toggleTheme();
      updateThemeIcon(newTheme);
      showToast(`Modo ${newTheme === 'dark' ? 'Escuro' : 'Claro'} ativado`, 'info');
    });

    document.getElementById('btn-export-backup').addEventListener('click', () => {
      store.exportData();
      showToast('Backup exportado com sucesso!', 'success');
    });

    const importInput = document.getElementById('import-file-input');
    document.getElementById('btn-import-backup').addEventListener('click', () => {
      importInput.click();
    });

    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const ok = store.importData(event.target.result);
        if (ok) {
          showToast('Dados restaurados com sucesso!', 'success');
        } else {
          showToast('Erro ao importar arquivo de backup.', 'error');
        }
        importInput.value = '';
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-new-task').addEventListener('click', () => {
      openTaskModal();
    });

    const viewContainer = document.getElementById('view-container');
    viewContainer.addEventListener('click', (e) => {
      // 1. Alterar Status na Tabela Sprint (Popover Monday Style)
      const statusCell = e.target.closest('[data-action="change-status"]');
      if (statusCell) {
        e.stopPropagation();
        closeAllSprintPopovers();
        const taskId = statusCell.dataset.taskId;
        const rect = statusCell.getBoundingClientRect();

        const popover = document.createElement('div');
        popover.className = 'sprint-popover-menu';
        popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
        popover.style.left = `${rect.left + window.scrollX}px`;
        popover.style.minWidth = `${Math.max(rect.width, 160)}px`;

        const options = [
          { status: 'done', label: 'Feito', color: '#00c875' },
          { status: 'review', label: 'Aguardando revisão', color: '#579bfc' },
          { status: 'in_progress', label: 'Em andamento', color: '#fdab3d' },
          { status: 'todo', label: 'A Fazer', color: '#64748b' }
        ];

        options.forEach(opt => {
          const item = document.createElement('div');
          item.className = 'sprint-popover-item';
          item.style.backgroundColor = opt.color;
          item.textContent = opt.label;
          item.addEventListener('click', (ev) => {
            ev.stopPropagation();
            store.moveTaskStatus(taskId, opt.status);
            if (opt.status === 'done') {
              triggerConfetti();
              showToast('Tarefa marcada como Feito! 🎉', 'success');
            } else {
              showToast(`Status alterado para: ${opt.label}`, 'info');
            }
            popover.remove();
          });
          popover.appendChild(item);
        });

        document.body.appendChild(popover);
        const onDocClick = (ev) => {
          if (!popover.contains(ev.target)) {
            popover.remove();
            document.removeEventListener('click', onDocClick);
          }
        };
        setTimeout(() => document.addEventListener('click', onDocClick), 50);
        return;
      }

      // 2. Alterar Tipo na Tabela Sprint (Popover Monday Style)
      const typeCell = e.target.closest('[data-action="change-type"]');
      if (typeCell) {
        e.stopPropagation();
        closeAllSprintPopovers();
        const taskId = typeCell.dataset.taskId;
        const rect = typeCell.getBoundingClientRect();

        const popover = document.createElement('div');
        popover.className = 'sprint-popover-menu';
        popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
        popover.style.left = `${rect.left + window.scrollX}px`;
        popover.style.minWidth = `${Math.max(rect.width, 170)}px`;

        const typeOptions = [
          { type: 'Estoque', label: 'Estoque', color: '#579bfc' },
          { type: 'Funcionalidade', label: 'Funcionalidade', color: '#00c875' },
          { type: 'Outro', label: 'Outro', color: '#2ba7ff' },
          { type: 'Resolução de Problemas', label: 'Resolução de Problemas', color: '#ffcb00', textColor: '#1a1e2e' },
          { type: 'Redução de Custos', label: 'Redução de Custos', color: '#ff642e' },
          { type: 'Infraestrutura', label: 'Infraestrutura', color: '#8b5cf6' }
        ];

        typeOptions.forEach(opt => {
          const item = document.createElement('div');
          item.className = 'sprint-popover-item';
          item.style.backgroundColor = opt.color;
          if (opt.textColor) item.style.color = opt.textColor;
          item.textContent = opt.label;
          item.addEventListener('click', (ev) => {
            ev.stopPropagation();
            store.updateTask(taskId, { type: opt.type, category: opt.type });
            showToast(`Tipo alterado para: ${opt.label}`, 'info');
            popover.remove();
          });
          popover.appendChild(item);
        });

        document.body.appendChild(popover);
        const onDocClick = (ev) => {
          if (!popover.contains(ev.target)) {
            popover.remove();
            document.removeEventListener('click', onDocClick);
          }
        };
        setTimeout(() => document.addEventListener('click', onDocClick), 50);
        return;
      }

      // 3. Toggle de Checkbox da Tabela Sprint
      const toggleDoneCheck = e.target.closest('[data-action="toggle-done"]');
      if (toggleDoneCheck) {
        const row = toggleDoneCheck.closest('[data-task-id]');
        if (row) {
          const taskId = row.dataset.taskId;
          const task = store.getTaskById(taskId);
          if (task) {
            const newStatus = toggleDoneCheck.checked ? 'done' : 'in_progress';
            store.moveTaskStatus(taskId, newStatus);
            if (newStatus === 'done') {
              triggerConfetti();
              showToast('Tarefa marcada como Feito! 🎉', 'success');
            } else {
              showToast('Tarefa reaberta', 'info');
            }
          }
        }
        return;
      }

      // 4. Remover Épico
      const removeEpicBtn = e.target.closest('[data-action="remove-epic"]');
      if (removeEpicBtn) {
        const taskId = removeEpicBtn.dataset.taskId;
        if (taskId) {
          store.updateTask(taskId, { epic: '' });
          showToast('Épico removido', 'info');
        }
        return;
      }

      // 5. Abrir Notas / Detalhes
      const openNotesBtn = e.target.closest('[data-action="open-notes"]');
      if (openNotesBtn) {
        const row = openNotesBtn.closest('[data-task-id]');
        if (row) {
          const task = store.getTaskById(row.dataset.taskId);
          if (task) openTaskModal(task);
        }
        return;
      }

      // 6. Seleção de Linha (Highlight Visual)
      const clickedRow = e.target.closest('.sprint-row');
      if (clickedRow && !e.target.closest('button, input, a')) {
        document.querySelectorAll('.sprint-row').forEach(r => r.classList.remove('is-selected'));
        clickedRow.classList.add('is-selected');
      }

      // 7. Botão Adicionar Tarefa por Coluna no Kanban
      const colAddBtn = e.target.closest('[data-add-status]');
      if (colAddBtn) {
        openTaskModal(null, colAddBtn.dataset.addStatus);
        return;
      }

      // 8. Avançar Tarefa no Kanban
      const advanceBtn = e.target.closest('[data-action="advance"]');
      if (advanceBtn) {
        const card = advanceBtn.closest('[data-task-id]');
        if (card) {
          const taskId = card.dataset.taskId;
          const nextStatus = advanceBtn.dataset.next;
          store.moveTaskStatus(taskId, nextStatus);
          if (nextStatus === 'done') {
            triggerConfetti();
            showToast('Parabéns! Tarefa concluída 🎉', 'success');
          } else {
            showToast('Tarefa movida para Em Andamento', 'info');
          }
        }
        return;
      }

      // 9. Alternar Status na Lista
      const toggleStatusBtn = e.target.closest('[data-action="toggle-status"]');
      if (toggleStatusBtn) {
        const item = toggleStatusBtn.closest('[data-task-id]');
        if (item) {
          const taskId = item.dataset.taskId;
          const task = store.getTaskById(taskId);
          if (task) {
            const newStatus = task.status === 'done' ? 'todo' : 'done';
            store.moveTaskStatus(taskId, newStatus);
            if (newStatus === 'done') {
              triggerConfetti();
              showToast('Tarefa concluída! 🎉', 'success');
            } else {
              showToast('Tarefa reaberta', 'info');
            }
          }
        }
        return;
      }

      // 10. Editar Tarefa
      const editBtn = e.target.closest('[data-action="edit"]');
      if (editBtn) {
        const element = editBtn.closest('[data-task-id]');
        if (element) {
          const task = store.getTaskById(element.dataset.taskId);
          if (task) openTaskModal(task);
        }
        return;
      }

      // 11. Excluir Tarefa
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (deleteBtn) {
        const element = deleteBtn.closest('[data-task-id]');
        if (element) {
          const taskId = element.dataset.taskId;
          if (confirm('Deseja realmente excluir esta tarefa?')) {
            store.deleteTask(taskId);
            showToast('Tarefa excluída', 'warning');
          }
        }
        return;
      }
    });

    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const taskId = document.getElementById('task-id').value;
      const title = document.getElementById('task-title').value;
      const description = document.getElementById('task-description').value;
      const status = document.getElementById('task-status').value;
      const priority = document.getElementById('task-priority').value;
      const category = document.getElementById('task-category').value;
      const dueDate = document.getElementById('task-duedate').value;
      const subtasks = currentModalSubtasks;

      if (!title.trim()) {
        showToast('O título da tarefa é obrigatório', 'error');
        return;
      }

      if (taskId) {
        const prevTask = store.getTaskById(taskId);
        store.updateTask(taskId, {
          title,
          description,
          status,
          priority,
          category,
          dueDate,
          subtasks
        });

        if (status === 'done' && prevTask && prevTask.status !== 'done') {
          triggerConfetti();
        }
        showToast('Tarefa atualizada com sucesso!', 'success');
      } else {
        store.addTask({
          title,
          description,
          status,
          priority,
          category,
          dueDate,
          subtasks
        });
        if (status === 'done') triggerConfetti();
        showToast('Nova tarefa criada!', 'success');
      }

      closeTaskModal();
    });

    document.getElementById('modal-close-btn').addEventListener('click', closeTaskModal);
    document.getElementById('modal-cancel-btn').addEventListener('click', closeTaskModal);
    document.getElementById('task-modal').addEventListener('click', (e) => {
      if (e.target.id === 'task-modal') {
        closeTaskModal();
      }
    });

    const subtaskInput = document.getElementById('modal-subtask-input');
    const addSubtaskBtn = document.getElementById('btn-add-subtask');

    addSubtaskBtn.addEventListener('click', () => {
      addModalSubtask(subtaskInput.value);
      subtaskInput.value = '';
      subtaskInput.focus();
    });

    subtaskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addModalSubtask(subtaskInput.value);
        subtaskInput.value = '';
      }
    });

    const modalSubtasksList = document.getElementById('modal-subtasks-list');
    modalSubtasksList.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove-index]');
      if (removeBtn) {
        removeModalSubtask(parseInt(removeBtn.dataset.removeIndex, 10));
        return;
      }

      const checkbox = e.target.closest('.subtask-checkbox');
      if (checkbox) {
        toggleModalSubtask(parseInt(checkbox.dataset.index, 10));
      }
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isTyping = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if (e.key === 'Escape') {
        closeTaskModal();
        return;
      }

      if (!isTyping) {
        if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          openTaskModal();
        }
        if (e.key === '/') {
          e.preventDefault();
          const search = document.getElementById('search-input');
          if (search) search.focus();
        }
      }
    });
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    window.TaskFlowShowToast = showToast;
    window.TaskFlowTriggerConfetti = triggerConfetti;

    store.setTheme(store.theme);
    updateThemeIcon(store.theme);
    store.subscribe(() => renderApp());
    renderApp();
    setupEventListeners();
    setupKeyboardShortcuts();

    if (window.authManager) {
      window.authManager.updateHeaderProfile();
    }
  }

})();
