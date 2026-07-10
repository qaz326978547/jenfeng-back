// Approximates Laravel's `->paginate()` JSON response shape so existing
// frontend code that reads `current_page` / `data` / `total` etc. keeps working.
export interface LaravelPaginatedResult<T> {
  current_page: number;
  data: T[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  perPage: number,
  path: string,
): LaravelPaginatedResult<T> {
  const lastPage = Math.max(Math.ceil(total / perPage), 1);
  const from = total === 0 ? null : (page - 1) * perPage + 1;
  const to = total === 0 ? null : Math.min(page * perPage, total);
  const pageUrl = (p: number) => `${path}?page=${p}`;

  return {
    current_page: page,
    data,
    first_page_url: pageUrl(1),
    from,
    last_page: lastPage,
    last_page_url: pageUrl(lastPage),
    next_page_url: page < lastPage ? pageUrl(page + 1) : null,
    path,
    per_page: perPage,
    prev_page_url: page > 1 ? pageUrl(page - 1) : null,
    to,
    total,
  };
}

export function parsePage(value: unknown): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
