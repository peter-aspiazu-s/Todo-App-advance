import { DragEvent, FC, useContext } from 'react';
import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { UIContext } from '../../context/ui/UIContext';
import { Entry } from '../../interfaces';

import { format } from 'date-fns';


interface Props {
    entry: Entry;
}

export const EntryCard:FC<Props>= ({ entry }) => {

    // const createdAtDate = new Date(entry.createdAt); // Convierte la cadena en una instancia de Date

    // if (isNaN(createdAtDate.getTime())) {
    //     // Si la fecha no es válida, puedes mostrar un mensaje de error o manejarlo de la forma que desees.
    //     console.error('Fecha no válida:', entry.createdAt);
    //     console.log({createdAtDate});
    //     return null; // O muestra un mensaje de error
    // }

    // const formattedDate = format(createdAtDate, 'dd/MM/yyyy HH:mm'); // Formatea la fecha con date-fns

    // console.log(formattedDate);

    const { startDragging, endDragging } = useContext( UIContext );
    const router = useRouter()

    const onDragStart = ( event: DragEvent ) => {
        event.dataTransfer.setData('text', entry.id );

        startDragging();
    }

    const onDragEnd = () => {
        endDragging();
    }

    const handleClick = () => {
        router.push(`/entries/${ entry.id }`);
    }

  return (
    <Card
        onClick={ handleClick }
        sx={{ marginBottom: 1 }}
        // Eventos de drag
        draggable
        onDragStart={ onDragStart }
        onDragEnd={ onDragEnd }
    >
        <CardActionArea>
            <CardContent>
                <Typography sx={{ whiteSpace: 'pre-line' }}>{ entry.description }</Typography>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'end', paddingRight: 2 }}>
                <Typography variant='body2'>
                    {entry ? entry.createdAt ? entry.createdAt : 'no hay fecha' : 'no hay fecha'}
                </Typography>
            </CardActions>
        </CardActionArea>
    </Card>
  )
};
