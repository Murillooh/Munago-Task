/**
 * TaskFlow - UI Renderer & Interaction Controller
 * Gerencia renderização das telas (Kanban e Lista), Modais, Toasts e Confetes
 */

import { store } from './store.js';
import { attachCardDragListeners } from './dragdrop.js';

// Utilitários de Data e Prioridade
export function formatDueDate(dateString) {
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

const PRIORITY_LABELS = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente'
};

// ==========================================================================
// Renderizador do Kanban
// ==========================================================================
export function renderKanbanView(tasks) {
  const container = document.getElementById('view-container');
  container.innerHTML = `
    <div class="kanban-board animated-fade-in">
      <!-- Coluna: A Fazer -->
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

      <!-- Coluna: Em Andamento -->
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

      <!-- Coluna: Concluído -->
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

  // Agrupa tarefas por status
  const grouped = { todo: [], in_progress: [], done: [] };
  tasks.forEach(t => {
    if (grouped[t.status]) grouped[t.status].push(t);
  });

  // Atualiza contadores
  document.getElementById('count-todo').textContent = grouped.todo.length;
  document.getElementById('count-in_progress').textContent = grouped.in_progress.length;
  document.getElementById('count-done').textContent = grouped.done.length;

  // Renderiza cards em cada coluna
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

  // Subtarefas / Checklist
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

  // Next status action tooltip
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
        <span class="badge badge-category">${task.category}</span>
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

// ==========================================================================
// Renderizador da Visão em Lista
// ==========================================================================
export function renderListView(tasks) {
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

        <span class="badge badge-category list-item-category">${task.category}</span>
        
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
// Atualização de Métricas
// ==========================================================================
export function renderMetrics(metrics) {
  document.getElementById('metric-total').textContent = metrics.total;
  document.getElementById('metric-progress').textContent = metrics.inProgress;
  document.getElementById('metric-done').textContent = metrics.done;
  document.getElementById('metric-urgent').textContent = metrics.overdue;
  
  // Percentual
  document.getElementById('metric-rate-text').textContent = `${metrics.completionRate}%`;
  document.getElementById('metric-progress-bar').style.width = `${metrics.completionRate}%`;
}

// ==========================================================================
// Atualização das Opções do Filtro de Categoria
// ==========================================================================
export function updateCategoryFilter(categories) {
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
// Gerenciador de Subtarefas dentro do Modal
// ==========================================================================
let currentModalSubtasks = [];

export function openTaskModal(task = null, defaultStatus = 'todo') {
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

export function closeTaskModal() {
  const modal = document.getElementById('task-modal');
  modal.classList.remove('open');
}

export function renderModalSubtasks() {
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

export function addModalSubtask(text) {
  if (!text.trim()) return;
  currentModalSubtasks.push({ text: text.trim(), done: false });
  renderModalSubtasks();
}

export function removeModalSubtask(index) {
  currentModalSubtasks.splice(index, 1);
  renderModalSubtasks();
}

export function toggleModalSubtask(index) {
  if (currentModalSubtasks[index]) {
    currentModalSubtasks[index].done = !currentModalSubtasks[index].done;
    renderModalSubtasks();
  }
}

export function getModalSubtasks() {
  return currentModalSubtasks;
}

// ==========================================================================
// Toasts
// ==========================================================================
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
    warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
    error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>'
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

// ==========================================================================
// Efeito de Confetes ao Concluir Tarefas
// ==========================================================================
export function triggerConfetti() {
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
      p.vy += 0.38; // gravidade
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

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
