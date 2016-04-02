'use strict';

export function sortObj(obj) {
  return Object.keys(obj).sort().reduce((r, k) => (
    r[k] = obj[k], r
  ), {});
}

export function buildUrl(url, path) {
  return `${url}${path}`;
}

