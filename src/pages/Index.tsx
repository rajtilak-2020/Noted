
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { NotesProvider, useNotes } from '@/contexts/NotesContext';
import { Sidebar } from '@/components/Sidebar';
import { NoteEditor } from '@/components/NoteEditor';

const NotesApp = () => {
  const { state } = useNotes();
  const isMobile = useIsMobile();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const activeNote = state.notes.find(note => note.id === state.activeNoteId) || null;

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-20"
          onClick={toggleSidebar}
        >
          {sidebarVisible ? <X size={24} /> : <Menu size={24} />}
        </Button>
      )}
      
      {/* Sidebar - always visible on desktop, conditionally on mobile */}
      {(!isMobile || sidebarVisible) && (
        <div 
          className={`${isMobile ? 'fixed inset-0 z-10 animate-slide-in' : 'relative'}`}
        >
          <Sidebar 
            isMobile={isMobile} 
            onCloseMobile={() => setSidebarVisible(false)} 
          />
        </div>
      )}
      
      {/* Main content area */}
      <div className={`flex-1 flex flex-col ${isMobile && sidebarVisible ? 'hidden' : 'block'}`}>
        <main className="flex-1 h-full">
          <NoteEditor note={activeNote} />
        </main>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <NotesProvider>
      <NotesApp />
    </NotesProvider>
  );
};

export default Index;
