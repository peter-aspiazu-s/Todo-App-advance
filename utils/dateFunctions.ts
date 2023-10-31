import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';


export const getFormatDistanceToNow = ( timestamp: Timestamp ) => {

    if (!timestamp || !timestamp.toDate) {
        return 'Tiempo no disponible (Formato incorrecto)';
      }
    
    const timestampDate = timestamp.toDate();
    const currentDate = new Date();
    const differenceInMillis = currentDate.getTime() - timestampDate.getTime();
    const fromNow = formatDistanceToNow(timestampDate, { locale: es });
    return `hace ${fromNow}`;

}
