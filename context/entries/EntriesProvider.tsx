import { FC, useEffect, useReducer } from 'react';

import { useSnackbar } from 'notistack';


import { entriesApi } from '../../apis';
import { Entry } from '../../interfaces';
import { EntriesContext, entriesReducer } from './';


export interface EntriesState {
    entries: Entry[];
}


const Entries_INITIAL_STATE: EntriesState = {
    entries: [],
}


export const EntriesProvider:FC = ({ children }) => {

    const [state, dispatch] = useReducer( entriesReducer , Entries_INITIAL_STATE );
    const { enqueueSnackbar } = useSnackbar();


    const addNewEntry = async( description: string ) => {

        const { data } = await entriesApi.post<Entry>('/entries', { description });
        // dispatch({ type: '[Entry] Add-Entry', payload: data });

        await refreshEntries();
        
        if (data.id) {
            console.log('desde addNewEntry ', data);
            // Obtener el ID generado por Firestore
            const newEntry = {
                id: data.id,
                description: data.description,
                status: data.status,
                createdAt: ''
            };
    
            // Formatear la fecha antes de agregarla
            const createdAtDate = new Date(data.createdAt);
            const formattedCreatedAt = createdAtDate.toISOString();
            newEntry.createdAt = formattedCreatedAt;
    
            dispatch({ type: '[Entry] Add-Entry', payload: newEntry });
        }

    }

    const updateEntry = async( { id, description, status }: Entry, showSnackbar = false ) => {
        try {
            const { data } = await entriesApi.put<Entry>(`/entries/${ id }`, { description, status });
            
            await refreshEntries();

            dispatch({ type: '[Entry] Entry-Updated', payload: data });
            

            if ( showSnackbar )
                enqueueSnackbar('Entrada actualizada', {
                    variant: 'success',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                })

        } catch (error) {
            console.log({ error });
        }
    }

    const refreshEntries = async() => {
        const { data } = await entriesApi.get<Entry[]>('/entries');
        dispatch({ type: '[Entry] Refresh-Data', payload: data });
    }

    useEffect(() => {
      refreshEntries();
    }, []);
    


    return (
        <EntriesContext.Provider value={{
            ...state,

            // Methods
            addNewEntry,
            updateEntry,
        }}>
            { children }
        </EntriesContext.Provider>
    )
};