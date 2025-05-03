
import React, { ChangeEvent } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNotes } from '@/contexts/NotesContext';

export const SearchBar = () => {
  const { searchNotes, state } = useNotes();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    searchNotes(e.target.value);
  };

  return (
    <div className="relative w-full">
      <div className="absolute left-2.5 top-2.5 text-muted-foreground">
        <Search size={18} />
      </div>
      <Input
        className="w-full pl-9 bg-secondary text-foreground"
        placeholder="Search notes..."
        value={state.searchQuery}
        onChange={handleSearch}
      />
    </div>
  );
};
