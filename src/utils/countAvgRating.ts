import { ReviewWithId } from '../types';

export const countAvgRating = (reviews: ReviewWithId[]): number => {
  const rating = reviews.reduce((acc, curr) => acc + curr.rating, 0);

  if (rating <= 0) {
    return 0;
  }

  return Math.ceil(rating / reviews.length);
};
