
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Note, NotesState, NotesContextType, SortOption, SortDirection } from '../types';

// Initial state without demo notes
const initialState: NotesState = {
  notes: [],
  activeNoteId: null,
  searchQuery: '',
  sortBy: 'updatedAt',
  sortDirection: 'desc',
  isLoading: false,
  error: null
};

// Local storage keys
const STORAGE_KEY = 'notes_app_data';

type NotesAction =
  | { type: 'CREATE_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; data: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_ACTIVE_NOTE'; payload: string | null }
  | { type: 'SEARCH_NOTES'; payload: string }
  | { type: 'SORT_NOTES'; payload: { sortBy: SortOption; direction: SortDirection } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_NOTES'; payload: Note[] };

const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'CREATE_NOTE': {
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        activeNoteId: action.payload.id
      };
    }
    case 'UPDATE_NOTE': {
      const { id, data } = action.payload;
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === id ? { ...note, ...data, updatedAt: new Date() } : note
        )
      };
    }
    case 'DELETE_NOTE': {
      const noteId = action.payload;
      const filteredNotes = state.notes.filter(note => note.id !== noteId);
      
      return {
        ...state,
        notes: filteredNotes,
        activeNoteId: filteredNotes.length > 0 ? filteredNotes[0].id : null
      };
    }
    case 'SET_ACTIVE_NOTE': {
      return {
        ...state,
        activeNoteId: action.payload
      };
    }
    case 'SEARCH_NOTES': {
      return {
        ...state,
        searchQuery: action.payload
      };
    }
    case 'SORT_NOTES': {
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.direction
      };
    }
    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      };
    }
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload
      };
    }
    case 'LOAD_NOTES': {
      const notes = action.payload;
      return {
        ...state,
        notes,
        activeNoteId: notes.length > 0 ? notes[0].id : null
      };
    }
    default:
      return state;
  }
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // Load notes from local storage on initial load
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          
          // Convert string dates back to Date objects
          const processedNotes = parsedData.notes.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt)
          }));
          
          dispatch({ type: 'LOAD_NOTES', payload: processedNotes });
        }
      } catch (error) {
        console.error('Failed to load notes from localStorage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load your notes. Please try again.' });
      }
    };

    loadNotes();
  }, []);

  // Save notes to local storage whenever they change
  useEffect(() => {
    try {
      const dataToSave = {
        notes: state.notes,
        sortBy: state.sortBy,
        sortDirection: state.sortDirection
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save notes to localStorage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save your changes. Please try again.' });
    }
  }, [state.notes, state.sortBy, state.sortDirection]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dispatch({ type: 'CREATE_NOTE', payload: newNote });
  };

  const updateNote = (id: string, data: Partial<Note>) => {
    dispatch({ type: 'UPDATE_NOTE', payload: { id, data } });
  };

  const deleteNote = (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
  };

  const setActiveNote = (id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_NOTE', payload: id });
  };

  const searchNotes = (query: string) => {
    dispatch({ type: 'SEARCH_NOTES', payload: query });
  };

  const sortNotes = (sortBy: SortOption, direction: SortDirection) => {
    dispatch({ type: 'SORT_NOTES', payload: { sortBy, direction } });
  };

  const value: NotesContextType = {
    state,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
    searchNotes,
    sortNotes
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
