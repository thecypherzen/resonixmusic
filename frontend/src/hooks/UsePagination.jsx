import { useState, useEffect } from "react";

export const UsePagination = (items, itemsPerPage) => {
  //states
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Calculate the items to be displayed on the current page
  const pageItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  // Handler for navigating pages
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  // Handler for previous page
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [items, itemsPerPage, totalPages]);

  useEffect(() => {
    console.log("current Page:", currentPage);
  }, [currentPage]);

  return {
    currentPage,
    setCurrentPage,
    pageItems,
    totalPages,
    nextPage,
    prevPage,
  };
};
