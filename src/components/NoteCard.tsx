
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Note } from '@/types';

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

export const NoteCard = ({ note, isActive, onClick }: NoteCardProps) => {
  // Get a plain text preview of the content
  const contentPreview = (note.content.length > 60)
    ? `${note.content.substring(0, 60)}...`
    : note.content;
  
  const formattedDate = format(new Date(note.updatedAt), 'MMM d, yyyy');

  return (
    <div 
      className={cn(
        "p-4 border rounded-md cursor-pointer transition-all duration-200 mb-2 animate-fade-in",
        isActive 
          ? "border-primary bg-secondary" 
          : "border-note-border bg-card hover:bg-note-hover"
      )}
      onClick={onClick}
    >
      <h3 className="font-medium text-foreground truncate mb-1">{note.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{contentPreview}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        {note.tags && note.tags.length > 0 && (
          <div className="flex gap-1">
            {note.tags.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className="text-xs px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 2 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground">
                +{note.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
