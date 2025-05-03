
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNotes } from '@/contexts/NotesContext';
import { Note } from '@/types';

interface NoteEditorProps {
  note: Note | null;
}

export const NoteEditor = ({ note }: NoteEditorProps) => {
  const { updateNote, createNote } = useNotes();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!note) return;
    updateNote(note.id, {
      title: e.target.value,
      updatedAt: new Date(),
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!note) return;
    updateNote(note.id, {
      content: e.target.value,
      updatedAt: new Date(),
    });
  };

  if (!note) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-4">
        <div className="text-center text-muted-foreground max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Notes App</h2>
          <p className="mb-6">Create your first note to get started organizing your thoughts.</p>
          <div className="flex justify-center">
            <Button 
              onClick={createNote} 
              className="flex items-center gap-2 transition-all duration-300 hover:scale-105 animate-pulse"
              size="lg"
            >
              <PlusCircle size={18} />
              <span>Create New Note</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 flex flex-col">
      <input
        type="text"
        value={note.title}
        onChange={handleTitleChange}
        placeholder="Title"
        className="bg-transparent border-none text-2xl font-bold mb-4 w-full focus:outline-none focus:ring-1 focus:ring-primary rounded p-1"
      />
      <textarea
        value={note.content}
        onChange={handleContentChange}
        placeholder="Start typing your note..."
        className="bg-transparent flex-1 resize-none border-none text-lg w-full focus:outline-none focus:ring-1 focus:ring-primary rounded p-1 scrollbar-thin"
      />
    </div>
  );
};
