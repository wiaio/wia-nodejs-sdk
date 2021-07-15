function flattenObj(obj, parent, res = {}) {
  // eslint-disable-next-line guard-for-in
  for (const key in obj) {
    const propName = parent ? `${parent}.${key}` : key;
    if (typeof obj[key] === 'object') {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

module.exports = {
  flattenObj,
};
