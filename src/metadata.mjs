import { parseDocument } from 'yaml';

export const sourceText = value => Array.isArray(value) ? value.map(sourceText).join('')
  : typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '');

// Maps are converted explicitly so prototype names remain inert own properties.
export function parseYaml(text) {
  const doc = parseDocument(text, { schema: 'core', merge: false, uniqueKeys: true });
  if (doc.errors.length || doc.warnings.length) {
    throw new Error([...doc.errors, ...doc.warnings].map(e => e.message).join('\n'));
  }
  const normalize = (value, depth = 0) => {
    if (depth > 100) throw new Error('YAML nesting exceeds 100 levels');
    if (value instanceof Map) {
      const result = Object.create(null);
      for (const [key, item] of value) {
        if (typeof key !== 'string') throw new Error('Metadata keys must be strings');
        result[key] = normalize(item, depth + 1);
      }
      return result;
    }
    if (Array.isArray(value)) return value.map(item => normalize(item, depth + 1));
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('Metadata numbers must be finite');
    return value;
  };
  return normalize(doc.toJS({ mapAsMap: true, maxAliasCount: 0 }));
}

export function readMetadata(cell) {
  const empty = { meta: Object.create(null), consumed: false, remainder: '' };
  if (!cell || !['markdown', 'raw'].includes(cell.cell_type ?? 'markdown')) return empty;
  const text = sourceText(cell.source).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const lines = text.split('\n');
  if (lines[0]?.trim() === '---') {
    const end = lines.findIndex((line, i) => i > 0 && /^(---|\.\.\.)\s*$/.test(line));
    try {
      if (end < 0) throw new Error('Missing closing --- delimiter');
      const meta = parseYaml(lines.slice(1, end).join('\n')) ?? Object.create(null);
      if (typeof meta !== 'object' || Array.isArray(meta)) throw new Error('Frontmatter must be a mapping');
      return { meta, consumed: true, remainder: lines.slice(end + 1).join('\n') };
    } catch (error) {
      throw new Error(`Invalid notebook YAML frontmatter (cell 1): ${error.message}`);
    }
  }
  // A heading alone is content. Legacy metadata needs at least one list field,
  // and every nonblank line must belong to the heading/summary/field grammar.
  const nonblank = lines.filter(line => line.trim());
  if (!nonblank.some(line => /^-\s+[^:]+:\s*/.test(line)) ||
      !nonblank.every(line => /^(#{1,6}\s+|>\s?|[-]\s+[^:]+:\s*)/.test(line))) return empty;
  const meta = Object.create(null);
  for (const line of nonblank) {
    if (line.startsWith('#')) meta.title = line.replace(/^#+\s+/, '');
    else if (line.startsWith('>')) meta.summary = [meta.summary, line.replace(/^>\s?/, '')].filter(Boolean).join('\n');
    else {
      const [, key, value] = line.match(/^-\s+([^:]+):\s*(.*)$/);
      try { meta[key.trim()] = parseYaml(value); }
      catch { meta[key.trim()] = value; } // Legacy prose was never explicit YAML.
    }
  }
  return { meta, consumed: true, remainder: '' };
}

export function get_metadata(cell) { return readMetadata(cell).meta; }
