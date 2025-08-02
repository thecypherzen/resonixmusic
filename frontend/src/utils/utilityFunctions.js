const capitalize = (text) => {
  console.log("\n\n****capitalize called with****:", text);
  return `${text[0].toUpperCase()}${text.slice(1)}`;
};

const funcs = {
  capitalize: capitalize,
};

export default funcs;
