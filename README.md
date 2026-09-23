# 🎯 Munago Tasks | Sistema Base de Controle de Tarefas

Um sistema web completo, moderno e altamente produtivo para organização de rotinas, projetos e tarefas pessoais ou corporativas.

---

## ✨ Destaques & Funcionalidades

- **📌 Quadro Kanban Interativo**:
  - Colunas: *A Fazer*, *Em Andamento* e *Concluído*.
  - Arrastar e soltar nativo (HTML5 Drag & Drop) com feedback visual de área de drop.
  - Botão de avanço rápido para mover tarefas com um único clique.
- **📋 Visão em Lista Detalhada**:
  - Visualização tabular/em cartões compactos com marcação de conclusão rápida.
- **📊 Painel de Métricas em Tempo Real (KPIs)**:
  - Total de Tarefas cadastradas.
  - Tarefas ativas Em Andamento.
  - Taxa percentual de Conclusão com barra de progresso dinâmica.
  - Alerta de tarefas com prazos vencidos ou atrasados.
- **🔍 Busca Instantânea e Filtros Avançados**:
  - Busca em tempo real por título, descrição ou categoria.
  - Filtro múltiplo por **Status**, **Prioridade** (*Baixa*, *Média*, *Alta*, *Urgente*) e **Categorias**.
  - Ordenação automática por prazo mais próximo, prioridade ou mais recentes.
- **✅ Checklist de Subtarefas**:
  - Adicione etapas/passos em cada tarefa com barra de progresso calculada automaticamente nos cartões.
- **🌓 Tema Escuro e Claro (Dark/Light Mode)**:
  - Alternância de tema com transições fluidas e paleta adaptada para conforto visual prolongado.
- **🎉 Feedback e Gamificação**:
  - Chuva de confetes festiva ao concluir tarefas.
  - Notificações Toast para todas as ações (criação, edição, exclusão).
- **💾 Persistência e Backup Seguro**:
  - Salva automaticamente no navegador (`LocalStorage`).
  - Botão **Backup**: Baixe todo o banco de tarefas em arquivo `.json`.
  - Botão **Importar**: Restaure ou migre suas tarefas com facilidade.
- **⌨️ Atalhos de Produtividade**:
  - Pressione `N` para abrir o modal de nova tarefa.
  - Pressione `/` para focar diretamente na barra de pesquisa.
  - Pressione `ESC` para fechar modais.

---

## 📁 Estrutura de Arquivos

```text
task-manager/
├── index.html              # Interface semântica da aplicação
├── README.md               # Documentação do projeto
├── css/
│   ├── variables.css       # Design tokens, temas e variáveis de cores
│   ├── style.css           # Estrutura base, grid e dashboard de métricas
│   └── components.css      # Estilização de botões, kanban, cards, modal e toasts
└── js/
    ├── app.js              # Script principal e orquestrador
    ├── store.js            # Gerenciamento de estado (versão modular)
    ├── ui.js               # Renderização de componentes e efeitos
    └── dragdrop.js         # Manipulação de arrasto e soltura
```

---

## 🚀 Como Executar

A aplicação não necessita de nenhuma biblioteca externa ou processo de compilação.

1. Navegue até a pasta do projeto:
   ```text
   C:\Users\Murillo Silva\.gemini\antigravity-ide\scratch\task-manager
   ```
2. **Opção 1 (Direto no Navegador)**: Dê um duplo clique no arquivo [`index.html`](index.html).
3. **Opção 2 (Servidor Local localhost)**: Execute o script [`server.ps1`](server.ps1) com PowerShell:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\server.ps1
   ```
   E acesse [http://localhost:8080/](http://localhost:8080/) no navegador.
4. O sistema já carrega com tarefas demonstrativas para você experimentar imediatamente!
