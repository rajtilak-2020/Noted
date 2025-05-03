
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export type SortOption = 'title' | 'createdAt' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface NotesState {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  sortBy: SortOption;
  sortDirection: SortDirection;
  isLoading: boolean;
  error: string | null;
}

export interface NotesContextType {
  state: NotesState;
  createNote: () => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  searchNotes: (query: string) => void;
  sortNotes: (sortBy: SortOption, direction: SortDirection) => void;
}
