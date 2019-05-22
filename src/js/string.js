export const capitalize = string => (typeof string !== 'string' ? ''
  : `${string.charAt(0).toUpperCase()}${string.slice(1)}`);

export const dasherize = string => (typeof string !== 'string' ? '' : string.replace(/_/g, '-'));

export const humanize = string => (typeof string !== 'string' ? '' : string
  .replace(/[a-z][A-Z]/, match => `${match[0]} ${match[1]}`)
  .replace(/_/g, ' ')
  .toLowerCase());

export const isBlank = string => (typeof string === 'string' && string.trim() === '')
  || string === null
  || string === undefined;

export const isPresent = string => !isBlank(string);

export const parameterize = string => (typeof string !== 'string' ? '' : string
  .replace(/[a-z][A-Z]/, match => `${match[0]}_${match[1]}`)
  .replace(/[^a-zA-Z0-9\-_]+/, '-') // Turn unwanted chars into the separator
  .replace(/-{2,}/, '-') // No more than one of the separator in a row
  .replace(/^-|-$/, '') // Remove leading/trailing separator.
  .toLowerCase());

export const phoneFormat = (string) => {
  if (/^1?\d{10}$/.test(string)) {
    return string.replace(/1?(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  if (/^\d{7}$/.test(string)) {
    return string.replace(/(\d{3})(\d{4})/, '$1-$2');
  }

  return string;
};

// This is far too simple for most cases, but it works for the few things we need
export const pluralize = (string) => {
  if (string[string.length - 1] === 'y') {
    return `${string.substr(0, string.length - 1)}ies`;
  }

  return `${string}s`;
};

export const presence = string => (isBlank(string) ? undefined : string);

export const strip = string => (typeof string !== 'string' ? '' : string.replace(/^\s+|\s+$/g, ''));

export const titleize = string => (typeof string !== 'string' ? '' : string
  .replace(/_/g, ' ')
  .replace(/\b[a-z]/g, char => char.toUpperCase()));

export const underscore = string => (typeof string !== 'string' ? '' : string
  .replace(/[a-z][A-Z]/, match => `${match[0]}_${match[1]}`)
  .replace('::', '/')
  .toLowerCase());