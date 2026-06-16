// Apify Google Maps Scraper integration
// Uses user's own API key - all client-side, no backend needed

const APIFY_ACTOR = 'compass/google-maps-scraper';

export async function scrapeGoogleMaps(apiKey, searchQuery, location, maxResults = 20) {
  if (!apiKey) {
    throw new Error('Chave Apify não configurada. Vá em Configurações.');
  }

  // Start the actor run
  const input = {
    searchStrings: [searchQuery],
    locationQuery: location || 'Barcarena, PA, Brasil',
    maxCrawledPlaces: maxResults,
    language: 'pt',
    deeperCityScrape: false,
    includeWebResults: true,
    includeOpeningHours: true,
    includeImages: false,
    includeReviewsCount: true,
  };

  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/${APIFY_ACTOR}/runs`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(input),
    }
  );

  if (!runResponse.ok) {
    const err = await runResponse.text();
    throw new Error(`Erro Apify (${runResponse.status}): ${err.slice(0, 200)}`);
  }

  const runData = await runResponse.json();
  const runId = runData.data.id;

  // Poll until complete
  const results = await pollUntilComplete(apiKey, runId);
  return transformToLeads(results, searchQuery);
}

async function pollUntilComplete(apiKey, runId, maxAttempts = 30, delayMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(delayMs);

    const response = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (!response.ok) continue;
    const data = await response.json();

    if (data.data.status === 'SUCCEEDED') {
      const datasetResponse = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}/dataset/items`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      if (!datasetResponse.ok) {
        throw new Error('Falha ao carregar resultados do dataset');
      }

      return await datasetResponse.json();
    }

    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(data.data.status)) {
      throw new Error(`Scraping ${data.data.status.toLowerCase()}: ${data.data.statusMessage || ''}`);
    }
  }

  throw new Error('Timeout: scraping demorou muito. Tente com menos resultados.');
}

function transformToLeads(items, category) {
  return items.map((item) => {
    const website = item.website || item.companyUrl || '';
    const hasSite = !!website;

    return {
      id: `apify-${item.placeId || Math.random().toString(36).slice(2, 10)}`,
      name: item.title || item.name || '',
      business: item.title || item.name || '',
      category: detectCategory(item, category),
      phone: item.phone || item.telephone || '',
      instagram: extractInstagram(item),
      website: website,
      address: item.address || item.street || '',
      reviews: item.totalScore || item.reviewsCount || 0,
      rating: item.rating || item.totalScore || 0,
      status: 'novo',
      source: 'apify',
      contactedAt: null,
      dealValue: 0,
      dealResult: null,
      dealNotes: '',
      notes: '',
      score: 0,
      scoreReasons: [],
      temperature: 'cold',
      websiteQuality: hasSite ? 'unknown' : null,
    };
  });
}

function detectCategory(item, fallback) {
  const cats = item.categoryName || item.categories?.join(' ') || item.types?.join(' ') || '';
  const text = (item.title + ' ' + cats).toLowerCase();

  const map = {
    'advocacia': ['advogado', 'advocacia', 'jurídico', 'escritório advocacia'],
    'Dentistas': ['dentista', 'odontologia', 'clínica odontológica', 'sorriso'],
    'Academias': ['academia', 'fitness', 'crossfit', 'musculação'],
    'Barbearias': ['barbearia', 'barber', 'cabeleireiro', 'barba'],
    'Pizzarias': ['pizzaria', 'pizza'],
    'Lanchonetes': ['lanchonete', 'hamburguer', 'burger', 'açaí', 'sanduíche'],
    'Clínicas': ['clínica', 'hospital', 'saúde', 'fisioterapia', 'psicologia'],
    'Imobiliárias': ['imobiliária', 'imóveis', 'corretor'],
    'Beleza': ['salão', 'beleza', 'estética', 'manicure', 'sobrancelha'],
    'Construção': ['construção', 'engenharia', 'obra', 'reforma'],
    'Restaurantes': ['restaurante', 'restaurante'],
  };

  for (const [cat, keywords] of Object.entries(map)) {
    if (keywords.some((k) => text.includes(k))) return cat;
  }

  return fallback || 'Outros';
}

function extractInstagram(item) {
  const socials = item.socialLinks || item.additionalInfo?.socials || {};
  return socials.instagram || socials.ig || '';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
