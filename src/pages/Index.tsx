
import React, { useState, useEffect } from 'react';
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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (isMobile && sidebarVisible) {
      const handleOutsideClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-sidebar="sidebar"]') && !target.closest('[data-sidebar="trigger"]')) {
          setSidebarVisible(false);
        }
      };

      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [isMobile, sidebarVisible]);

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-30 bg-background/80 backdrop-blur-sm"
          onClick={toggleSidebar}
          data-sidebar="trigger"
        >
          {sidebarVisible ? <X size={24} /> : <Menu size={24} />}
        </Button>
      )}
      
      {/* Sidebar - always visible on desktop, conditionally on mobile */}
      {(!isMobile || sidebarVisible) && (
        <div 
          className={`${isMobile ? 'fixed inset-0 z-20 animate-fade-in' : 'relative'}`}
        >
          <div className={`${isMobile ? 'absolute inset-0 bg-black/30 backdrop-blur-sm' : 'hidden'}`} />
          <Sidebar 
            isMobile={isMobile} 
            onCloseMobile={() => setSidebarVisible(false)} 
          />
        </div>
      )}
      
      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${isMobile ? 'px-2' : ''}`}>
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
