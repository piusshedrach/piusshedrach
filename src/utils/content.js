export function normalizePath(value = '/') {
  const [pathname] = String(value).split(/[?#]/);
  const normalized = `/${pathname}`.replace(/\/+/g, '/');

  return normalized === '/' ? normalized : normalized.replace(/\/+$/, '');
}

export function slugify(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
