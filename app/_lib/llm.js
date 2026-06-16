// Multi-LLM client - supports any OpenAI-compatible API
// User provides: provider URL, API key, model name

export async function callLLM(settings, messages, { temperature = 0.7, maxTokens = 800 } = {}) {
  const { llmProvider, llmApiKey, llmModel } = settings;
  
  if (!llmApiKey) {
    throw new Error('Chave API não configurada. Vá em Configurações.');
  }

  const baseUrl = llmProvider.replace(/\/+$/, '');
  const url = baseUrl.includes('/chat/completions') ? baseUrl : `${baseUrl}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${llmApiKey}`,
    },
    body: JSON.stringify({
      model: llmModel,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Erro LLM (${response.status}): ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// Generate personalized WhatsApp message for a lead
export async function generateLeadMessage(settings, lead) {
  const system = `Você é um vendedor experiente de sites institucionais. Seu tom é profissional mas amigável, direto, sem enrolação. 
Você está abordando um negócio local em Barcarena/PA.

Regras:
- Use português brasileiro natural, nada de "Prezado" ou formal demais
- Máximo 4 linhas
- Inclua o link do portfólio naturalmente
- Se o lead já tem site, foque em melhorar (mais moderno, responsivo, SEO)
- Se não tem site, foque na importância de presença digital
- Termine com uma pergunta aberta`;

  const user = `Negócio: ${lead.business}${lead.name ? ` (${lead.name})` : ''}
Categoria: ${lead.category}
${lead.website ? `Site atual: ${lead.website}` : 'Não tem site'}
${lead.instagram ? `Instagram: ${lead.instagram}` : 'Não tem Instagram'}
Portfólio: ${settings.portfolioUrl || 'https://elucas.dev'}`;

  return callLLM(settings, [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ], { temperature: 0.8, maxTokens: 300 });
}

// Handle objection - analyze and suggest strategy
export async function handleObjection(settings, lead, objectionText) {
  const system = `Você é um especialista em vendas B2B e negociação. 
Analise a objeção/hesitação do potencial cliente e forneça uma estratégia para quebrar essa objeção.

Responda neste formato JSON:
{
  "diagnostico": "1-2 frases analisando a objeção real por trás da mensagem",
  "estrategia": "Estratégia de resposta em 3-4 pontos",
  "resposta_pronta": "Uma resposta pronta que o vendedor pode enviar (em português brasileiro, tom profissional amigável)",
  "tecnica": "Nome da técnica de vendas aplicável (ex: Sandler, SPIN, Challenger, etc.)"
}`;

  const user = `Cliente potencial: ${lead.business} (${lead.category})
${lead.website ? `Site atual: ${lead.website}` : 'Sem site'}
Mensagem do lead:
"${objectionText}"`;

  const response = await callLLM(settings, [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ], { temperature: 0.7, maxTokens: 1000 });

  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback: return raw text
    return {
      diagnostico: 'Análise abaixo',
      estrategia: response,
      resposta_pronta: '',
      tecnica: 'Personalizada',
    };
  }
}

// Generate post-sale follow-up
export async function generateFollowUp(settings, lead, dealValue) {
  const system = `Você é um especialista em pós-venda e retenção de clientes.
Gere uma mensagem de acompanhamento pós-venda para manter o cliente aquecido para futuros produtos (manutenção de site, SEO, landing pages, etc.).

Regras:
- Tom amigável, de parceiro, não de vendedor
- Parabenize pelo novo site
- Ofereça suporte sem ser invasivo
- Deixe porta aberta para futuros projetos
- Máximo 5 linhas`;

  const user = `Cliente: ${lead.business} (${lead.category})
Valor do projeto: R$ ${dealValue}
Data do fechamento: hoje`;

  return callLLM(settings, [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ], { temperature: 0.8, maxTokens: 400 });
}
