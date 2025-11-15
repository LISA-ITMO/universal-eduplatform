import { useState } from 'react';

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export const usePagination = (initialPageSize = 10) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: initialPageSize,
    total: 0,
  });

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  const setTotal = (total: number) => {
    setPagination((prev) => ({ ...prev, total }));
  };

  return {
    ...pagination,
    setPage,
    setPageSize,
    setTotal,
  };
};




