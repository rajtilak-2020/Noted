
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Filter } from 'lucide-react';
import { useNotes } from '@/contexts/NotesContext';
import { NoteCard } from './NoteCard';
import { SearchBar } from './SearchBar';
import { Note, SortOption } from '@/types';

interface SidebarProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar = ({ isMobile, onCloseMobile }: SidebarProps) => {
  const { state, createNote, setActiveNote, sortNotes } = useNotes();
  const { notes, activeNoteId, searchQuery, sortBy, sortDirection } = state;

  // Filter notes by search query
  const filteredNotes = searchQuery 
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  // Sort notes based on current sort criteria
  const sortedNotes = [...filteredNotes].sort((a: Note, b: Note) => {
    if (sortBy === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  const handleNoteClick = (noteId: string) => {
    setActiveNote(noteId);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleSort = (sortOption: SortOption) => {
    // If already sorting by this option, toggle direction
    const newDirection = sortBy === sortOption && sortDirection === 'asc' ? 'desc' : 'asc';
    sortNotes(sortOption, newDirection);
  };

  const handleCreateNote = () => {
    createNote();
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <div 
      data-sidebar="sidebar"
      className={`flex flex-col h-full bg-sidebar border-r border-border ${isMobile ? 'w-[85%] max-w-xs' : 'w-72'}`}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold text-xl text-sidebar-foreground">Notes</h1>
          <Button 
            onClick={handleCreateNote}
            size="sm" 
            className="rounded-full w-8 h-8 p-0 bg-sidebar-primary hover:bg-sidebar-primary/90 transition-all duration-300 hover:scale-105"
          >
            <Plus size={16} />
          </Button>
        </div>
        <SearchBar />
      </div>
      
      <div className="p-2 border-b border-border flex justify-between items-center">
        <span className="text-xs text-muted-foreground px-2">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Filter size={14} className="mr-1" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSort('title')}>
              By Title {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('createdAt')}>
              By Created Date {sortBy === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('updatedAt')}>
              By Updated Date {sortBy === 'updatedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        {sortedNotes.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            <p>No notes found</p>
            {searchQuery && (
              <p className="text-sm">Try a different search</p>
            )}
          </div>
        ) : (
          sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onClick={() => handleNoteClick(note.id)}
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
};
