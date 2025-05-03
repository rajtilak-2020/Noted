
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Note, NotesState, NotesContextType, SortOption, SortDirection } from '../types';

// Initial demo notes
const demoNotes: Note[] = [
  {
    id: '1',
    title: 'Getting Started with Notes App',
    content: 'Welcome to your new Notes App! This is a simple app to help you organize your thoughts and ideas. You can create, edit, and delete notes. You can also search for notes and sort them by title, creation date, or last updated date.',
    createdAt: new Date('2023-05-15T10:00:00'),
    updatedAt: new Date('2023-05-15T10:00:00'),
    tags: ['welcome', 'tutorial']
  },
  {
    id: '2',
    title: 'Features of Notes App',
    content: 'This Notes App comes with a variety of features:\n\n- Create, edit, and delete notes\n- Rich text editing\n- Search for notes\n- Sort notes by title, creation date, or last updated date\n- Tag your notes for better organization',
    createdAt: new Date('2023-05-15T11:00:00'),
    updatedAt: new Date('2023-05-15T12:30:00'),
    tags: ['features', 'tutorial']
  },
  {
    id: '3',
    title: 'Markdown Support',
    content: 'You can use Markdown in your notes to format text. For example:\n\n**This text is bold**\n*This text is italic*\n\n# This is a heading\n\n- This is a bullet point\n- This is another bullet point',
    createdAt: new Date('2023-05-16T09:00:00'),
    updatedAt: new Date('2023-05-16T15:45:00'),
    tags: ['markdown', 'tips']
  }
];

const initialState: NotesState = {
  notes: demoNotes,
  activeNoteId: demoNotes[0].id,
  searchQuery: '',
  sortBy: 'updatedAt',
  sortDirection: 'desc',
  isLoading: false,
  error: null
};

type NotesAction =
  | { type: 'CREATE_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; data: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_ACTIVE_NOTE'; payload: string | null }
  | { type: 'SEARCH_NOTES'; payload: string }
  | { type: 'SORT_NOTES'; payload: { sortBy: SortOption; direction: SortDirection } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

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
    default:
      return state;
  }
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

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
