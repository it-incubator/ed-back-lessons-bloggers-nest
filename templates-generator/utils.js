function toPascalCase(str) {
  return str
    .replace(/(^|[-_])([a-z])/g, (_, __, letter) => letter.toUpperCase())
    .replace(/[-_]/g, '');
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function singularize(word) {
  if (word.endsWith('ies')) {
    return word.replace(/ies$/, 'y');
  }
  if (word.endsWith('s')) {
    return word.replace(/s$/, '');
  }
  return word;
}

module.exports = {
  singularize,
  toCamelCase,
  kebabCase,
  toPascalCase,
};
