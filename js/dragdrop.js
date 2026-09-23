/**
 * TaskFlow - Drag & Drop Controller
 * Gerencia interações de arrastar e soltar nas colunas do Kanban
 */

import { store } from './store.js';
import { triggerConfetti } from './ui.js';

let draggedTaskId = null;

export function initDragAndDrop() {
  const columns = document.querySelectorAll('.kanban-column');

  columns.forEach(column => {
    // Permite que o elemento seja alvo de drop
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', (e) => {
      // Evita piscar quando passa por cima de filhos
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
        }
      }
    });
  });
}

export function attachCardDragListeners(cardElement, taskId) {
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
