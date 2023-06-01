import { RequestQuery } from '../types';
import { getSortingValue } from './getSortingValue';

export const getQueryParams = (queries: RequestQuery) => {
  return {
    ...queries,
    sort: getSortingValue(queries.sort),
    limit: +queries.limit,
    page: +queries.page,
    skip: +queries.limit * (+queries.page - 1),
  };
};
