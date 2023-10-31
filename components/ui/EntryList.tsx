import { FC, useContext, useMemo, DragEvent } from 'react';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';

import { EntriesContext } from '../../context/entries';
import { UIContext } from '../../context/ui';

import { EntryStatus } from '../../interfaces';
import { EntryCard } from './EntryCard';

import styles from './EntryList.module.css';

interface Props {
    status: EntryStatus;
}


export const EntryList:FC<Props> = ({ status }) => {

    const { entries, updateEntry } = useContext( EntriesContext );
    const { isDragging, endDragging } = useContext( UIContext );

    const entriesByStatus = useMemo( () => entries.filter( entry => entry.status === status ), [ entries ]);

    const allowDrop = ( event: DragEvent<HTMLDivElement> ) => {
        event.preventDefault();
    }

    const onDropEntry = ( event: DragEvent<HTMLDivElement> ) => {
        const id = event.dataTransfer.getData('text');

        // console.log(event.dataTransfer.getData('text/plain'));
        
        const entry = entries.find( e => e.id === id )!;
        if (entry) {
            // Verifica que entry no sea undefined
            entry.status = status;
            updateEntry(entry);
            endDragging();
        }
    }

      
    return (
        //   TODO: aquí haremos drop
        <div
            onDrop={ onDropEntry }
            onDragOver={ allowDrop }
            className={ isDragging ? styles.dragging : '' }
        >
            <Paper sx={{ height: 'calc(100vh - 180px)', overflow: 'scroll', backgroundColor: 'transparent', padding: '3px 5px'  }}>

                <List sx={{ opacity: isDragging ? 0.2 : 1, transition: 'all .3s' }}> 
                    {
                        entriesByStatus.map( entry => (
                            <EntryCard key={ entry.id } entry={ entry } />
                        ))
                    }
                </List>

            </Paper>
        </div>
    )
};
