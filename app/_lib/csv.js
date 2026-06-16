// CSV import - client-side parsing

export function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(/[;,]/).map((h) => h.trim().toLowerCase());

  const map = {
    nome: 'name',
    name: 'name',
    negócio: 'business',
    negocio: 'business',
    business: 'business',
    empresa: 'business',
    company: 'business',
    categoria: 'category',
    category: 'category',
    telefone: 'phone',
    phone: 'phone',
    telefone: 'phone',
    instagram: 'instagram',
    '@': 'instagram',
    site: 'website',
    website: 'website',
    'site atual': 'website',
    endereço: 'address',
    endereco: 'address',
    address: 'address',
    avaliações: 'reviews',
    avaliacoes: 'reviews',
    reviews: 'reviews',
    nota: 'rating',
    rating: 'rating',
    observações: 'notes',
    observacoes: 'notes',
    notes: 'notes',
  };

  const leads = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(/[;,]/).map((v) => v.trim().replace(/^"|"$/g, ''));
    const lead = {};

    headers.forEach((header, idx) => {
      const key = map[header] || header;
      lead[key] = values[idx] || '';
    });

    if (!lead.business && !lead.name) continue; // skip empty rows

    const business = lead.business || lead.name || '';
    leads.push({
      id: `csv-${i}-${Date.now()}`,
      name: lead.name || business,
      business: business,
      category: lead.category || 'Outros',
      phone: lead.phone || '',
      instagram: lead.instagram || '',
      website: lead.website || '',
      address: lead.address || '',
      reviews: parseInt(lead.reviews) || 0,
      rating: parseFloat(lead.rating) || 0,
      notes: lead.notes || '',
      status: 'novo',
      source: 'csv',
      contactedAt: null,
      dealValue: 0,
      dealResult: null,
      dealNotes: '',
      websiteQuality: lead.website ? 'unknown' : null,
      score: 0,
      scoreReasons: [],
      temperature: 'cold',
    });
  }

  return leads;
}

export function exportCSV(leads) {
  const headers = [
    'Nome', 'Negócio', 'Categoria', 'Telefone', 'Instagram', 'Site',
    'Avaliações', 'Status', 'Score', 'Valor Fechado', 'Resultado',
    'Contatado em', 'Observações',
  ];

  const rows = leads.map((l) => [
    escapeCSV(l.name),
    escapeCSV(l.business),
    escapeCSV(l.category),
    escapeCSV(l.phone),
    escapeCSV(l.instagram),
    escapeCSV(l.website),
    l.reviews || 0,
    l.status,
    l.score,
    l.dealResult === 'won' ? l.dealValue : '',
    l.dealResult === 'won' ? 'Ganho' : l.dealResult === 'lost' ? 'Perdido' : '',
    l.contactedAt || '',
    escapeCSV(l.notes),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function exportJSON(leads) {
  return JSON.stringify(leads, null, 2);
}

function escapeCSV(str) {
  if (!str) return '';
  const s = String(str);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
