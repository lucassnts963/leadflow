# 🚀 LeadFlow CRM — Geração e Gestão de Leads para Negócios Locais

CRM 100% client-side para prospecção e gestão de leads de **pequenos negócios locais**. Sem backend, sem banco de dados — tudo roda no navegador com dados armazenados no `localStorage`. Integra raspagem automática do Google Maps via Apify, pontuação inteligente de leads e mensagens de abordagem geradas por IA.

---

## 📸 Telas do Projeto

### Tela de Login
> Proteção por senha configurável. Na primeira vez, o usuário define a própria senha.

![Login](docs/screenshots/login.png)

---

### Dashboard — Visão Geral do Pipeline
> Métricas em tempo real: leads novos, contatados, negócios fechados, taxa de conversão e progresso de receita.

![Dashboard](docs/screenshots/dashboard.png)

---

### Tabela de Leads
> Lista completa de leads com filtros por temperatura (🔥 quente / 🟡 morno / 🔵 frio), status e categoria. Ordenação por pontuação, nome ou avaliações.

![Leads Table](docs/screenshots/leads-table.png)

---

### Scraper do Google Maps
> Busca automática de negócios no Google Maps via Apify. Basta informar o tipo de negócio e a cidade para importar dezenas de leads em segundos.

![Scraper](docs/screenshots/scraper.png)

---

### Geração de Mensagem com IA
> Gera mensagem personalizada de abordagem via WhatsApp usando IA, com base no perfil do lead (categoria, avaliações, presença digital).

![Mensagem IA](docs/screenshots/mensagem-ia.png)

---

### Tratamento de Objeções com IA
> Cole a objeção do cliente e a IA retorna diagnóstico, estratégia de vendas e resposta pronta para usar.

![Objeções](docs/screenshots/objecoes.png)

---

### Fechar Negócio
> Modal para registrar o fechamento: valor (R$), resultado (ganho/perdido) e observações.

![Deal Modal](docs/screenshots/deal-modal.png)

---

### Configurações
> Configure provedor de IA, chave da API Apify, URL do portfólio e senha de acesso — tudo pela interface, sem arquivo `.env`.

![Configurações](docs/screenshots/settings.png)

---

## ✨ Funcionalidades

### Importação de Leads
- **Raspagem do Google Maps** via Apify com busca por tipo de negócio + localização
- **Importação de CSV** com mapeamento automático de colunas
- **Cadastro manual** direto pela interface

### Pontuação Inteligente (0–100 pts)
| Critério | Pontuação |
|----------|-----------|
| Sem site (alta necessidade) | +25 pts |
| Tem Instagram | +10 pts |
| Tem telefone | +5 pts |
| 10+ avaliações no Google | +20 pts |
| Categoria de alta demanda (advocacia, clínicas, dentistas) | +10 pts |
| Site de baixa qualidade | +15 pts |

**Temperatura do lead:**
- 🔥 **Quente** (70+): Contato imediato recomendado
- 🟡 **Morno** (40–69): Abordagem estratégica
- 🔵 **Frio** (<40): Baixa prioridade

### Inteligência Artificial
- **Mensagem de abordagem**: Pitch personalizado para WhatsApp com base no perfil do lead
- **Análise de objeções**: Diagnóstico + estratégia + resposta pronta
- **Mensagem de follow-up**: Pós-venda para manter o cliente engajado
- Suporte a múltiplos provedores: DeepSeek (padrão), OpenAI, Groq, Together, OpenRouter

### Pipeline de Vendas
- Etapas: Novos → Contatados → Fechados (Ganho/Perdido)
- Rastreamento de receita com meta de R$5.000
- Taxa de conversão em tempo real
- Alerta de leads parados (sem contato há +3 dias)

