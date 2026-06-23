# Project Calendar — Frontend

Calendário visual para acompanhar projetos pessoais ao longo do tempo. Cada mês exibe um Pokémon diferente (começando em Bulbasaur em junho de 2026) e lista os projetos com seus períodos de atividade.

## Funcionalidades

- **Calendário mensal** com navegação por mês/ano
- **Projetos com períodos** — cada projeto pode ter múltiplos intervalos de datas exibidos como barras coloridas no calendário
- **Painel lateral com Pokémon** — o Pokémon do mês é exibido com sprite, tipos e flavor text via [PokéAPI](https://pokeapi.co/)
- **Modal de projeto** — exibe detalhes, tecnologias, status, links e períodos
- **Modo de edição** protegido por senha — permite criar, editar e excluir projetos e períodos
- **Status de projeto**: Planejamento, Em andamento, Concluído, Pausado

## Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

## Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:3333` (API REST em `/projects`)

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_EDIT_PASSWORD=sua_senha_aqui
```

## Instalação e execução

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Build

```bash
npm run build
```

Os arquivos de produção serão gerados em `dist/`.

## Estrutura do projeto

```
src/
├── components/
│   ├── Calendar.tsx        # Grade do calendário mensal
│   ├── PeriodsEditor.tsx   # Editor de períodos de um projeto
│   ├── PokemonPanel.tsx    # Painel lateral com Pokémon do mês
│   ├── ProjectForm.tsx     # Formulário de criação/edição de projeto
│   ├── ProjectModal.tsx    # Modal de visualização de projeto
│   └── Sidebar.tsx         # Barra lateral com lista de projetos
├── hooks/
│   └── usePokemon.ts       # Hook para buscar dados da PokéAPI
├── services/
│   └── api.ts              # Cliente HTTP para o backend
├── types/
│   └── project.ts          # Tipos TypeScript (Project, Period, etc.)
└── utils/
    └── month-pokemon.ts    # Mapeamento mês → Pokémon e cores por tipo
```

## API esperada

O frontend faz proxy de `/projects` para `http://localhost:3333`. Endpoints utilizados:

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/projects` | Lista todos os projetos |
| GET | `/projects/:id` | Busca um projeto |
| POST | `/projects` | Cria um projeto |
| PUT | `/projects/:id` | Atualiza um projeto |
| DELETE | `/projects/:id` | Remove um projeto |
| POST | `/projects/:id/periods` | Adiciona um período |
| PUT | `/projects/:id/periods/:pid` | Atualiza um período |
| DELETE | `/projects/:id/periods/:pid` | Remove um período |
