export function buildUrl(url, path) {
  return `${url}${path}`;
}

export function values(obj) {
  return Object.keys(obj).map(k => obj[k]);
}
