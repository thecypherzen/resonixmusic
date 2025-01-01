// Extracts a page from an array of results

export default function getPageFrom({
  page, pageSize, array,
}) {
  const tracksLength = array.length;
  const pSize = parseInt(pageSize, 10);
  const maxPages = Math.ceil(tracksLength / pSize);
  let p = parseInt(page, 10);
  if (p > maxPages) {
    p = maxPages;
  }
  const iStart = (p - 1) * pSize;
  const iEnd = (p * pSize);
  return {
    page: p,
    max: maxPages,
    data: array.slice(iStart, iEnd),
  };
}
