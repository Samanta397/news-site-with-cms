import { format } from 'date-fns';

export const formatDate = (date: Date) => {
  return format(new Date(date), 'LLL L, yyyy k:mm aaa');
};
