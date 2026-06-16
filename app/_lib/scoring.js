// Lead scoring - quanto mais sinais positivos, mais quente o lead

const WEIGHTS = {
  hasWebsite: 15,
  noWebsite: 25,       // sem site = maior necessidade
  hasInstagram: 10,
  hasPhone: 5,
  hasReviews: 20,      // reviews indicam estabelecimento estabelecido
  categoryDemand: {    // categorias com maior demanda por site
    'Advocacia': 10,
    'Clínicas': 10,
    'Dentistas': 10,
    'Imobiliárias': 8,
    'Academias': 8,
    'Barbearias': 5,
    'Pizzarias': 5,
    'Lanchonetes': 5,
    'Restaurantes': 5,
    'Construção': 8,
    'Beleza': 5,
    'Outros': 3,
  }
};

export function scoreLead(lead) {
  let score = 0;
  const reasons = [];

  // Website analysis
  if (lead.website) {
    if (lead.website.includes('instagram.com') || lead.website.includes('facebook.com')) {
      // Só tem rede social como "site" = péssimo, precisa de site próprio
      score += 20;
      reasons.push('Apenas rede social como "site"');
    } else {
      score += WEIGHTS.hasWebsite;
      reasons.push('Possui site próprio');
    }
  } else {
    score += WEIGHTS.noWebsite;
    reasons.push('Sem presença web');
  }

  // Instagram
  if (lead.instagram) {
    score += WEIGHTS.hasInstagram;
    reasons.push('Tem Instagram');
  } else {
    score += 5; // sem Instagram = menos canais = mais necessidade
    reasons.push('Sem Instagram');
  }

  // Phone
  if (lead.phone) {
    score += WEIGHTS.hasPhone;
    reasons.push('Telefone disponível');
  }

  // Reviews
  if (lead.reviews !== undefined && lead.reviews !== null) {
    if (lead.reviews > 10) {
      score += 20;
      reasons.push(`${lead.reviews}+ avaliações`);
    } else if (lead.reviews > 0) {
      score += 10;
      reasons.push('Poucas avaliações');
    }
  }

  // Category demand
  score += WEIGHTS.categoryDemand[lead.category] || 3;
  reasons.push(`Categoria: ${lead.category}`);

  // Bad website = higher need
  if (lead.websiteQuality === 'bad') {
    score += 15;
    reasons.push('Site atual de baixa qualidade');
  } else if (lead.websiteQuality === 'medium') {
    score += 8;
    reasons.push('Site atual mediano');
  }

  // Contact status
  if (lead.status === 'contatado') {
    score += 5;
    reasons.push('Já contatado');
  }

  return {
    score: Math.min(100, score),
    reasons,
    temperature: score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'cold',
  };
}

export function rescoreAllLeads(leads) {
  return leads.map(lead => {
    const { score, reasons, temperature } = scoreLead(lead);
    return { ...lead, score, scoreReasons: reasons, temperature };
  });
}
