const capitalize = (text) => {
  if (typeof text !== "string" || !text) {
    return text;
  }
  return `${text[0].toUpperCase()}${text.slice(1)}`;
};

const funcs = {
  capitalize: capitalize,
};

export default funcs;
