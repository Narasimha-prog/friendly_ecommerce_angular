import { HttpParams } from '@angular/common/http';

export type SortableField = 'createdDate' | 'lastModifiedDate'; 

export type SortOrder = 'ASC' | 'DESC';



export interface Pagination {
  page: number;
  size: number;
  sort: string[];
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}


export const createPaginationOption = (req: Pagination): HttpParams => {
  let params = new HttpParams();
  params = params.append("page", req.page).append("size", req.size);

  req.sort.forEach(value => {
    params = params.append("sort", value);
  });

  return params;
};

