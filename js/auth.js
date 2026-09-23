/**
 * TaskFlow - Authentication & Profile Manager
 * Gerencia login, cadastro de contas, validações de senha e transições animadas
 */

(function () {
  'use strict';

  const USERS_STORAGE_KEY = 'taskflow_users_v1';
  const SESSION_STORAGE_KEY = 'taskflow_current_user_v1';

  const DEFAULT_USER = {
    id: 'user-demo-1',
    name: 'Murillo Silva',
    email: 'murillo@exemplo.com',
    password: 'password123',
    initials: 'MS',
    createdAt: new Date().toISOString()
  };

  class AuthManager {
    constructor() {
      this.users = this.loadUsers();
      this.currentUser = this.loadSession();
      this.init();
    }

    loadUsers() {
      try {
        const raw = localStorage.getItem(USERS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Erro ao ler usuários:', e);
      }
      const initial = [DEFAULT_USER];
      this.saveUsers(initial);
      return initial;
    }

    saveUsers(users = this.users) {
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      } catch (e) {
        console.error('Erro ao salvar usuários:', e);
      }
    }

    loadSession() {
      try {
        const raw = localStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.error('Erro ao ler sessão:', e);
      }
      // Se não houver sessão salva, retorna nulo para exigir login
      return null;
    }

    saveSession(user) {
      this.currentUser = user;
      try {
        if (user) {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch (e) {
        console.error('Erro ao salvar sessão:', e);
      }
      this.updateHeaderProfile();
    }

    getInitials(name) {
      if (!name) return 'TF';
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    login(email, password) {
      const trimmedEmail = email.trim().toLowerCase();
      const user = this.users.find(u => u.email.toLowerCase() === trimmedEmail);

      if (!user) {
        return { success: false, message: 'Nenhuma conta encontrada com este e-mail.' };
      }

      if (user.password !== password) {
        return { success: false, message: 'Senha incorreta. Tente novamente.' };
      }

      this.saveSession(user);
      return { success: true, user };
    }

    register(name, email, password) {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedName || !trimmedEmail || !password) {
        return { success: false, message: 'Preencha todos os campos obrigatórios.' };
      }

      const existing = this.users.find(u => u.email.toLowerCase() === trimmedEmail);
      if (existing) {
        return { success: false, message: 'Este e-mail já está cadastrado no sistema.' };
      }

      const newUser = {
        id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: trimmedName,
        email: trimmedEmail,
        password: password,
        initials: this.getInitials(trimmedName),
        createdAt: new Date().toISOString()
      };

      this.users.push(newUser);
      this.saveUsers();
      this.saveSession(newUser);

      return { success: true, user: newUser };
    }

    logout() {
      this.saveSession(null);
      this.openAuthModal('login');
      if (window.TaskFlowShowToast) {
        window.TaskFlowShowToast('Você saiu da sua conta', 'info');
      }
    }

    checkPasswordStrength(password) {
      let score = 0;
      if (!password) return { score: 0, label: 'Muito fraca', class: 'weak' };

      if (password.length >= 6) score++;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      if (score <= 2) {
        return { score: 1, label: 'Fraca', class: 'weak' };
      } else if (score <= 3) {
        return { score: 2, label: 'Média', class: 'medium' };
      } else {
        return { score: 3, label: 'Forte e segura', class: 'strong' };
      }
    }

    openAuthModal(mode = 'login') {
      const overlay = document.getElementById('auth-overlay');
      const container = document.getElementById('auth-container');
      if (!overlay || !container) return;

      if (mode === 'register') {
        container.classList.add('right-panel-active');
      } else {
        container.classList.remove('right-panel-active');
      }

      overlay.classList.add('active');
      
      const appContainer = document.querySelector('.app-container');
      if (appContainer && !this.currentUser) {
        appContainer.style.display = 'none';
      }
    }

    closeAuthModal() {
      const overlay = document.getElementById('auth-overlay');
      if (overlay) overlay.classList.remove('active');
      
      const appContainer = document.querySelector('.app-container');
      if (appContainer) {
        appContainer.style.display = '';
      }
    }

    updateHeaderProfile() {
      const profileContainer = document.getElementById('user-profile-slot');
      if (!profileContainer) return;

      if (this.currentUser) {
        profileContainer.innerHTML = `
          <div class="user-profile-menu">
            <button id="btn-user-menu" class="user-profile-btn" aria-haspopup="true" aria-expanded="false" title="Menu da Conta">
              <div class="user-avatar">${this.currentUser.initials || 'US'}</div>
              <span class="user-name">${this.currentUser.name.split(' ')[0]}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div id="user-dropdown-menu" class="user-dropdown" role="menu">
              <div class="dropdown-header">
                <div class="dropdown-user-name">${this.currentUser.name}</div>
                <div class="dropdown-user-email">${this.currentUser.email}</div>
              </div>
              <button class="dropdown-item" id="menu-switch-account">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>Trocar de Conta</span>
              </button>
              <button class="dropdown-item danger" id="menu-logout">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                <span>Sair da Conta</span>
              </button>
            </div>
          </div>
        `;

        const btnMenu = document.getElementById('btn-user-menu');
        const dropdown = document.getElementById('user-dropdown-menu');

        btnMenu.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = dropdown.classList.contains('open');
          dropdown.classList.toggle('open', !isOpen);
          btnMenu.setAttribute('aria-expanded', !isOpen);
        });

        document.getElementById('menu-switch-account').addEventListener('click', () => {
          dropdown.classList.remove('open');
          this.openAuthModal('login');
        });

        document.getElementById('menu-logout').addEventListener('click', () => {
          dropdown.classList.remove('open');
          this.logout();
        });
      } else {
        profileContainer.innerHTML = `
          <button id="btn-open-login" class="btn btn-secondary" title="Fazer login ou criar conta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
            <span>Entrar</span>
          </button>
        `;

        document.getElementById('btn-open-login').addEventListener('click', () => {
          this.openAuthModal('login');
        });
      }
    }

    init() {
      // Se não houver usuário logado, esconde o sistema e exibe a tela de login
      if (!this.currentUser) {
        const appContainer = document.querySelector('.app-container');
        if (appContainer) appContainer.style.display = 'none';
        
        // Garante que o modal abra mesmo se o DOM estiver terminando de carregar
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.openAuthModal('login'));
        } else {
          setTimeout(() => this.openAuthModal('login'), 0);
        }
      }

      // Fecha dropdown ao clicar fora
      document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('user-dropdown-menu');
        const btnMenu = document.getElementById('btn-user-menu');
        if (dropdown && btnMenu && !btnMenu.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
          btnMenu.setAttribute('aria-expanded', 'false');
        }
      });

      this.setupDOMEvents();
    }

    setupDOMEvents() {
      // Elementos de alternância da animação deslizante
      const container = document.getElementById('auth-container');
      const btnToSignUp = document.getElementById('btn-to-signup');
      const btnToSignIn = document.getElementById('btn-to-signin');
      const mobileToSignUp = document.getElementById('mobile-to-signup');
      const mobileToSignIn = document.getElementById('mobile-to-signin');

      if (btnToSignUp) {
        btnToSignUp.addEventListener('click', () => {
          container.classList.add('right-panel-active');
        });
      }

      if (btnToSignIn) {
        btnToSignIn.addEventListener('click', () => {
          container.classList.remove('right-panel-active');
        });
      }

      if (mobileToSignUp) {
        mobileToSignUp.addEventListener('click', () => {
          container.classList.add('right-panel-active');
        });
      }

      if (mobileToSignIn) {
        mobileToSignIn.addEventListener('click', () => {
          container.classList.remove('right-panel-active');
        });
      }

      // Botão fechar modal
      const btnClose = document.getElementById('btn-close-auth');
      if (btnClose) {
        btnClose.addEventListener('click', () => this.closeAuthModal());
      }

      // Modo visitante / convidado
      const guestButtons = document.querySelectorAll('[data-action="guest-mode"]');
      guestButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.closeAuthModal();
          if (window.TaskFlowShowToast) {
            window.TaskFlowShowToast('Acessando como Convidado', 'info');
          }
        });
      });

      // Alternar visibilidade de senha
      const togglePasswordBtns = document.querySelectorAll('.btn-toggle-password');
      togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const input = btn.parentElement.querySelector('input');
          if (input) {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.innerHTML = isPassword
              ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>'
              : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
          }
        });
      });

      // Medidor de força de senha no cadastro
      const registerPasswordInput = document.getElementById('register-password');
      const strengthStep1 = document.getElementById('strength-step-1');
      const strengthStep2 = document.getElementById('strength-step-2');
      const strengthStep3 = document.getElementById('strength-step-3');
      const strengthLabel = document.getElementById('strength-label');

      if (registerPasswordInput) {
        registerPasswordInput.addEventListener('input', (e) => {
          const pass = e.target.value;
          const result = this.checkPasswordStrength(pass);

          // Reset das classes
          [strengthStep1, strengthStep2, strengthStep3].forEach(step => {
            if (step) step.className = 'strength-step';
          });

          if (pass.length === 0) {
            if (strengthLabel) strengthLabel.textContent = 'Mínimo de 6 caracteres';
            return;
          }

          if (result.score >= 1 && strengthStep1) strengthStep1.classList.add(result.class);
          if (result.score >= 2 && strengthStep2) strengthStep2.classList.add(result.class);
          if (result.score >= 3 && strengthStep3) strengthStep3.classList.add(result.class);

          if (strengthLabel) strengthLabel.textContent = `Nível: ${result.label}`;
        });
      }

      // Submit do formulário de login
      const formLogin = document.getElementById('form-signin');
      if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = document.getElementById('login-email').value;
          const password = document.getElementById('login-password').value;

          const res = this.login(email, password);
          if (res.success) {
            this.closeAuthModal();
            if (window.TaskFlowShowToast) {
              window.TaskFlowShowToast(`Bem-vindo de volta, ${res.user.name}! 👋`, 'success');
            }
          } else {
            if (window.TaskFlowShowToast) {
              window.TaskFlowShowToast(res.message, 'error');
            }
          }
        });
      }

      // Submit do formulário de cadastro
      const formRegister = document.getElementById('form-signup');
      if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('register-name').value;
          const email = document.getElementById('register-email').value;
          const password = document.getElementById('register-password').value;
          const confirmPassword = document.getElementById('register-confirm-password').value;

          if (password !== confirmPassword) {
            if (window.TaskFlowShowToast) {
              window.TaskFlowShowToast('As senhas digitadas não coincidem.', 'error');
            }
            return;
          }

          if (password.length < 6) {
            if (window.TaskFlowShowToast) {
              window.TaskFlowShowToast('A senha precisa ter pelo menos 6 caracteres.', 'error');
            }
            return;
          }

          const res = this.register(name, email, password);
          if (res.success) {
            this.closeAuthModal();
            if (window.TaskFlowTriggerConfetti) {
              window.TaskFlowTriggerConfetti();
            }
            if (window.TaskFlowShowToast) {
              window.TaskFlowShowToast(`Conta criada com sucesso! Bem-vindo, ${res.user.name} 🎉`, 'success');
            }
          } else {
            if (window.TaskFlowShowToast) {
              window.TaskFlowShowToast(res.message, 'error');
            }
          }
        });
      }
    }
  }

  // Instancia e expõe globalmente
  window.authManager = new AuthManager();

})();
