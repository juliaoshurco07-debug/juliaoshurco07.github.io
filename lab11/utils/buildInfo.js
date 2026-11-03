// Logică pură, fără React: se poate testa cu Node sau în aplicație.

export function runtimeLabel(executionEnvironment) {
  switch (executionEnvironment) {
    case 'storeClient':
      return 'Expo Go sau development build';
    case 'standalone':
      return 'Build de release (standalone)';
    case 'bare':
      return 'Proiect nativ (bare)';
    default:
      return `Necunoscut: ${executionEnvironment ?? '—'}`;
  }
}

export function formatVersion(version, buildCode) {
  const v = version ? String(version) : '?';
  const hasCode = buildCode !== null && buildCode !== undefined && String(buildCode) !== '';
  return hasCode ? `${v} (${buildCode})` : v;
}

export function envLabel(raw) {
  const v = (raw ?? '').trim().toLowerCase();
  if (v === '') return 'nesetat';
  if (v === 'local' || v === 'preview' || v === 'production') return v;
  return `necunoscut (${raw})`;
}

export function hostOf(url) {
  const m = /^https?:\/\/([^/:?#]+)/i.exec((url ?? '').trim());
  return m ? m[1].toLowerCase() : null;
}