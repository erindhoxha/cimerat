import { format } from 'date-fns';
import { sq } from 'date-fns/locale';

export const formatDate = (date: Date) => {
  return format(date, 'd MMMM, yyyy', { locale: sq });
};
