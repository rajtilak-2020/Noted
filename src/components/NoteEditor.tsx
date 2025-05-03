import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNotes } from '@/contexts/NotesContext';
import { Note } from '@/types';
import { PlusCircle, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface NoteEditorProps {
  note: Note | null;
}

export const NoteEditor = ({ note }: NoteEditorProps) => {
  const { updateNote, deleteNote, createNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (note) {
      updateNote(note.id, { title: newTitle });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (note) {
      updateNote(note.id, { content: newContent });
    }
  };

  const handleDelete = () => {
    if (note) {
      deleteNote(note.id);
      setDeleteDialogOpen(false);
    }
  };

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-center text-muted-foreground max-w-md">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Notes App</h2>
          <p className="mb-6">Create your first note to get started organizing your thoughts.</p>
          <div className="flex justify-center">
            <Button 
              onClick={createNote} 
              className="flex items-center gap-1 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <PlusCircle size={18} className="animate-pulse" />
              <span>Create</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center border-b border-border p-4">
        <Input 
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
          className="text-xl font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          maxLength={100}
        />
        
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <Trash2 size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Note</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to permanently delete this note?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Write your note here..."
        className="flex-grow resize-none p-4 bg-transparent border-none rounded-none note-editor"
      />
    </div>
  );
};
