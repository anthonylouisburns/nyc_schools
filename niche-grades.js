(async () => {
  const cards = [...document.querySelectorAll('article.school')];
  if (!cards.length) return;
  try {
    const response = await fetch('data/niche-grades.json');
    if (!response.ok) throw new Error('Niche grade data unavailable');
    const data = await response.json();
    const style = document.createElement('style');
    style.textContent = '.niche-note{font-size:11px;color:#596e63;margin:4px 0}.school .grade{margin-top:5px}';
    document.head.append(style);
    for (const card of cards) {
      const record = data.schools[card.id];
      if (!record || card.querySelector('a.grade')) continue;
      const link = document.createElement('a');
      link.className = 'grade'; link.href = record.url;
      link.textContent = `Niche ${record.grade} ↗`;
      link.title = `Overall school grade; grades ${record.scope}; checked ${record.checked_on}`;
      card.querySelector('.address').after(link);
      if (record.note || !['9-12', '9–12'].includes(record.scope)) {
        const note = document.createElement('p'); note.className = 'niche-note';
        note.textContent = record.note || `Overall school grade covers grades ${record.scope}, not only high school.`;
        link.after(note);
      }
    }
    const note = document.createElement('p'); note.className = 'note';
    note.textContent = 'Niche overall grades checked October 26, 2026. Click a grade for its source. School grades and personalized admissions bars are separate measures; Niche subpages may retain older editions.';
    document.querySelector('.legend')?.after(note);
    document.documentElement.dataset.nicheGradesReady = 'true';
  } catch (error) {
    const note = document.createElement('p'); note.className = 'note';
    note.textContent = 'Niche grades could not load. Refresh to try again.';
    document.querySelector('.legend')?.after(note);
  }
})();
