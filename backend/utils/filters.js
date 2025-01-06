const filterBy = {
  streamable(data, check = true) {
    const filteredData = data.sort((item) => {
      return (JSON.parse(item.is_streamable) === check);
    });
    return filteredData;
  },
};

const sortBy = {
  releaseDate(data, desc = true) {
    data.sort((a, b) => {
      const dateA = Date.parse(a.release_date);
      const dateB = Date.parse(b.release_date);
      return desc ? dateB - dateA : dateA - dateB;
    });
  },
};

export { filterBy, sortBy };
