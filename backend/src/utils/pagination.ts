export interface IPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface IPaginatedResult<T> {
    items: T[];
    pagination: IPagination;
}

export interface PaginationQuery {
    page?: unknown;
    limit?: unknown;
}

export const parsePaginationQuery = (
    query: PaginationQuery,
    defaultLimit = 10,
): { page: number; limit: number; skip: number } => {
    const page = Math.max(1, parseInt(String(query.page ?? '1'), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? String(defaultLimit)), 10) || defaultLimit));
    return { page, limit, skip: (page - 1) * limit };
};

export const buildPaginatedResult = <T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
): IPaginatedResult<T> => ({
    items,
    pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
    },
});
