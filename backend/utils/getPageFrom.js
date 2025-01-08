// Extracts a page from an array of results
import {
  MIN_PAGE_SIZE as PAGE_SIZE
} from '../defaults/index.js';

export default function getPageFrom({
  page, pageSize, array,
}) {
  const tracksLength = array.length;
  const pSize = parseInt(pageSize, PAGE_SIZE);
  const maxPages = Math.ceil(tracksLength / pSize);
  let p = parseInt(page, PAGE_SIZE);
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
