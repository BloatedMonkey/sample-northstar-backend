export const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'priority', 'status'] as const;

export type SortableField = (typeof SORTABLE_FIELDS)[number];

export const SORT_DIRECTIONS = ['asc', 'desc'] as const;

export type SortDirection = (typeof SORT_DIRECTIONS)[number];
