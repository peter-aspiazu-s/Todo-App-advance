import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database/firebase';
import { collection, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Entry, IEntry } from '../../../models';
import { EntryStatus } from '../../../interfaces';


type Data = 
    | { message: string }
    | IEntry[]
    | IEntry

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch ( req.method ) {
        case 'GET':
            return getEntries( res );

        case 'POST':
            return postEntry( req, res );
        
    
        default:
            return res.status(400).json({ message: 'Endpoint no existe' });
    }
}

const getEntries = async (res: NextApiResponse<Data>) => {
    try {
        const collectionRef = collection(db, 'entries');
        const querySnapshot = await getDocs(collectionRef);
        
        // const entries = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        const entries = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            // Convierte createdAt a un formato de fecha deseado aquí
            data.createdAt = data.createdAt.toDate().toISOString(); // O al formato que prefieras
            // return { ...data, id: doc.id };
            return {
                id: doc.id,
                description: data.description,
                createdAt: data.createdAt,
                status: data.status,
            };
        });
        
        return res.status(200).json(entries);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Algo salió mal, revisa la consola del servidor' });
    }
}



const postEntry = async (req: NextApiRequest, res: NextApiResponse<
    { message: string }
    |
    {
        id: string;
        description: string;
        createdAt: any;
        status: EntryStatus;
    }
    >) => {
    const { description = '' } = req.body;
    const status = 'pending';

    try {
        const collectionRef = collection(db, 'entries');
        const docRef = await addDoc(collectionRef, {
            description,
            status,
            createdAt: serverTimestamp(),
        });

        const id = docRef.id; // Obtener el ID generado por Firestore
        const createdAt = new Date().toISOString(); // Establecer la marca de tiempo actual

        return res.status(201).json({ id, description, createdAt, status });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Algo salió mal, revisa la consola del servidor' });
    }
}