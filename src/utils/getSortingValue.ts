import { ProductWithId } from './../types';
import { SortingValues } from '../types';
import { SortOrder } from 'mongoose';

export const getSortingValue = (
  sortingType: SortingValues
): {
  [key in keyof ProductWithId]?: SortOrder;
} => {
  switch (sortingType) {
    case 'PRICE_ASC':
      return { price: 'asc' };
    case 'PRICE_DESC':
      return { price: 'desc' };
    case 'NAME':
      return { name: 'asc' };
    case 'DISCOUNT':
      return { discount: 'desc' };
    case 'DATE_NEWEST':
      return { _id: 'desc' };
    case 'DATE_OLDEST':
      return { _id: 'asc' };
    default:
      return { price: 'asc' };
  }
};
