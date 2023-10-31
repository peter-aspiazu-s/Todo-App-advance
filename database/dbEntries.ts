import { doc, getDoc } from 'firebase/firestore';
import {db} from './firebase';


export const getEntryById = async( id: string ) => {

    const entryRef = doc(db, 'entries', id);

    try {
        const entrySnapshot = await getDoc(entryRef);
        
        if (!entrySnapshot.exists()) {
          return null;
        }
    
        const entryData = entrySnapshot.data();
    
        // Agrega el id al objeto de datos
        entryData.id = entrySnapshot.id;
    
        return entryData;
      } catch (error) {
        console.error(error);
        return null;
      }

}