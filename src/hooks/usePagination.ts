import { useMemo, useState } from 'react';

export function usePagination(initialLimit = 10): {
  page: number;
  limit: number;
  setPage: (p: number) => void;
  queryString: string;
} {
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);

  const queryString = useMemo(
    () => `?page=${page}&limit=${limit}`,
    [page, limit],
  );

  return { page, limit, setPage, queryString };
}
