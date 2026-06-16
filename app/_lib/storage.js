const STORAGE_KEY = 'leadflow_data';

const DEFAULT_DATA = {
  leads: [],
  settings: {
    llmProvider: 'https://api.deepseek.com/v1',
    llmApiKey: '',
    llmModel: 'deepseek-chat',
    apifyApiKey: '',
    authPassword: '',
    portfolioUrl: 'https://elucas.dev',
  },
};

export function loadData() {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    return {
      leads: parsed.leads || [],
      settings: { ...DEFAULT_DATA.settings, ...parsed.settings },
    };
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

export function saveData(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

export function updateLeads(leads) {
  const data = loadData();
  data.leads = leads;
  saveData(data);
}

export function updateLead(id, updates) {
  const data = loadData();
  data.leads = data.leads.map((l) => (l.id === id ? { ...l, ...updates } : l));
  saveData(data);
  return data.leads;
}

export function addLeads(newLeads) {
  const data = loadData();
  const existingIds = new Set(data.leads.map((l) => l.id));
  const unique = newLeads.filter((l) => !existingIds.has(l.id));
  data.leads = [...unique, ...data.leads];
  saveData(data);
  return data.leads;
}

export function deleteLead(id) {
  const data = loadData();
  data.leads = data.leads.filter((l) => l.id !== id);
  saveData(data);
  return data.leads;
}

export function updateSettings(updates) {
  const data = loadData();
  data.settings = { ...data.settings, ...updates };
  saveData(data);
  return data.settings;
}

export function getSettings() {
  return loadData().settings;
}
