import type { NextApiRequest, NextApiResponse } from 'next';
import {db} from '../../../../database/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Entry, IEntry } from '../../../../models';

type Data =
  | { message: string }
  | IEntry;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query as { id: string };

  switch (req.method) {
    case 'PUT':
      return updateEntry(id, req, res);

    case 'GET':
      return getEntry(id, res);

    default:
      return res.status(400).json({ message: 'Método no existe ' + req.method });
  }
}

const getEntry = async (id: string, res: NextApiResponse<Data>) => {
  const entryRef = doc(db, 'entries', id);
  
  try {
    const entrySnapshot = await getDoc(entryRef);
    if (!entrySnapshot.exists()) {
      return res.status(400).json({ message: 'No hay entrada con ese ID: ' + id });
    }
    const entryData = entrySnapshot.data() as IEntry;
    console.log(entryData);

    return res.status(200).json(entryData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Algo salió mal, revisa la consola del servidor' });
  }
};

const updateEntry = async (id: string, req: NextApiRequest, res: NextApiResponse<Data>) => {
  const entryRef = doc(db, 'entries', id);

  const { description, status } = req.body as IEntry;

  try {
    const entrySnapshot = await getDoc(entryRef);
    if (!entrySnapshot.exists()) {
      return res.status(400).json({ message: 'No hay entrada con ese ID: ' + id });
    }

    await updateDoc(entryRef, { description, status });
    const updatedEntrySnapshot = await getDoc(entryRef);
    const updatedEntryData = updatedEntrySnapshot.data() as IEntry;

    if (!updatedEntryData) {
      return res.status(404).json({ message: 'No se pudo encontrar la entrada actualizada' });
    }

    return res.status(200).json(updatedEntryData);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Algo salió mal, revisa la consola del servidor' });
  }
};