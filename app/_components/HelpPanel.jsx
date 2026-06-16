'use client';

export default function HelpPanel() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#2EB873]/10 to-[#265FCC]/10 border border-[#374151] rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">📖 Bem-vindo ao LeadFlow</h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
          Um gerenciador de leads gratuito feito pra quem vende sites e quer organizar a prospecção.
          Tudo salvo no seu navegador — zero custo, zero nuvem.
        </p>
      </div>

      {/* Sections */}
      <Section icon="🎯" title="O que é o LeadFlow?">
        <p>
          O LeadFlow é um <strong>mini CRM</strong> (Customer Relationship Management) focado em venda de sites.
          Ele te ajuda em 4 etapas:
        </p>
        <ul>
          <li><strong>1. Prospecção</strong> — Encontre negócios locais no Google Maps (via Apify) ou importe sua própria lista CSV</li>
          <li><strong>2. Qualificação</strong> — Scoring automático classifica leads de 🔥 quente a 🔵 frio com base em presença digital</li>
          <li><strong>3. Abordagem</strong> — WhatsApp direto, mensagens geradas por IA, quebra de objeções em tempo real</li>
          <li><strong>4. Fechamento</strong> — Registre valor, resultado (ganho/perdido) e acompanhe no dashboard</li>
        </ul>
      </Section>

      <Section icon="🕷️" title="O que é Apify e como usar?">
        <p>
          <strong>Apify</strong> é uma plataforma de automação web. O LeadFlow usa o ator{' '}
          <em>Google Maps Scraper</em> da Apify para buscar negócios locais automaticamente.
        </p>
        <h4>Como configurar:</h4>
        <ol>
          <li>Crie uma conta gratuita em{' '}
            <a href="https://console.apify.com" target="_blank" rel="noopener noreferrer" className="text-[#265FCC] hover:underline">
              console.apify.com
            </a>
          </li>
          <li>Vá em <strong>Settings → API &amp; Integrations</strong></li>
          <li>Copie seu <strong>Personal API token</strong></li>
          <li>Cole na aba <strong>⚙️ Config</strong> do LeadFlow</li>
        </ol>
        <div className="bg-[#E69138]/10 border border-[#E69138]/20 rounded-lg p-3 text-xs">
          💡 <strong>Plano gratuito:</strong> $5/mês de crédito — dá pra buscar ~100 leads por mês sem pagar nada.
          O scraper extrai: nome, telefone, site, Instagram, avaliações, endereço e categoria.
        </div>
      </Section>

      <Section icon="📊" title="Como funciona o Scoring?">
        <p>O score (0-100) é calculado automaticamente com base em:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <ScoreItem label="Sem site próprio" points="+25 pts" desc="Maior necessidade → mais quente" />
          <ScoreItem label="Só rede social como site" points="+20 pts" desc="Precisa de site profissional urgente" />
          <ScoreItem label="10+ avaliações no Google" points="+20 pts" desc="Negócio estabelecido, tem caixa" />
          <ScoreItem label="Site atual ruim" points="+15 pts" desc="Cliente insatisfeito com o atual" />
          <ScoreItem label="Categoria valorizada" points="+5 a +10 pts" desc="Advocacia, clínicas e dentistas pontuam mais" />
          <ScoreItem label="Tem Instagram" points="+10 pts" desc="Já tem presença digital" />
        </div>
        <div className="flex gap-3 mt-3 text-xs">
          <span className="text-[#E63E5F]">🔥 Quente (70+)</span>
          <span className="text-[#E69138]">🟡 Morno (40-69)</span>
          <span className="text-[#265FCC]">🔵 Frio (&lt;40)</span>
        </div>
      </Section>

      <Section icon="🤖" title="Mensagens com IA">
        <p>
          O botão <strong>🤖 Msg IA</strong> gera uma mensagem personalizada de WhatsApp usando IA.
          A IA analisa o negócio, categoria, se tem site ou não, e cria uma abordagem natural.
        </p>
        <h4>Modelos suportados:</h4>
        <p>
          Qualquer API compatível com OpenAI — <strong>DeepSeek</strong> (grátis/crédito inicial),{' '}
          <strong>OpenAI</strong> (GPT-4o), <strong>Groq</strong> (grátis),{' '}
          <strong>Together</strong>, <strong>OpenRouter</strong> (Claude).
        </p>
        <div className="bg-[#265FCC]/10 border border-[#265FCC]/20 rounded-lg p-3 text-xs">
          💡 <strong>Recomendação:</strong> DeepSeek — R$ 1,50 por 1M tokens (dá pra gerar mensagens o mês todo com centavos).
          Ou Groq — plano gratuito generoso.
        </div>
      </Section>

      <Section icon="🧠" title="Quebra de Objeções">
        <p>
          Quando um lead responder com objeções ("tá caro", "vou pensar", "já tenho site"),
          cole a mensagem dele no <strong>🧠 Quebrar Objeção</strong>.
        </p>
        <p>A IA retorna:</p>
        <ul>
          <li><strong>🔍 Diagnóstico</strong> — O que está por trás da objeção</li>
          <li><strong>🎯 Estratégia</strong> — Como responder (3-4 pontos)</li>
          <li><strong>✉️ Resposta pronta</strong> — Texto que você pode copiar e enviar</li>
          <li><strong>📚 Técnica</strong> — Nome da técnica de vendas (SPIN, Sandler, Challenger)</li>
        </ul>
      </Section>

      <Section icon="📄" title="Importar CSV">
        <p>
          Se você já tem uma lista de leads em Excel/Google Sheets, exporte como CSV e importe aqui.
        </p>
        <h4>Colunas aceitas:</h4>
        <p>
          <strong>Negócio</strong> (obrigatório), Nome, Categoria, Telefone, Instagram, Site,
          Avaliações, Endereço, Observações.
        </p>
        <p>
          O separador pode ser vírgula (,) ou ponto e vírgula (;). A primeira linha define os nomes das colunas.
          Clique no <strong>?</strong> ao lado do botão 📄 CSV pra ver o formato exato e baixar um template.
        </p>
      </Section>

      <Section icon="💰" title="Fechamento e Dashboard">
        <p>
          Quando fechar um negócio, clique em <strong>💰 Fechar</strong> no lead.
          Registre o valor em R$ e o resultado (ganho ou perdido).
        </p>
        <p>O <strong>Dashboard</strong> mostra:</p>
        <ul>
          <li>Pipeline: quantos leads em cada etapa</li>
          <li>Receita total vs meta de R$ 5.000</li>
          <li>Fechamentos recentes</li>
          <li>⚠️ Alertas de leads sem contato há 3+ dias</li>
          <li>🎯 Pós-venda: gere mensagens de acompanhamento pra clientes que fecharam</li>
        </ul>
      </Section>

      <Section icon="🔒" title="Privacidade e Segurança">
        <ul>
          <li><strong>100% local:</strong> Todos os dados ficam no localStorage do seu navegador</li>
          <li><strong>Senha:</strong> O acesso ao app é protegido por senha (definida por você no primeiro acesso)</li>
          <li><strong>Sem servidor:</strong> Nada é enviado pra nuvem — nem leads, nem chaves de API</li>
          <li><strong>Export:</strong> Faça backup dos seus dados a qualquer momento em CSV ou JSON</li>
          <li><strong>Chave Apify:</strong> Fica salva apenas no seu navegador, usada diretamente na API da Apify</li>
        </ul>
      </Section>

      <Section icon="🔄" title="Dica: fluxo ideal de trabalho">
        <div className="bg-[#1F2937] border border-[#374151] rounded-lg p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#E69138] font-bold">1.</span>
            <span>Use o <strong>Apify</strong> pra buscar 10-20 leads de uma categoria</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E69138] font-bold">2.</span>
            <span>Ordene por <strong>score</strong> — ataque os 🔥 quentes primeiro</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E69138] font-bold">3.</span>
            <span>Clique em <strong>🤖 Msg IA</strong> pra gerar abordagem personalizada</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E69138] font-bold">4.</span>
            <span>Marque como <strong>✓ Contatado</strong> após enviar a mensagem</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E69138] font-bold">5.</span>
            <span>Se o lead responder com objeção, use <strong>🧠 Quebrar Objeção</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E69138] font-bold">6.</span>
            <span>Fechou? <strong>💰 Fechar</strong> → registre o valor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E69138] font-bold">7.</span>
            <span>Acompanhe no <strong>📊 Dashboard</strong> e faça follow-up dos clientes</span>
          </div>
        </div>
      </Section>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-[#1F2937] to-[#111827] border border-[#374151] rounded-xl p-6 text-center">
        <p className="text-sm text-gray-400 mb-3">
          LeadFlow é uma ferramenta gratuita. Se precisar de um site profissional pro seu próprio negócio:
        </p>
        <a
          href="https://elucas.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2EB873] hover:bg-[#25a060] text-white rounded-lg text-sm font-semibold transition-colors"
        >
          elucas.dev
          <span>→</span>
        </a>
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-5 sm:p-6">
      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      <div className="text-sm text-gray-400 leading-relaxed space-y-2 [&_p]:text-gray-400 [&_strong]:text-gray-200 [&_h4]:text-xs [&_h4]:text-gray-300 [&_h4]:uppercase [&_h4]:tracking-wider [&_h4]:mt-3 [&_h4]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-0.5 [&_li]:text-gray-400 [&_li]:text-sm [&_a]:text-[#265FCC] [&_a]:hover:underline">
        {children}
      </div>
    </div>
  );
}

function ScoreItem({ label, points, desc }) {
  return (
    <div className="bg-[#111827] rounded-lg p-2.5">
      <div className="flex justify-between items-start">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-[#2EB873] font-bold text-[10px]">{points}</span>
      </div>
      <p className="text-gray-600 text-[10px] mt-0.5">{desc}</p>
    </div>
  );
}
