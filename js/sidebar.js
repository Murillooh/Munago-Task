/**
 * TaskFlow - Sidebar Controller
 * Gerencia colapsar/expandir, navegação, filtro por categoria e estado do sidebar
 */

(function () {
  'use strict';

  const SIDEBAR_STATE_KEY = 'taskflow_sidebar_collapsed';

  class SidebarManager {
    constructor() {
      this.sidebar = document.getElementById('app-sidebar');
      this.layout = document.querySelector('.app-layout');
      this.toggleBtn = document.getElementById('sidebar-toggle');
      this.isCollapsed = this.loadState();

      if (this.sidebar && this.layout) {
        this.init();
      }
    }

    loadState() {
      try {
        return localStorage.getItem(SIDEBAR_STATE_KEY) === 'true';
      } catch {
        return false;
      }
    }

    saveState() {
      try {
        localStorage.setItem(SIDEBAR_STATE_KEY, this.isCollapsed);
      } catch (e) {
        console.error('Erro ao salvar estado do sidebar:', e);
      }
    }

    init() {
      // Apply initial state
      if (this.isCollapsed) {
        this.layout.classList.add('sidebar-collapsed');
        if (this.toggleBtn) {
          this.toggleBtn.title = 'Expandir sidebar';
        }
      }

      // Toggle button
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => this.toggle());
      }

      // Navigation items
      const navItems = this.sidebar.querySelectorAll('.sidebar-item');
      navItems.forEach(item => {
        item.addEventListener('click', () => {
          navItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          const page = item.dataset.page;
          if (page === 'dashboard') {
            if (window.MunagoSetViewMode) {
              window.MunagoSetViewMode('sprint');
            } else {
              const sprintBtn = document.getElementById('view-sprint-btn');
              if (sprintBtn) sprintBtn.click();
            }
          } else if (page === 'kanban') {
            if (window.MunagoSetViewMode) {
              window.MunagoSetViewMode('kanban');
            } else {
              const kanbanBtn = document.getElementById('view-kanban-btn');
              if (kanbanBtn) kanbanBtn.click();
            }
          } else if (page === 'calendar') {
            if (window.MunagoSetViewMode) {
              window.MunagoSetViewMode('calendar');
            } else {
              const calBtn = document.getElementById('view-calendar-btn');
              if (calBtn) calBtn.click();
            }
          } else if (page === 'analytics') {
            if (window.MunagoSetViewMode) {
              window.MunagoSetViewMode('analytics');
            } else {
              const anaBtn = document.getElementById('view-analytics-btn');
              if (anaBtn) anaBtn.click();
            }
          } else if (page === 'ai-report') {
            if (window.MunagoSetViewMode) {
              window.MunagoSetViewMode('ai-report');
            } else {
              const aiBtn = document.getElementById('view-ai-report-btn');
              if (aiBtn) aiBtn.click();
            }
          }
        });
      });

      // Footer quick actions (Configurações & Ajuda)
      const footerBtns = this.sidebar.querySelectorAll('.sidebar-footer-btn');
      footerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const title = (btn.getAttribute('title') || '').toLowerCase();
          const toast = window.TaskFlowShowToast || console.log;
          if (title.includes('config')) {
            toast('Dica: Configure tema (Claro/Escuro) e backups no menu superior.', 'info');
          } else {
            toast('Atalhos: N (Nova Tarefa), / (Pesquisar), [ (Recolher Sidebar)', 'info');
          }
        });
      });

      // Category filter items
      const catItems = this.sidebar.querySelectorAll('.sidebar-cat-item');
      catItems.forEach(item => {
        item.addEventListener('click', () => {
          const cat = item.dataset.cat;
          const filterSelect = document.getElementById('filter-category');

          if (filterSelect) {
            // Check if option exists
            let optionExists = false;
            for (const opt of filterSelect.options) {
              if (opt.value === cat) {
                optionExists = true;
                break;
              }
            }

            if (optionExists) {
              filterSelect.value = cat;
              filterSelect.dispatchEvent(new Event('change'));
            }
          }

          // Visual feedback
          catItems.forEach(c => c.classList.remove('active'));
          item.classList.add('active');
        });
      });

      // Update storage meter
      this.updateStorageMeter();

      // Keyboard shortcut: [ to toggle sidebar
      document.addEventListener('keydown', (e) => {
        if (e.key === '[' && !e.ctrlKey && !e.metaKey) {
          const active = document.activeElement;
          const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT');
          if (!isTyping) {
            e.preventDefault();
            this.toggle();
          }
        }
      });
    }

    toggle() {
      this.isCollapsed = !this.isCollapsed;
      this.layout.classList.toggle('sidebar-collapsed', this.isCollapsed);
      this.saveState();

      // Update tooltip
      if (this.toggleBtn) {
        this.toggleBtn.title = this.isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar';
      }
    }

    updateStorageMeter() {
      try {
        let totalSize = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const value = localStorage.getItem(key);
          totalSize += (key.length + value.length) * 2; // UTF-16
        }
        const maxBytes = 5 * 1024 * 1024; // 5 MB limit
        const percent = Math.min(100, Math.round((totalSize / maxBytes) * 100));

        const fill = document.getElementById('sidebar-storage-fill');
        const text = document.querySelector('.sidebar-storage-text');

        if (fill) fill.style.width = percent + '%';
        if (text) {
          const kbUsed = (totalSize / 1024).toFixed(1);
          text.textContent = `${percent}% utilizado (${kbUsed} KB de 5 MB)`;
        }
      } catch (e) {
        // Silently ignore
      }
    }
  }

  // Init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SidebarManager());
  } else {
    new SidebarManager();
  }
})();