### Exportação e Backup
- **CSV** com status, pontuação e dados de contato
- **JSON** com backup completo (incluindo histórico de deals)

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| UI | [React 18](https://react.dev/) |
| Estilização | [Tailwind CSS 3](https://tailwindcss.com/) |
| Animações | [Framer Motion 11](https://www.framer.com/motion/) |
| Ícones | [Lucide React](https://lucide.dev/) |
| Persistência | `localStorage` (sem backend) |
| Scraping | [Apify](https://apify.com/) — Google Maps Scraper |
| IA | OpenAI-compatible API (DeepSeek padrão) |

---

## 📁 Estrutura do Projeto

```
leadflow/
├── app/
│   ├── page.jsx                        # Ponto de entrada: AuthGate + LeadFlowClient
│   ├── layout.jsx                      # Layout global
│   ├── globals.css                     # Estilos globais (tema escuro)
│   ├── _lib/
│   │   ├── storage.js                  # CRUD no localStorage
│   │   ├── scoring.js                  # Algoritmo de pontuação de leads
│   │   ├── apify.js                    # Integração Google Maps Scraper
│   │   ├── llm.js                      # Cliente IA multi-provedor
│   │   └── csv.js                      # Parser e exportador CSV
│   └── _components/
│       ├── LeadFlowClient.jsx          # Shell principal (tabs, estado global)
│       ├── AuthGate.jsx                # Gate de autenticação por senha
│       ├── LeadsTable.jsx              # Tabela com filtros e busca
│       ├── LeadRow.jsx                 # Linha de lead com ações (msg, deal, editar)
│       ├── Dashboard.jsx               # Métricas e pipeline visual
│       ├── LeadScraper.jsx             # Interface do Apify scraper
│       ├── ObjectionHandler.jsx        # Modal de análise de objeções com IA
│       ├── DealModal.jsx               # Modal de fechamento de negócio
│       ├── SettingsPanel.jsx           # Painel de configurações
│       ├── LeadEditModal.jsx           # Modal de edição de lead
│       ├── CSVImport.jsx               # Upload e parsing de CSV
│       ├── ExportButton.jsx            # Exportação CSV/JSON
│       ├── StatsBar.jsx                # Barra de resumo rápido
│       └── HelpPanel.jsx               # Documentação inline
├── package.json
├── next.config.mjs
├── tailwind.config.js
└── README.md
```

---

## 🔄 Ciclo de Vida de um Lead

```
Importação
├── 📍 Apify (Google Maps)   → categoria detectada automaticamente
├── 📄 CSV upload            → mapeamento automático de colunas
└── ✏️  Cadastro manual       → via modal de edição

       ↓

Pontuação Automática (scoring.js)
  Score 0–100 + temperatura (hot/warm/cold) + motivos

       ↓

Banco de Leads (localStorage)
  Filtros: temperatura · status · categoria · resultado
  Busca: nome, negócio, telefone

       ↓

Ações por Lead
  ├── 💬 Gerar mensagem WhatsApp (IA)
  ├── 🤖 Analisar objeção (IA)
  ├── ✅ Registrar negócio (ganho/perdido + valor)
  ├── 📝 Editar dados + re-pontuar
  └── 🗑️  Arquivar / deletar

       ↓

Dashboard
  ├── Pipeline: Novos → Contatados → Fechados
  ├── Receita: R$ ganhos + meta
  ├── Conversão: % ganhos vs perdidos
  └── Alertas: leads sem contato há +3 dias

       ↓

Exportação
  ├── CSV (para Excel / Google Sheets)
  └── JSON (backup completo)
```

---

## 🤖 Integrações de IA

### Provedores Suportados

| Provedor | Endpoint | Modelos populares |
|----------|----------|-------------------|
| **DeepSeek** (padrão) | `https://api.deepseek.com/v1` | `deepseek-chat` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o`, `gpt-4o-mini` |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.3-70b`, `mixtral-8x7b` |
| Together AI | `https://api.together.xyz/v1` | Llama, Mixtral |
| OpenRouter | `https://openrouter.ai/api/v1` | Anthropic, Google, etc. |

### Casos de Uso da IA

**1. Geração de Mensagem de Abordagem**
```
Input:  lead.name, lead.business, lead.category,
        lead.reviews, lead.website, portfolioUrl
Output: Mensagem personalizada pronta para WhatsApp
        (~300 tokens, temperatura 0.8)
```

**2. Análise de Objeção**
```
Input:  lead (perfil completo) + texto da objeção do cliente
Output: JSON com:
  - diagnosis: análise da objeção
  - strategy: técnica de venda recomendada
  - response: mensagem pronta para responder
        (~1000 tokens, temperatura 0.7)
```

**3. Follow-up Pós-Venda**
```
Input:  lead + valor do negócio fechado
Output: Mensagem de acompanhamento para fidelização
        (~400 tokens, temperatura 0.8)
```

---

## 🗺️ Integração Apify (Google Maps Scraper)

O scraper usa o ator `compass/google-maps-scraper` da Apify para buscar negócios reais.

**Fluxo:**
1. POST `/acts/compass~google-maps-scraper/runs` com query + localização
2. Poll do status do run a cada 3s (máximo 30 tentativas)
3. Fetch dos resultados: `/actor-runs/{id}/dataset/items`
4. Transformação automática para o formato de lead

**Dados extraídos automaticamente:**
- Nome do negócio e categoria
- Telefone de contato
- Website e presença no Instagram
- Número de avaliações e nota no Google
- Endereço completo

**Custo estimado:** ~$5/mês no plano gratuito da Apify (~100 buscas)

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Conta na [Apify](https://apify.com/) (gratuita)
- Chave de API de um provedor de IA (DeepSeek recomendado — mais barato)

### 1. Clone o repositório

```bash
git clone https://github.com/lucassnts963/leadflow.git
cd leadflow
```

### 2. Instale as dependências

```bash
npm install
# ou
pnpm install
```

### 3. Execute o projeto

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

Acesse: [http://localhost:3000](http://localhost:3000)

> **Não há arquivo `.env` necessário.** Toda a configuração é feita diretamente na interface, na aba **Configurações**.

---

## ⚙️ Configuração pela Interface

Na aba **Configurações** dentro do app:

| Campo | Descrição |
|-------|-----------|
| **Provedor LLM** | URL base do provedor de IA (ex: `https://api.deepseek.com/v1`) |
| **Modelo** | Nome do modelo (ex: `deepseek-chat`, `gpt-4o-mini`) |
| **API Key IA** | Chave do provedor de IA escolhido |
| **Apify API Key** | Chave da conta Apify para scraping |
| **URL do Portfólio** | Seu site/portfólio (usado nas mensagens geradas pela IA) |
| **Senha de Acesso** | Senha para proteger o app (definida no primeiro acesso) |

---

## 📊 Estrutura de Dados do Lead

```typescript
{
  id: string,              // "apify-{placeId}" | "csv-{row}-{ts}" | "manual-{ts}"
  name: string,            // Nome do responsável
  business: string,        // Nome do negócio
  category: string,        // Categoria (Advocacia, Clínicas, etc.)
  phone: string,           // Telefone de contato
  instagram: string,       // Perfil no Instagram
  website: string,         // Site do negócio
  address: string,         // Endereço completo
  reviews: number,         // Quantidade de avaliações no Google
  rating: number,          // Nota média no Google (0–5)
  status: "novo" | "contatado",
  source: "apify" | "csv" | "manual",
  contactedAt: string | null,   // Timestamp ISO do primeiro contato
  dealValue: number,       // Valor do negócio (R$)
  dealResult: "won" | "lost" | null,
  dealNotes: string,       // Observações do deal
  notes: string,           // Notas gerais
  score: number,           // Pontuação 0–100
  scoreReasons: string[],  // Motivos da pontuação
  temperature: "hot" | "warm" | "cold",
  websiteQuality: "unknown" | "good" | "medium" | "bad" | null
}
```

---

## 🌐 Deploy

### Vercel (recomendado)

```bash
vercel deploy
```

Não são necessárias variáveis de ambiente — toda configuração é feita pelo usuário na interface.

### Outras plataformas

Qualquer plataforma com suporte a Node.js 18+ funciona (Railway, Render, Coolify, VPS etc.).

---

## 📝 Licença

MIT © [Lucas Santos](https://elucas.dev)
